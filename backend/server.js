import express from 'express'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import dotenv from 'dotenv'
import connectDb from './db/connectDb.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);


app.listen(port, () => {
    console.log('Server is running on port ', port);
    connectDb();
} )