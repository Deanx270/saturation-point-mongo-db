require('dotenv').config();
const mongoose = require('mongoose');
const Brand = require('./models/Brand');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

const additionalBrands = [
  {
    name: 'Platinum',
    description: 'Renowned Japanese manufacture celebrated for precision 14k gold nibs and airtight Slip & Seal mechanisms.',
  },
  {
    name: 'Ferris Wheel Press',
    description: 'Canadian design atelier producing richly saturated fountain pen inks packaged in vintage spherical glass flacons.',
  },
  {
    name: 'Clairefontaine',
    description: 'French heritage mill established in 1858, renowned for producing satin-finish 90gsm fountain pen friendly vellum paper.',
  },
];

const additionalUsers = [
  {
    firebaseUid: 'seed_usr_marcus_vance_01',
    email: 'marcus.vance@luxuryscribe.com',
    username: 'marcus_vance',
    displayName: 'Marcus Vance',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'user',
    status: 'active',
  },
  {
    firebaseUid: 'seed_usr_elena_rostova_02',
    email: 'elena.rostova@atelierscribe.com',
    username: 'elena_rostova',
    displayName: 'Elena Rostova',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'user',
    status: 'active',
  },
  {
    firebaseUid: 'seed_usr_julian_sterling_03',
    email: 'julian.sterling@monogramcraft.com',
    username: 'julian_sterling',
    displayName: 'Julian Sterling',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'user',
    status: 'active',
  },
];

const additionalProducts = [
  {
    name: 'Platinum Century 3776 Bourgogne',
    brand: 'Platinum',
    category: 'Fountain Pens',
    price: 10500,
    stock: 14,
    description: 'Legendary Japanese luxury fountain pen in translucent wine-red resin with 14k solid gold nib and patented Slip & Seal cap mechanism.',
    images: [
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516791/saturation_point_new/prmetnoko79ma68107xb.jpg',
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516790/saturation_point_new/zukjdjcid9kjytrxhc0g.jpg',
    ],
    rating: 4.9,
    numReviews: 8,
  },
  {
    name: 'Visconti Rembrandt-S Dark Forest',
    brand: 'Visconti',
    category: 'Fountain Pens',
    price: 12800,
    stock: 9,
    description: 'Florentine mastercrafted writing instrument featuring variegated acrylic resin, magnetic closure, and engraved ruthenium-plated accents.',
    images: [
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516942/saturation_point_new/xxqxf4izglguybrjt5y9.jpg',
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516942/saturation_point_new/nfcl44r28zkgfkcmvwju.jpg',
    ],
    rating: 4.8,
    numReviews: 5,
  },
  {
    name: 'Pelikan Classic M200 Golden Beryl',
    brand: 'Pelikan',
    category: 'Fountain Pens',
    price: 9800,
    stock: 11,
    description: 'Special edition German piston-fill fountain pen with a translucent shimmering golden beryl barrel and gold-plated steel nib.',
    images: [
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516791/saturation_point_new/prmetnoko79ma68107xb.jpg',
    ],
    rating: 4.7,
    numReviews: 4,
  },
  {
    name: 'Lamy Studio Brushed Stainless Steel',
    brand: 'Lamy',
    category: 'Fountain Pens',
    price: 4950,
    stock: 18,
    description: 'Heidelberg design icon featuring a sleek brushed stainless steel chassis, 14k gold-accented steel nib, and propeller clip.',
    images: [
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516942/saturation_point_new/xxqxf4izglguybrjt5y9.jpg',
    ],
    rating: 4.6,
    numReviews: 6,
  },
  {
    name: 'Ferris Wheel Press Buttered Popcorn 38ml',
    brand: 'Ferris Wheel Press',
    category: 'Inks',
    price: 1450,
    stock: 32,
    description: 'Luminous warm golden-yellow fountain pen ink presented in a distinct spherical glass flacon with a solid brass cap.',
    images: [
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516831/saturation_point_new/htnl0zbsn0rs9g7vnoph.webp',
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516831/saturation_point_new/zg7us3iwswiiiyobaegq.webp',
    ],
    rating: 4.8,
    numReviews: 9,
  },
  {
    name: 'Ferris Wheel Press Roaring Patina Black 38ml',
    brand: 'Ferris Wheel Press',
    category: 'Inks',
    price: 1650,
    stock: 24,
    description: 'Velvety deep black artisan ink infused with lustrous holographic gold shimmer, formulated for broad and calligraphy nibs.',
    images: [
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516831/saturation_point_new/zg7us3iwswiiiyobaegq.webp',
    ],
    rating: 4.9,
    numReviews: 12,
  },
  {
    name: 'Montblanc Mystery Black Ink Bottle 60ml',
    brand: 'Montblanc',
    category: 'Inks',
    price: 2600,
    stock: 16,
    description: 'Iconic shoe-shaped German flacon housing intensely dark, rich black permanent ink with exceptional surface tension.',
    images: [
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516831/saturation_point_new/htnl0zbsn0rs9g7vnoph.webp',
    ],
    rating: 5.0,
    numReviews: 15,
  },
  {
    name: 'Pelikan Edelstein Moonstone 50ml',
    brand: 'Pelikan',
    category: 'Inks',
    price: 2100,
    stock: 20,
    description: 'Gemstone-inspired silvery grey fountain pen ink engineered with a special lubricant ingredient for velvety smooth flow.',
    images: [
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516831/saturation_point_new/zg7us3iwswiiiyobaegq.webp',
    ],
    rating: 4.7,
    numReviews: 7,
  },
  {
    name: 'Clairefontaine Triomphe A5 Writing Pad Blank',
    brand: 'Clairefontaine',
    category: 'Paper',
    price: 680,
    stock: 45,
    description: 'Ultra-white 90gsm satin-finish vellum correspondence pad providing zero feathering and crystal-clear ink sheen transmission.',
    images: [
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516942/saturation_point_new/nfcl44r28zkgfkcmvwju.jpg',
    ],
    rating: 4.9,
    numReviews: 11,
  },
  {
    name: 'Rhodia Heritage Bookcloth Notebook A5',
    brand: 'Rhodia',
    category: 'Paper',
    price: 1250,
    stock: 26,
    description: 'Hardbound bookcloth notebook from Mulhouse, France featuring 90gsm ivory vellum paper and subtle silver metallic edge gilding.',
    images: [
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516942/saturation_point_new/xxqxf4izglguybrjt5y9.jpg',
    ],
    rating: 4.8,
    numReviews: 8,
  },
  {
    name: 'Midori MD Paper Journal Frame A5',
    brand: 'Midori',
    category: 'Paper',
    price: 1100,
    stock: 28,
    description: 'Purist Japanese notebook bound with exposed mesh spine, featuring MD paper crafted specifically for fine nib fountain pens.',
    images: [
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516942/saturation_point_new/nfcl44r28zkgfkcmvwju.jpg',
    ],
    rating: 4.9,
    numReviews: 14,
  },
  {
    name: 'Tomoe River Sanzen 68gsm Loose Leaf 100 Sheets',
    brand: 'Tomoe',
    category: 'Paper',
    price: 850,
    stock: 48,
    description: 'The premier Japanese fountain pen paper, celebrated globally for its ultra-lightweight profile and peerless sheen presentation.',
    images: [
      'https://res.cloudinary.com/dgqsfys8/image/upload/v1793516790/saturation_point_new/zukjdjcid9kjytrxhc0g.jpg',
    ],
    rating: 5.0,
    numReviews: 20,
  },
];

