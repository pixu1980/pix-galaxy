/**
 * Add light-dark() CSS fallback: for each `--var: light-dark(A, B);`
 * prepend `--var: A;` so older browsers that don't support light-dark()
 * still get the light mode value instead of dropping the declaration entirely.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const files = [
  'packages/pix-command/src/components/PixCommand/PixCommand.css',
  'packages/pix-color/src/components/PixColor/PixColor.css',
  'packages/pix-recorder/src/components/PixRecorder/PixRecorder.css',
  'packages/pix-sortable/src/components/PixSortable/PixSortable.css',
  'packages/pix-splitter/src/components/PixSplitter/PixSplitter.css',
  'packages/pix-toast/src/components/PixToast/PixToast.css',
];

for (const file of files) {
  const orig = readFileSync(file, 'utf8');
  // Match `--var-name: light-dark(<anything not nested>, <anything>);`
  // and add a fallback with just the light value.
  const result = orig.replace(
    /^(\s*--[\w-]+)\s*:\s*light-dark\(\s*([^,]+?)\s*,\s*([^)]+?)\s*\);/gm,
    (match, varName, lightVal, darkVal) => {
      return `${varName}: ${lightVal};\n${match}`;
    }
  );
  writeFileSync(file, result, 'utf8');
  const count = (result.match(/light-dark/g) || []).length;
  console.log(`✓ ${file} - ${count} light-dark() with fallback`);
}
