import express from 'express'
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv'
import connectDb from './db/connectDb.js';

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log('Server is running on port ', port);
    connectDb();
} )