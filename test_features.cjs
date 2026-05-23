const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') }));
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING FEATURE TESTS ---');

  // 1. Volunteer Registration
  console.log('\nTesting Volunteer Registration...');
  const volRes = await request({
    hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    role: 'volunteer', name: 'Test Vol', email: 'vol@test.com', phone: '1111111111', 
    age: '25', location: 'Bangalore', pin: '123456'
  });
  console.log('Volunteer Register:', volRes.statusCode, volRes.body);

  // 2. NGO Registration
  console.log('\nTesting NGO Registration...');
  const ngoRes = await request({
    hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    role: 'ngo', name: 'Test NGO', email: 'ngo@test.com', phone: '2222222222',
    ngoDarpanId: 'NGO-123', pin: '123456'
  });
  console.log('NGO Register:', ngoRes.statusCode, ngoRes.body);

  // 3. Company Registration
  console.log('\nTesting Company Registration...');
  const comRes = await request({
    hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    role: 'company', name: 'Test Company', email: 'com@test.com', phone: '3333333333',
    cin: 'CIN-123', pin: '123456'
  });
  console.log('Company Register:', comRes.statusCode, comRes.body);

  // 4. Login Tests
  console.log('\nTesting Login...');
  const volLogin = await request({
    hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { gcId: volRes.body.user?.gcId, pin: '123456', role: 'volunteer' });
  console.log('Volunteer Login:', volLogin.statusCode);

  const ngoLogin = await request({
    hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { gcId: ngoRes.body.user?.gcId, pin: '123456', role: 'ngo' });
  console.log('NGO Login:', ngoLogin.statusCode);

  const comLogin = await request({
    hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { gcId: comRes.body.user?.gcId, pin: '123456', role: 'company' });
  console.log('Company Login:', comLogin.statusCode);

  console.log('\n--- TESTS COMPLETE ---');
}

runTests().catch(console.error);
