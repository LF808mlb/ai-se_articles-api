import 'dotenv/config';
import { readFileSync } from 'fs';
const PORT = Number(process.env.PORT || 3000);
const BASE = `http://localhost:${process.env.PORT}`;
let pass = 0;
let fail = 0;

class Skip extends Error { }

async function test(label, fn) {
  try {
    await fn();
    console.log(`✅ ${label}`);
    pass++;
  } catch (err) {
    if (err instanceof Skip) {
      console.log(`○ ${label} — ${err.message}`);
    } else {
      console.log(`❌ ${label} — ${err.message}`);
      fail++;
    }
  }
}

function expect(value, label) {
  return {
    toBe(expected) {
      if (value !== expected) throw new Error(`${label}: expected ${expected}, got ${value}`);
    },
    toEqual(expected) {
      if (JSON.stringify(value) !== JSON.stringify(expected))
        throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(value)}`);
    },
    toBeDefined() {
      if (value === undefined) throw new Error(`${label}: expected ${value} to be defined`);
    },
    toBeNumber() {
      if (typeof value !== 'number' || isNaN(value)) throw new Error(`${label}: expected ${value} to be a number`);
    },
    toBeString() {
      if (typeof value !== 'string') throw new Error(`${label}: expected ${value} to be a string`);
    },
    toBeTruthy() {
      if (!value) throw new Error(`${label}: expected ${value} to be truthy`);
    },
    toBeFalsy() {
      if (value) throw new Error(`${label}: expected ${value} to be falsy`);
    },
  };
}

console.log('\nLesson 02: Environment Variables and dotenv\n');

await test('PORT has been set in environment variables', async () => {
  const _PORT = +process.env.PORT;
  expect(_PORT, '_PORT').toBeDefined();
  expect(_PORT, '_PORT').toBeNumber();
});

await test('MongoURI has been set in environment variables', async () => {
  const _MONGO_URI = process.env.MONGO_URI;
  expect(_MONGO_URI, '_MONGO_URI').toBeDefined();
  expect(_MONGO_URI, '_MONGO_URI').toBeString();
});

await test(`GET /health — server is running on port ${PORT}`, async () => {
  const res = await fetch(`${BASE}/health`);
  expect(res.status, 'status').toBe(200);
  const body = await res.json();
  expect(body.status, 'body.status').toBe('ok');
});

await test('GET /health — port comes from process.env.PORT', async () => {
  const _PORT = process.env.PORT;
  const indexTs = readFileSync('./src/index.ts', 'utf8');
  const portTest = /port\s*=\s*process\.env\.PORT/.test(indexTs);
  expect(portTest, 'portTest').toBeTruthy();
  const res = await fetch(`${BASE}/health`);
  const body = await res.json();
  expect(body.port, 'body.port').toBe(_PORT);
});

await test('GET /health — mongoUri comes from process.env.MONGO_URI', async () => {
  const indexTs = readFileSync('./src/index.ts', 'utf8');
  const mongoUriTest = /mongoUri\s*=\s*process\.env\.MONGO_URI/.test(indexTs);
  expect(mongoUriTest, 'mongoUriTest').toBeTruthy();
  const _MONGO_URI = process.env.MONGO_URI;
  const res = await fetch(`${BASE}/health`);
  const body = await res.json();
  expect(body.mongoUri, 'body.mongoUri').toBe(_MONGO_URI);
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from('dHo4LWZ2bmM=', 'base64').toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
