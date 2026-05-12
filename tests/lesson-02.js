const BASE = 'http://localhost:3000';
let pass = 0;
let fail = 0;

class Skip extends Error {}

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
  };
}

console.log('\nLesson 02: Environment Variables and dotenv\n');

await test('GET /health — server is running on port 3000', async () => {
  const res = await fetch(`${BASE}/health`);
  expect(res.status, 'status').toBe(200);
  const body = await res.json();
  expect(body.status, 'body.status').toBe('ok');
});

await test('GET /health — port comes from process.env.PORT', async () => {
  const res = await fetch(`${BASE}/health`);
  const body = await res.json();
  expect(body.port, 'body.port').toBe('3000');
});

await test('GET /health — mongoUri comes from process.env.MONGO_URI', async () => {
  const res = await fetch(`${BASE}/health`);
  const body = await res.json();
  expect(body.mongoUri, 'body.mongoUri').toBe('mongodb://127.0.0.1:27017/articles');
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from('dHo4LWZ2bmM=', 'base64').toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
