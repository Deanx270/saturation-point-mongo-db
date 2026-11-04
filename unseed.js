require('dotenv').config();
const mongoose = require('mongoose');
const Brand = require('./models/Brand');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

const seededProductNames = [
  'Platinum Century 3776 Bourgogne',
  'Visconti Rembrandt-S Dark Forest',
  'Pelikan Classic M200 Golden Beryl',
  'Lamy Studio Brushed Stainless Steel',
  'Ferris Wheel Press Buttered Popcorn 38ml',
  'Ferris Wheel Press Roaring Patina Black 38ml',
  'Montblanc Mystery Black Ink Bottle 60ml',
  'Pelikan Edelstein Moonstone 50ml',
  'Clairefontaine Triomphe A5 Writing Pad Blank',
  'Rhodia Heritage Bookcloth Notebook A5',
  'Midori MD Paper Journal Frame A5',
  'Tomoe River Sanzen 68gsm Loose Leaf 100 Sheets',
];

const seededBrandNames = [
  'Platinum',
  'Ferris Wheel Press',
  'Clairefontaine',
];

const seededUserEmails = [
  'marcus.vance@luxuryscribe.com',
  'elena.rostova@atelierscribe.com',
  'julian.sterling@monogramcraft.com',
];

const runUnseeder = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected successfully.\n');

    let productsDeleted = 0;
    let productsAlreadyDeleted = 0;
    for (const name of seededProductNames) {
      const existing = await Product.findOne({ name });
      if (existing) {
        await Product.deleteOne({ _id: existing._id });
        productsDeleted++;
        console.log(`- Deleted product: ${name}`);
      } else {
        productsAlreadyDeleted++;
        console.log(`o Already deleted / Not found: ${name}`);
      }
    }

    let usersDeleted = 0;
    let usersAlreadyDeleted = 0;
    for (const email of seededUserEmails) {
      const existing = await User.findOne({ email });
      if (existing) {
        await User.deleteOne({ _id: existing._id });
        usersDeleted++;
        console.log(`- Deleted user: ${existing.displayName || email}`);
      } else {
        usersAlreadyDeleted++;
        console.log(`o Already deleted / Not found: ${email}`);
      }
    }

    let brandsDeleted = 0;
    let brandsAlreadyDeleted = 0;
    for (const name of seededBrandNames) {
      const existing = await Brand.findOne({ name });
      if (existing) {
        await Brand.deleteOne({ _id: existing._id });
        brandsDeleted++;
        console.log(`- Deleted brand: ${name}`);
      } else {
        brandsAlreadyDeleted++;
        console.log(`o Already deleted / Not found: ${name}`);
      }
    }

    const orderRes = await Order.deleteMany({
      'orderItems.name': { $in: seededProductNames },
    });

    console.log('\n=============================================');
    console.log('Seeder Cleanup Summary:');
    console.log(`- Products Deleted: ${productsDeleted} (${productsAlreadyDeleted} already removed)`);
    console.log(`- Users Deleted: ${usersDeleted} (${usersAlreadyDeleted} already removed)`);
    console.log(`- Brands Deleted: ${brandsDeleted} (${brandsAlreadyDeleted} already removed)`);
    console.log(`- Transactions Deleted: ${orderRes.deletedCount}`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Unseeder execution error:', error);
    process.exit(1);
  }
};

runUnseeder();
