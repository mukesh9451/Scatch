// server.js
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import Product from './src/models/Product.js';
import DeliveryOption from './src/models/DeliveryOption.js';
import CartItem from './src/models/CartItem.js';
import Order from './src/models/Order.js';
import { defaultProducts } from './src/defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from './src/defaultData/defaultDeliveryOptions.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    // ✅ Clear only once (keep for first run, then remove)
    await Product.deleteMany({});
    await DeliveryOption.deleteMany({});
    await CartItem.deleteMany({});
    await Order.deleteMany({});
    console.log('Collections cleared.');

    // ✅ Seed ONLY valid data
    await Product.insertMany(defaultProducts);
    await DeliveryOption.insertMany(defaultDeliveryOptions);

    console.log('Products and delivery options seeded.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();