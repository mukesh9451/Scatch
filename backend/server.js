// server.js
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import Product from './src/models/Product.js';
import DeliveryOption from './src/models/DeliveryOption.js';
import { defaultProducts } from './src/defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from './src/defaultData/defaultDeliveryOptions.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    /* ================= SAFE SEEDING ================= */

    const productCount = await Product.countDocuments();
    const deliveryCount = await DeliveryOption.countDocuments();

    if (productCount === 0) {
      await Product.insertMany(defaultProducts);
      console.log('Products seeded.');
    }

    if (deliveryCount === 0) {
      await DeliveryOption.insertMany(defaultDeliveryOptions);
      console.log('Delivery options seeded.');
    }

    console.log('Server ready without wiping data.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
