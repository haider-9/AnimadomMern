import express from 'express';
import { addUser, deleteUser, getUser, updateUser } from '../controller/user.controller.js';
const router = express.Router();
router.post('/', addUser);
router.delete("/:id", deleteUser);
router.get("/", getUser);
router.put("/:id", updateUser);

export default router;