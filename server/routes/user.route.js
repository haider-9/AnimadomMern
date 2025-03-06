import express from 'express';
import { addUser, deleteUser, getUser, updateUser ,getallusers} from '../controller/user.controller.js';
const router = express.Router();

router.post('/', addUser);
router.delete("/:id", deleteUser);
router.post("/login", getUser);
router.put("/:id", updateUser);
router.get("/", getallusers);

export default router;