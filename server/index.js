import express from 'express';
import dotenv from 'dotenv';
import { dbconn } from './config/db.js';
import userRoutes from './routes/user.route.js';
import cors from 'cors';
import { ExpressAuth } from "@auth/express";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(express.json());
app.use("/auth/*",ExpressAuth({
    providers: []
}))
const port = process.env.PORT || 3000
app.use("/api", userRoutes)

app.listen(port, async () => {
    await dbconn()
    console.log(`Server is running on http://localhost:${port}`);
});
