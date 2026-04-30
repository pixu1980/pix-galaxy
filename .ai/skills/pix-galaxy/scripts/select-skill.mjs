// @ts-check

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * @typedef {"high" | "medium" | "low"} Confidence
 */

const pix_GALAXY_SLASH_COMMAND = '/pix-galaxy';

/**
 * @typedef {{
 *   keywords: string[];
 *   regex: string[];
 *   fileExtensions: string[];
 *   operations: string[];
 *   intents: string[];
 * }} SkillTriggers
 */

/**
 * @typedef {{
 *   name: string;
 *   priority: number;
 *   description: string;
 *   triggers: SkillTriggers;
 * }} SkillConfig
 */

/**
 * @typedef {{
 *   schemaVersion: number;
 *   defaultSkill: string;
 *   minimumConfidence: Confidence;
 *   confidenceThresholds: {
 *     high: number;
 *     medium: number;
 *   };
 *   tieBreakers: string[];
 *   weights: {
 *     keyword: number;
 *     regex: number;
 *     fileExtension: number;
 *     operation: number;
 *     intent: number;
 *   };
 *   skills: SkillConfig[];
 * }} Registry
 */

/**
 * Read CLI args in a simple predictable format.
 * @param {string[]} argv
 * @returns {{ prompt: string; files: string[]; operation: string }}
 */
export const parseArgs = (argv) => {
  const promptIndex = argv.findIndex((arg) => arg === '--prompt');
  const filesIndex = argv.findIndex((arg) => arg === '--files');
  const operationIndex = argv.findIndex((arg) => arg === '--operation');

  if (promptIndex === -1 || !argv[promptIndex + 1]) {
    throw new Error('Missing required argument: --prompt "<user prompt>"');
  }

  const filesArg = filesIndex !== -1 ? argv[filesIndex + 1] ?? '' : '';
  const operation = operationIndex !== -1 ? argv[operationIndex + 1] ?? '' : '';
  const files = filesArg
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    prompt: argv[promptIndex + 1],
    files,
    operation,
  };
};

/**
 * @param {string} value
 * @returns {string}
 */
const normalize = (value) => value.trim().toLowerCase();

/**
 * @param {string} prompt
 * @returns {{ prompt: string; slashCommandUsed: boolean }}
 */
export const extractRoutablePrompt = (prompt) => {
  const trimmed = prompt.trim();
  const lowered = trimmed.toLowerCase();

  if (!lowered.startsWith(pix_GALAXY_SLASH_COMMAND)) {
    return {
      prompt,
      slashCommandUsed: false,
    };
  }

  const routablePrompt = trimmed.slice(pix_GALAXY_SLASH_COMMAND.length).trim();

  return {
    prompt: routablePrompt,
    slashCommandUsed: true,
  };
};

/**
 * @param {string} tieBreaker
 * @param {{ name: string; priority: number; score: number }} left
 * @param {{ name: string; priority: number; score: number }} right
 * @returns {number}
 */
const compareByTieBreaker = (tieBreaker, left, right) => {
  if (tieBreaker === 'score') {
    return right.score - left.score;
  }

  if (tieBreaker === 'priority') {
    return right.priority - left.priority;
  }

  if (tieBreaker === 'name') {
    return left.name.localeCompare(right.name);
  }

  return 0;
};

/**
 * @param {number} score
 * @param {Registry["confidenceThresholds"]} thresholds
 * @returns {Confidence}
 */
export const classifyConfidence = (score, thresholds) => {
  if (score >= thresholds.high) {
    return 'high';
  }

  if (score >= thresholds.medium) {
    return 'medium';
  }

  return 'low';
};

/**
 * @param {Confidence} left
 * @param {Confidence} right
 * @returns {number}
 */
const compareConfidence = (left, right) => {
  const rank = {
    low: 1,
    medium: 2,
    high: 3,
  };

  return rank[left] - rank[right];
};

/**
 * @param {string} prompt
 * @param {string[]} patterns
 * @returns {string[]}
 */
const matchRegexPatterns = (prompt, patterns) => {
  return patterns.filter((pattern) => {
    try {
      return new RegExp(pattern, 'i').test(prompt);
    } catch {
      return false;
    }
  });
};

/**
 * @param {string[]} files
 * @param {string[]} extensions
 * @returns {string[]}
 */
const matchFileExtensions = (files, extensions) => {
  return extensions.filter((extension) => {
    return files.some((file) => normalize(file).endsWith(normalize(extension)));
  });
};

/**
 * @param {string} prompt
 * @param {string[]} intents
 * @returns {string[]}
 */
const matchIntents = (prompt, intents) => {
  return intents.filter((intent) => normalize(prompt).includes(normalize(intent)));
};

/**
 * @param {string} operation
 * @param {string[]} supportedOperations
 * @returns {boolean}
 */
