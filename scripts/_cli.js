// @ts-check

export const COLORS = Object.freeze({
  reset: '\u001b[0m',
  bold: '\u001b[1m',
  blue: '\u001b[34m',
  cyan: '\u001b[36m',
  gray: '\u001b[90m',
  green: '\u001b[32m',
  magenta: '\u001b[35m',
  red: '\u001b[31m',
  yellow: '\u001b[33m',
});

export const ICONS = Object.freeze({
  info: 'ℹ️',
  success: '✅',
  warn: '⚠️',
  error: '❌',
  step: '🛠️',
  package: '📦',
  docs: '📚',
  test: '🧪',
  clean: '🧹',
  spark: '✨',
});

const LEVEL_COLORS = Object.freeze({
  info: 'cyan',
  success: 'green',
  warn: 'yellow',
  error: 'red',
  step: 'magenta',
});

/**
 * @param {string} text
 * @param {keyof typeof COLORS | 'plain'} color
 * @returns {string}
 */
export function paint(text, color) {
  if (color === 'plain') {
    return text;
  }

  const prefix = COLORS[color] ?? '';
  return `${prefix}${text}${COLORS.reset}`;
}

/**
 * @param {'info' | 'success' | 'warn' | 'error' | 'step'} level
 * @param {string} message
 * @returns {string}
 */
export function formatMessage(level, message) {
  const icon = ICONS[level] ?? ICONS.info;
  const color = LEVEL_COLORS[level] ?? 'plain';
  return `${icon} ${paint(message, color)}`;
}

/**
 * @param {'info' | 'success' | 'warn' | 'error' | 'step'} level
 * @param {string} message
 * @returns {void}
 */
export function log(level, message) {
  const output = formatMessage(level, message);
  if (level === 'error') {
    console.error(output);
    return;
  }

  console.log(output);
}

/**
 * @param {string} title
 * @returns {void}
 */
export function logTitle(title) {
  console.log(`\n${ICONS.spark} ${paint(title, 'bold')}\n`);
}

/**
 * @param {string} label
 * @param {string} value
 * @returns {void}
 */
export function logKeyValue(label, value) {
  console.log(`${paint(label, 'gray')}: ${value}`);
}
