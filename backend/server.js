import express from 'express'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import dotenv from 'dotenv'
import connectDb from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);


app.listen(port, () => {
    console.log('Server is running on port ', port);
    connectDb();
} )