const matchOperation = (operation, supportedOperations) => {
  if (!operation.trim()) {
    return false;
  }

  return supportedOperations.some((supported) => normalize(supported) === normalize(operation));
};

/**
 * @param {Registry} registry
 * @param {string} prompt
 * @param {string[]} files
 * @param {string} operation
 * @returns {{
 *   selectedSkill: string;
 *   confidence: Confidence;
 *   reason: string;
 *   score: number;
 *   fallbackUsed: boolean;
 *   slashCommandUsed: boolean;
 *   routedPrompt: string;
 *   scoredSkills: Array<{ name: string; priority: number; score: number }>;
 *   recommendedSkills: Array<{ name: string; confidence: Confidence; score: number }>;
 * }}
 */
export const selectSkill = (registry, prompt, files = [], operation = '') => {
  const { prompt: routedPrompt, slashCommandUsed } = extractRoutablePrompt(prompt);
  const normalizedPrompt = normalize(routedPrompt);

  const scoredSkills = registry.skills.map((skill) => {
    const keywordMatches = skill.triggers.keywords.filter((trigger) => normalizedPrompt.includes(normalize(trigger)));
    const regexMatches = matchRegexPatterns(routedPrompt, skill.triggers.regex);
    const extensionMatches = matchFileExtensions(files, skill.triggers.fileExtensions);
    const intentMatches = matchIntents(routedPrompt, skill.triggers.intents);
    const operationMatched = matchOperation(operation, skill.triggers.operations);

    const score =
      keywordMatches.length * registry.weights.keyword +
      regexMatches.length * registry.weights.regex +
      extensionMatches.length * registry.weights.fileExtension +
      intentMatches.length * registry.weights.intent +
      (operationMatched ? registry.weights.operation : 0);

    const reasons = [];

    keywordMatches.length > 0 && reasons.push(`keyword: ${keywordMatches.join(', ')}`);
    regexMatches.length > 0 && reasons.push(`regex: ${regexMatches.join(', ')}`);
    extensionMatches.length > 0 && reasons.push(`extensions: ${extensionMatches.join(', ')}`);
    intentMatches.length > 0 && reasons.push(`intent: ${intentMatches.join(', ')}`);
    operationMatched && reasons.push(`operation: ${operation}`);

    return {
      name: skill.name,
      priority: skill.priority,
      score,
      reasons,
    };
  });

  const sorted = [...scoredSkills].sort((left, right) => {
    for (const tieBreaker of registry.tieBreakers) {
      const result = compareByTieBreaker(tieBreaker, left, right);

      if (result !== 0) {
        return result;
      }
    }

    return 0;
  });

  const winner = sorted[0];
  const computedConfidence = classifyConfidence(winner?.score ?? 0, registry.confidenceThresholds);
  const belowThreshold = compareConfidence(computedConfidence, registry.minimumConfidence) < 0;
  const recommendedSkills = sorted
    .filter((item) => item.score > 0)
    .slice(0, 3)
    .map((item) => ({
      name: item.name,
      confidence: classifyConfidence(item.score, registry.confidenceThresholds),
      score: item.score,
    }));

  if (!winner || winner.score === 0 || belowThreshold) {
    const reason = winner && belowThreshold
      ? `Top match was below minimum confidence (${registry.minimumConfidence}). Falling back to ${registry.defaultSkill}.`
      : `No rule matched. Falling back to default skill: ${registry.defaultSkill}.`;

    return {
      selectedSkill: registry.defaultSkill,
      confidence: 'low',
      reason,
      score: winner?.score ?? 0,
      fallbackUsed: true,
      slashCommandUsed,
      routedPrompt,
      scoredSkills: sorted.map((item) => ({
        name: item.name,
        priority: item.priority,
        score: item.score,
      })),
      recommendedSkills,
    };
  }

  const reason = winner.reasons.length > 0
    ? winner.reasons.join(' | ')
    : 'Selected by score and priority.';

  return {
    selectedSkill: winner.name,
    confidence: computedConfidence,
    reason,
    score: winner.score,
    fallbackUsed: false,
    slashCommandUsed,
    routedPrompt,
    scoredSkills: sorted.map((item) => ({
      name: item.name,
      priority: item.priority,
      score: item.score,
    })),
    recommendedSkills,
  };
};

/**
 * @returns {Promise<void>}
 */
const main = async () => {
  const { prompt, files, operation } = parseArgs(process.argv.slice(2));
  const currentFile = fileURLToPath(import.meta.url);
  const registryPath = path.join(path.dirname(currentFile), '../assets/registry.json');

  const registryRaw = await readFile(registryPath, 'utf8');
  /** @type {Registry} */
  const registry = JSON.parse(registryRaw);

  const result = selectSkill(registry, prompt, files, operation);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
};

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : '';
const isDirectRun = invokedFile === currentFile;

if (isDirectRun) {
  main().catch((error) => {
    process.stderr.write(`pix-galaxy router error: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
