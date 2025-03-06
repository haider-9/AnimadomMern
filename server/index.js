import express from 'express';
import dotenv from 'dotenv';
import { dbconn } from './config/db.js';
import userRoutes from './routes/signup.route.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(express.json());
const port = process.env.PORT || 3000;
app.use("/api", userRoutes)

app.listen(port, async () => {
    await dbconn()
    console.log(`Server is running on port ${port}`);
});
