require('dotenv').config();
const mongoose = require('mongoose');
const Brand = require('./models/Brand');
const Category = require('./models/Category');
const Product = require('./models/Product');

async function fix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const products = await Product.find();
    
    const brands = await Brand.find();
    const brandMap = {};
    for (const b of brands) {
      brandMap[b._id.toString()] = b.name;
    }

    const categories = await Category.find();
    const catMap = {};
    for (const c of categories) {
      catMap[c._id.toString()] = c.name;
    }

    for (const p of products) {
      let changed = false;
      
      // If the brand field is a 24-char ObjectId string, map it
      if (p.brand && p.brand.length === 24 && brandMap[p.brand]) {
        p.brand = brandMap[p.brand];
        changed = true;
      }
      
      // If category field is an ObjectId string, map it
      if (p.category && p.category.length === 24 && catMap[p.category]) {
        p.category = catMap[p.category];
        changed = true;
      }
      
      if (changed) {
        await p.save();
        console.log(`Updated ${p.name}`);
      }
    }
    
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fix();
