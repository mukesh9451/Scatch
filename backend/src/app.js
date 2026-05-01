import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cookieParser from 'cookie-parser';

import productRoutes from './routes/products.js';
import deliveryOptionRoutes from './routes/deliveryOptions.js';
import cartItemRoutes from './routes/cartItems.js';
import orderRoutes from './routes/orders.js';
import resetRoutes from './routes/reset.js';
import paymentSummaryRoutes from './routes/paymentSummary.js';
import authRouter from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🔥 REQUIRED for cookies (Render / HTTPS)
app.set("trust proxy", 1);

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "https://scatch-frontend-gzvy.onrender.com",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ================= STATIC =================
app.use('/images', express.static(path.join(__dirname, '../images')));

// ================= ROUTES =================
app.use('/api/products', productRoutes);
app.use('/api/delivery-options', deliveryOptionRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/payment-summary', paymentSummaryRoutes);
app.use('/api/auth', authRouter);

// ================= FRONTEND =================
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/{*splat}', (req, res) => {
  const indexPath = path.join(__dirname, '../dist', 'index.html');

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