const runSeeder = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected successfully.');

    const existingCategories = await Category.find();
    const categoryNames = existingCategories.map((c) => c.name);
    console.log(`Found existing categories: ${categoryNames.join(', ')}`);

    let brandsCreated = 0;
    for (const b of additionalBrands) {
      const exists = await Brand.findOne({ name: b.name });
      if (!exists) {
        await Brand.create(b);
        brandsCreated++;
        console.log(`+ Brand created: ${b.name}`);
      } else {
        console.log(`= Brand already exists: ${b.name}`);
      }
    }

    let usersCreated = 0;
    const seededUsers = [];
    for (const u of additionalUsers) {
      let existingUser = await User.findOne({ email: u.email });
      if (!existingUser) {
        existingUser = await User.create(u);
        usersCreated++;
        console.log(`+ User created: ${u.displayName} (${u.email})`);
      } else {
        console.log(`= User already exists: ${u.email}`);
      }
      seededUsers.push(existingUser);
    }

    let productsCreated = 0;
    const seededProducts = [];
    for (const p of additionalProducts) {
      let existingProduct = await Product.findOne({ name: p.name });
      if (!existingProduct) {
        existingProduct = await Product.create(p);
        productsCreated++;
        console.log(`+ Product created: ${p.name}`);
      } else {
        console.log(`= Product already exists: ${p.name}`);
      }
      seededProducts.push(existingProduct);
    }

    let ordersCreated = 0;
    const now = new Date();
    const currentYear = now.getFullYear();

    const sampleOrders = [
      {
        monthOffset: 0,
        day: 2,
        status: 'delivered',
        productIdx: 0,
        qty: 1,
        user: seededUsers[0]._id,
      },
      {
        monthOffset: 1,
        day: 14,
        status: 'delivered',
        productIdx: 4,
        qty: 2,
        user: seededUsers[1]._id,
      },
      {
        monthOffset: 1,
        day: 26,
        status: 'shipped',
        productIdx: 8,
        qty: 3,
        user: seededUsers[2]._id,
      },
      {
        monthOffset: 2,
        day: 10,
        status: 'delivered',
        productIdx: 1,
        qty: 1,
        user: seededUsers[0]._id,
      },
      {
        monthOffset: 2,
        day: 22,
        status: 'delivered',
        productIdx: 5,
        qty: 2,
        user: seededUsers[1]._id,
      },
      {
        monthOffset: 0,
        day: Math.max(1, now.getDate() - 1),
        status: 'pending',
        productIdx: 11,
        qty: 4,
        user: seededUsers[2]._id,
      },
    ];

    for (const ord of sampleOrders) {
      const prod = seededProducts[ord.productIdx];
      const itemSubtotal = prod.price * ord.qty;
      const orderDate = new Date(currentYear, now.getMonth() - ord.monthOffset, ord.day, 14, 30, 0);

      const existingOrder = await Order.findOne({
        user: ord.user,
        'orderItems.name': prod.name,
        createdAt: orderDate,
      });

      if (!existingOrder) {
        await Order.create({
          user: ord.user,
          orderItems: [
            {
              product: prod._id,
              name: prod.name,
              price: prod.price,
              quantity: ord.qty,
              image: prod.images[0] || '',
            },
          ],
          totalAmount: itemSubtotal,
          paymentMethod: 'Credit Card',
          status: ord.status,
          createdAt: orderDate,
          updatedAt: orderDate,
        });
        ordersCreated++;
        console.log(`+ Transaction created: ${prod.name} (PHP ${itemSubtotal}) [${ord.status}]`);
      }
    }

    console.log('\n=============================================');
    console.log('Database Seeder Summary:');
    console.log(`- Brands Added: ${brandsCreated}`);
    console.log(`- Users Added: ${usersCreated}`);
    console.log(`- Products Added: ${productsCreated}`);
    console.log(`- Transactions Added: ${ordersCreated}`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeder execution error:', error);
    process.exit(1);
  }
};

runSeeder();

