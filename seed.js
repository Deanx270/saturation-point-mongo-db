require('dotenv').config();
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const Brand = require('./models/Brand');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const MONGODB_URI = process.env.MONGODB_URI;
const OLD_PUBLIC_DIR = path.join(__dirname, 'old-system', 'public');

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    console.log('Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'the_saturation_point'
    });
    console.log('Connected to MySQL.');

    // 1. Seed Brands
    console.log('Fetching brands from MySQL...');
    const [mysqlBrands] = await connection.execute('SELECT * FROM brands');
    const brandIdMap = {};
    for (const b of mysqlBrands) {
      // Check if brand exists
      let newBrand = await Brand.findOne({ name: b.name });
      if (!newBrand) {
        newBrand = await Brand.create({
          name: b.name,
          description: b.description || '',
          origin: b.origin || '',
          status: b.status || 'active'
        });
        console.log(`Created Brand: ${newBrand.name}`);
      }
      brandIdMap[b.id] = newBrand._id;
    }

    // 2. Seed Categories
    console.log('Fetching categories from MySQL...');
    const [mysqlCategories] = await connection.execute('SELECT * FROM categories');
    const categoryIdMap = {};
    for (const c of mysqlCategories) {
      let newCategory = await Category.findOne({ name: c.name });
      if (!newCategory) {
        newCategory = await Category.create({
          name: c.name,
          description: c.description || ''
        });
        console.log(`Created Category: ${newCategory.name}`);
      }
      categoryIdMap[c.id] = newCategory._id; // In old system, ID is a string like 'ink', 'pen'
    }

    // 3. Seed Products
    console.log('Fetching products from MySQL...');
    const [mysqlProducts] = await connection.execute('SELECT * FROM products');
    for (const p of mysqlProducts) {
      let newProduct = await Product.findOne({ name: p.name });
      if (!newProduct) {
        // Upload images to Cloudinary
        const imagesArr = [];
        if (p.images) {
          try {
            const oldImages = JSON.parse(p.images);
            for (const imgPath of oldImages) {
              if (imgPath.includes('default-avatar.png')) continue; // Skip default images
              
              const localPath = path.join(OLD_PUBLIC_DIR, imgPath);
              if (fs.existsSync(localPath)) {
                console.log(`Uploading ${localPath} to Cloudinary...`);
                const uploadResult = await cloudinary.uploader.upload(localPath, { folder: 'products' });
                imagesArr.push(uploadResult.secure_url);
              }
            }
          } catch (e) {
            console.error(`Failed to parse images for product ${p.name}`);
          }
        }
        
        newProduct = await Product.create({
          name: p.name,
          description: p.description || '',
          price: p.price,
          stock: p.stock || 0,
          category: categoryIdMap[p.categoryId],
          brand: brandIdMap[p.brandId],
          images: imagesArr
        });
        console.log(`Created Product: ${newProduct.name}`);
      }
    }

    // 4. Seed Random Transactions for Charting
    console.log('Seeding random transactions for Monthly Sales Chart...');
    const user = await User.findOne({ role: 'admin' }); // Find an admin user to assign orders to
    const randomProduct = await Product.findOne();
    
    if (user && randomProduct) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      
      // Create one transaction per month up to the current month to have a nice looking chart
      for (let month = 0; month <= currentMonth; month++) {
        // Random amount between 2000 and 15000
        const amount = Math.floor(Math.random() * (15000 - 2000 + 1) + 2000);
        
        // Random day in the month
        const day = Math.floor(Math.random() * 25) + 1;
        const date = new Date(currentYear, month, day, 12, 0, 0);
        
        const newOrder = await Order.create({
          user: user._id,
          totalAmount: amount,
          status: 'delivered',
          paymentMethod: 'Credit Card',
          createdAt: date,
          updatedAt: date,
          orderItems: [{
            product: randomProduct._id,
            name: randomProduct.name,
            price: amount,
            quantity: 1,
            image: randomProduct.images[0] || ''
          }]
        });
        console.log(`Created dummy Order for ${date.toLocaleDateString()} for PHP ${amount}`);
      }
    } else {
      console.log('Skipping dummy orders as no user or product found.');
    }

    console.log('Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

seed();
