const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const authController = require('../controllers/authController');

const mockReqRes = (body = {}) => {
  const req = { body };
  let statusCode = 200;
  let responseData = null;

  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
  };

  return { req, res, getResult: () => ({ status: statusCode, data: responseData }) };
};

async function testAllLogins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.\n');

    const testAccounts = [
      { email: 'rahul@gmail.com', password: 'password123', label: 'Donor / User (Rahul)' },
      { email: 'admin1@rakthadan.com', password: 'password123', label: 'Admin 1' },
      { email: 'admin2@rakthadan.com', password: 'password123', label: 'Admin 2' },
      { email: 'admin3@rakthadan.com', password: 'password123', label: 'Admin 3' },
      { email: 'superadmin@rakthadan.com', password: 'password123', label: 'Super Admin' },
    ];

    for (const acc of testAccounts) {
      const mock = mockReqRes({ email: acc.email, password: acc.password });
      await authController.login(mock.req, mock.res, (err) => { throw err; });
      const result = mock.getResult();

      console.log(`[TEST LOGIN] ${acc.label} (${acc.email}):`);
      console.log(`  -> Status: ${result.status}`);
      console.log(`  -> Success: ${result.data?.success}`);
      console.log(`  -> Role: ${result.data?.user?.role}`);
      console.log(`  -> Token Generated: ${!!result.data?.token}`);
      console.log(`  -> Message: ${result.data?.message || 'OK'}\n`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Login test error:', err);
    process.exit(1);
  }
}

testAllLogins();
