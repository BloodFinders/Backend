const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');

async function fixUsers() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const result = await User.updateMany(
      {},
      {
        $set: {
          isVerified: true,
          failedLoginAttempts: 0,
          lockUntil: null,
          status: 'Active',
        },
      }
    );

    console.log('Update result:', result);

    const rahul = await User.findOne({ email: 'rahul@gmail.com' });
    console.log('Rahul status:', {
      name: rahul?.name,
      email: rahul?.email,
      isVerified: rahul?.isVerified,
      status: rahul?.status,
    });

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error fixing users:', error);
    process.exit(1);
  }
}

fixUsers();
