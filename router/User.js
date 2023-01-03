import express from "express";
import {
  Delete,
  getUsers,
  Login,
  Logout,
  Register,
  ubahPass,
  ubahUser,
} from "../controller/Users.js";
import { refreshToken } from "../controller/refreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/user", verifyToken, getUsers);
router.get("/user/token", refreshToken);
router.post("/user/register", Register);
router.post("/user/login", Login);
router.patch("/user/ubah", ubahPass);
router.patch("/user/ubahpass", ubahUser);
router.delete("/user/logout", Logout);
router.delete("/user/delete/:id", Delete);

export default router;
