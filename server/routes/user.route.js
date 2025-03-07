import express from 'express';
import { addUser, deleteUser, getUser, updateUser ,getallusers, logout} from '../controller/user.controller.js';
const router = express.Router();

router.get("/", getallusers);
router.post('/', addUser);
router.post("/login", getUser);
router.get("/logout", logout)
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;