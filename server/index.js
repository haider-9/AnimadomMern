import express from 'express';
import dotenv from 'dotenv';
import { dbconn } from './config/db.js';
import userRoutes from './routes/signup.route.js';

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
app.use("/signup", userRoutes)

app.listen(port, async () => {
    await dbconn();
    console.log(`Server is running on port ${port}`);
});
