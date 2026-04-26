/**
 * CampusCollab — Admin Seed Script
 * Run once: node backend/scripts/seedAdmin.js
 *
 * Creates an admin user in MongoDB. Edit ADMIN_EMAIL and ADMIN_PASSWORD below.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const ADMIN_EMAIL    = 'admin@campuscollab.edu.pk';
const ADMIN_PASSWORD = 'Admin@12345';
const ADMIN_NAME     = 'Platform Admin';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('⚠️  Admin already exists:', ADMIN_EMAIL);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      department: 'Administration',
      skills: [],
      isVerified: true,
    });

    console.log('🎉 Admin account created!');
    console.log('   Email   :', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('   ⚠️  Change the password after first login!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
