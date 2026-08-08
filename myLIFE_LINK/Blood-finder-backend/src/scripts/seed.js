const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Models
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const BloodStock = require('../models/BloodStock');
const Beneficiary = require('../models/Beneficiary');
const DonationHistory = require('../models/DonationHistory');
const Certificate = require('../models/Certificate');
const Notification = require('../models/Notification');
const Reward = require('../models/Reward');
const ActivityLog = require('../models/ActivityLog');

const seedDB = async () => {
  try {
    // Connect to database
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lifelink');
    console.log('DB Connected.');

    // Clear existing data (drop database to clear stale indexes)
    console.log('Dropping database to clear stale collection indexes...');
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped.');

    // 1. Create Users
    console.log('Seeding users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Rahul (Donor & User)
    const rahul = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      phone: '+91 9876543210',
      password: 'password123', // Automatically hashed by pre-save
      role: 'donor',
      gender: 'Male',
      dob: '1996-04-12',
      address: '12-3 Banjara Hills',
      city: 'Hyderabad, Telangana',
      bloodGroup: 'O+',
      isDonor: true,
      donorAvailable: true,
    });

    // Create other donor users
    const ramesh = await User.create({
      name: 'Ramesh Patel',
      email: 'ramesh@gmail.com',
      phone: '+91 9000100001',
      password: 'password123',
      role: 'donor',
      gender: 'Male',
      dob: '1990-01-01',
      address: 'Secunderabad',
      city: 'Hyderabad',
      bloodGroup: 'B+',
      isDonor: true,
      donorAvailable: true,
    });

    const anil = await User.create({
      name: 'Anil Kumar',
      email: 'anil@gmail.com',
      phone: '+91 9000100002',
      password: 'password123',
      role: 'donor',
      gender: 'Male',
      city: 'Hyderabad',
      bloodGroup: 'O+',
      isDonor: true,
      donorAvailable: true,
    });

    const suresh = await User.create({
      name: 'Suresh Reddy',
      email: 'suresh@gmail.com',
      phone: '+91 9000100003',
      password: 'password123',
      role: 'donor',
      gender: 'Male',
      city: 'Hyderabad',
      bloodGroup: 'A+',
      isDonor: true,
      donorAvailable: false,
    });

    const john = await User.create({
      name: 'John Doe',
      email: 'john@gmail.com',
      phone: '+91 9000100004',
      password: 'password123',
      role: 'donor',
      gender: 'Male',
      city: 'Hyderabad',
      bloodGroup: 'AB+',
      isDonor: true,
      donorAvailable: true,
    });

    const neha = await User.create({
      name: 'Neha Singh',
      email: 'neha@gmail.com',
      phone: '+91 9000100005',
      password: 'password123',
      role: 'donor',
      gender: 'Female',
      city: 'Hyderabad',
      bloodGroup: 'B-',
      isDonor: true,
      donorAvailable: true,
    });

    // Create Admins
    const admin1 = await User.create({
      name: 'Admin Kumar',
      email: 'admin1@rakthadan.com',
      phone: '+91 9999900001',
      password: 'password123',
      role: 'admin',
    });

    const admin2 = await User.create({
      name: 'Admin Reddy',
      email: 'admin2@rakthadan.com',
      phone: '+91 9999900002',
      password: 'password123',
      role: 'admin',
    });

    const admin3 = await User.create({
      name: 'Admin Sharma',
      email: 'admin3@rakthadan.com',
      phone: '+91 9999900003',
      password: 'password123',
      role: 'admin',
      status: 'Inactive',
    });

    // Create Super Admin
    await User.create({
      name: 'Super Admin',
      email: 'superadmin@rakthadan.com',
      phone: '+91 9999999999',
      password: 'password123',
      role: 'superadmin',
    });

    console.log('Users seeded.');

    // 2. Seed Blood Stock
    console.log('Seeding blood stock...');
    const stockData = [
      { group: 'O+', units: 25 },
      { group: 'O-', units: 10 },
      { group: 'A+', units: 18 },
      { group: 'A-', units: 7 },
      { group: 'B+', units: 15 },
      { group: 'B-', units: 6 },
      { group: 'AB+', units: 8 },
      { group: 'AB-', units: 3 },
    ];
    await BloodStock.insertMany(stockData);
    console.log('Blood stock seeded.');

    // 3. Seed Beneficiaries (Linked to Rahul)
    console.log('Seeding beneficiaries...');
    const beneficiaryData = [
      { userId: rahul._id, name: 'Sita Devi', relationship: 'Mother', bloodGroup: 'A+', mobile: '9000000001' },
      { userId: rahul._id, name: 'Ravi Kumar', relationship: 'Father', bloodGroup: 'B+', mobile: '9000000002' },
      { userId: rahul._id, name: 'Priya Sharma', relationship: 'Friend', bloodGroup: 'O-', mobile: '9000000003' },
    ];
    await Beneficiary.insertMany(beneficiaryData);
    console.log('Beneficiaries seeded.');

    // 4. Seed Donation History (Linked to Rahul)
    console.log('Seeding donation history...');
    const donationHistoryData = [
      { userId: rahul._id, bloodBank: 'Red Cross Blood Bank', date: '12 Jan 2026', status: 'Verified' },
      { userId: rahul._id, bloodBank: 'Apollo Blood Bank', date: '20 Sep 2025', status: 'Verified' },
      { userId: rahul._id, bloodBank: 'City Blood Bank', date: '02 May 2025', status: 'Verified' },
      { userId: ramesh._id, bloodBank: 'Red Cross Blood Bank', date: '10 Aug 2024', status: 'Pending' },
      { userId: anil._id, bloodBank: 'Apollo Blood Bank', date: '09 Aug 2024', status: 'Pending' },
      { userId: suresh._id, bloodBank: 'City Blood Bank', date: '08 Aug 2024', status: 'Verified' },
    ];
    const createdDonations = await DonationHistory.insertMany(donationHistoryData);
    console.log('Donation history seeded.');

    // 5. Seed Certificates (Linked to Rahul)
    console.log('Seeding certificates...');
    const certificateData = [
      { userId: rahul._id, donationId: createdDonations[0]._id, title: 'Donation Certificate #1', date: '12 Jan 2026', bank: 'Red Cross Blood Bank' },
      { userId: rahul._id, donationId: createdDonations[1]._id, title: 'Donation Certificate #2', date: '20 Sep 2025', bank: 'Apollo Blood Bank' },
    ];
    await Certificate.insertMany(certificateData);
    console.log('Certificates seeded.');

    // 6. Seed Rewards (Linked to Rahul and others)
    console.log('Seeding rewards...');
    await Reward.create({
      userId: rahul._id,
      badges: [
        { badgeId: 'r1', title: 'First Donation', earned: true },
        { badgeId: 'r2', title: '5 Donations', earned: true },
        { badgeId: 'r3', title: '10 Donations', earned: false },
        { badgeId: 'r4', title: '25 Donations', earned: false },
        { badgeId: 'r5', title: '50 Donations', earned: false },
        { badgeId: 'r6', title: 'Life Saver', earned: true },
        { badgeId: 'r7', title: 'Hero Donor', earned: false },
        { badgeId: 'r8', title: 'Platinum Donor', earned: false },
      ],
      timeline: [
        { title: 'Earned "First Donation"', date: '02 May 2025' },
        { title: 'Earned "Life Saver"', date: '20 Sep 2025' },
        { title: 'Earned "5 Donations"', date: '12 Jan 2026' },
      ],
    });

    // Create empty rewards for others
    const allUsers = [ramesh, anil, suresh, john, neha];
    for (const u of allUsers) {
      await Reward.create({
        userId: u._id,
        badges: [
          { badgeId: 'r1', title: 'First Donation', earned: u.name === 'Suresh Reddy' },
          { badgeId: 'r2', title: '5 Donations', earned: false },
          { badgeId: 'r3', title: '10 Donations', earned: false },
          { badgeId: 'r4', title: '25 Donations', earned: false },
          { badgeId: 'r5', title: '50 Donations', earned: false },
          { badgeId: 'r6', title: 'Life Saver', earned: false },
          { badgeId: 'r7', title: 'Hero Donor', earned: false },
          { badgeId: 'r8', title: 'Platinum Donor', earned: false },
        ],
        timeline: u.name === 'Suresh Reddy' ? [{ title: 'Earned "First Donation"', date: '08 Aug 2024' }] : [],
      });
    }
    console.log('Rewards seeded.');

    // 7. Seed Notifications (Linked to Rahul)
    console.log('Seeding notifications...');
    const notificationData = [
      { userId: rahul._id, type: 'Donation Reminder', message: 'You are eligible to donate again. Book a slot near you.', time: '2h ago', read: false },
      { userId: rahul._id, type: 'Request Accepted', message: 'Your blood request REQ1002 has been approved.', time: '5h ago', read: false },
      { userId: rahul._id, type: 'Certificate Available', message: 'Your donation certificate is ready to download.', time: '1d ago', read: true },
      { userId: rahul._id, type: 'Blood Request Nearby', message: 'Urgent O+ requirement 3km from you.', time: '2d ago', read: true },
      { userId: rahul._id, type: 'Eligibility Reminder', message: 'Complete your eligibility checklist before booking.', time: '3d ago', read: true },
    ];
    await Notification.insertMany(notificationData);
    console.log('Notifications seeded.');

    // 8. Seed Blood Requests (Linked to Rahul)
    console.log('Seeding blood requests...');
    const requestData = [
      { requester: rahul._id, patientName: 'Kiran Rao', bloodGroup: 'O+', units: 2, hospital: 'Apollo Hospital', city: 'Hyderabad', contact: '9876500101', description: 'Post-surgery transfusion needed urgently.', status: 'Pending', date: '12 Aug 2024' },
      { requester: rahul._id, patientName: 'Meena Iyer', bloodGroup: 'B+', units: 1, hospital: 'Yashoda Hospital', city: 'Hyderabad', contact: '9876500102', description: 'Scheduled surgery requirement.', status: 'Approved', date: '10 Aug 2024' },
      { requester: rahul._id, patientName: 'Arjun Nair', bloodGroup: 'A+', units: 2, hospital: 'Care Hospital', city: 'Hyderabad', contact: '9876500103', description: 'Accident emergency.', status: 'Fulfilled', date: '08 Aug 2024' },
      { requester: rahul._id, patientName: 'Divya Menon', bloodGroup: 'AB+', units: 1, hospital: 'Rainbow Hospital', city: 'Hyderabad', contact: '9876500104', description: 'Chemotherapy support.', status: 'Rejected', date: '05 Aug 2024' },
    ];
    await BloodRequest.insertMany(requestData);
    console.log('Blood requests seeded.');

    // 9. Seed Activity Logs
    console.log('Seeding Activity Logs...');
    const logsData = [
      { time: '12 Aug 2024 10:30 AM', actor: 'Admin Kumar', action: 'Login' },
      { time: '12 Aug 2024 10:15 AM', actor: 'Admin Reddy', action: 'Created' },
      { time: '12 Aug 2024 09:45 AM', actor: 'Blood Stock Updated', action: 'Stock' },
      { time: '12 Aug 2024 09:20 AM', actor: 'Donation Verified', action: 'Donation' },
      { time: '12 Aug 2024 08:50 AM', actor: 'Donation Approved', action: 'Request' },
    ];
    await ActivityLog.insertMany(logsData);
    console.log('Activity Logs seeded.');

    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
