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
    toBeTrue() {
      if (value !== true) throw new Error(`${label}: expected true, got ${value}`);
    },
    toBeNull() {
      if (value !== null) throw new Error(`${label}: expected null, got ${value}`);
    },
    toBeArray() {
      if (!Array.isArray(value)) throw new Error(`${label}: expected an array, got ${typeof value}`);
    },
    toBeString() {
      if (typeof value !== 'string') throw new Error(`${label}: expected a string, got ${typeof value}`);
    },
  };
}

function createTestPdf() {
  const stream = 'BT /F1 12 Tf 72 720 Td (Test article for RAG pipeline.) Tj ET';
  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 =
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]' +
    ' /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n';
  const obj4 = `4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`;
  const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';

  const header = '%PDF-1.4\n';
  let pos = header.length;
  const o1 = pos; pos += obj1.length;
  const o2 = pos; pos += obj2.length;
  const o3 = pos; pos += obj3.length;
  const o4 = pos; pos += obj4.length;
  const o5 = pos; pos += obj5.length;
  const xrefStart = pos;

  const pad = (n) => String(n).padStart(10, '0');
  const xref =
    'xref\n0 6\n' +
    '0000000000 65535 f \n' +
    `${pad(o1)} 00000 n \n` +
    `${pad(o2)} 00000 n \n` +
    `${pad(o3)} 00000 n \n` +
    `${pad(o4)} 00000 n \n` +
    `${pad(o5)} 00000 n \n`;

  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(header + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer);
}

console.log('\nLesson 05: Extracting and Chunking PDF Text\n');

let createdDocumentId = null;

await test('GET /documents — returns success with an array', async () => {
  const res = await fetch(`${BASE}/documents`);
  expect(res.status, 'status').toBe(200);
  const body = await res.json();
  expect(body.success, 'body.success').toBeTrue();
  expect(body.data, 'body.data').toBeArray();
  expect(body.error, 'body.error').toBeNull();
});

await test('POST /documents — uploads a PDF and returns the created document', async () => {
  const pdf = createTestPdf();
  const formData = new FormData();
  formData.append('file', new Blob([pdf], { type: 'application/pdf' }), 'test.pdf');
  formData.append('title', 'Test Article');

  const res = await fetch(`${BASE}/documents`, { method: 'POST', body: formData });
  expect(res.status, 'status').toBe(201);
  const body = await res.json();
  expect(body.success, 'body.success').toBeTrue();
  expect(body.error, 'body.error').toBeNull();
  expect(body.data.title, 'body.data.title').toBe('Test Article');
  expect(body.data._id, 'body.data._id').toBeString();
  createdDocumentId = body.data._id;
});

await test('POST /documents — missing file returns 400', async () => {
  const res = await fetch(`${BASE}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'No file' }),
  });
  expect(res.status, 'status').toBe(400);
  const body = await res.json();
  expect(body.success, 'body.success').toBe(false);
});

await test('GET /documents — uploaded document appears in the list', async () => {
  if (!createdDocumentId) throw new Skip('POST /documents must pass first');
  const res = await fetch(`${BASE}/documents`);
  const body = await res.json();
  const found = body.data.some((d) => d._id === createdDocumentId);
  if (!found) throw new Error(`document ${createdDocumentId} not in GET /documents response`);
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from('anE4LXhocmI=', 'base64').toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
