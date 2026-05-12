import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

let pass = 0;
let fail = 0;

async function test(label, fn) {
  try {
    await fn();
    console.log(`✅ ${label}`);
    pass++;
  } catch (err) {
    console.log(`❌ ${label} — ${err.message}`);
    fail++;
  }
}

console.log('\nLesson 04: Project Overview and Dependencies\n');

await test('multer is in dependencies', () => {
  if (!pkg.dependencies?.multer) throw new Error('multer not found in dependencies');
});

await test('pdf-parse is in dependencies', () => {
  if (!pkg.dependencies?.['pdf-parse']) throw new Error('pdf-parse not found in dependencies');
});

await test('openai is in dependencies', () => {
  if (!pkg.dependencies?.openai) throw new Error('openai not found in dependencies');
});

await test('@types/multer is in devDependencies', () => {
  if (!pkg.devDependencies?.['@types/multer'])
    throw new Error('@types/multer not found in devDependencies');
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from('dnA1LWttd3Q=', 'base64').toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
