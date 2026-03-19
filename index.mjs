import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

import connectDB from './config/db.mjs';
import clerkRoutes from './routes/clerk.mjs';
import jobRoutes from './routes/jobs.mjs';
import staffRouter from './routes/staff.mjs';

dotenv.config();

const app = express();
const __dirname = path.resolve();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api/clerk', clerkRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/staff', staffRouter);

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Export for Vercel
export const handler = serverless(app);
export default app;

// For Render deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
