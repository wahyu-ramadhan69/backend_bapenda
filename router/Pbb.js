import express from "express";
import {
  createPBB,
  deletePBB,
  getPBB,
  getPBBById,
  getPBBMenunggu,
  getPBBSelesai,
  jumlahPBBAntrian,
  updatePBB,
} from "../controller/PBB.js";

const router = express.Router();

router.get("/pbb", getPBB);
router.post("/pbb_menunggu", getPBBMenunggu);
router.get("/pbb_selesai", getPBBSelesai);
router.get("/pbb/jumlahantrian", jumlahPBBAntrian);
router.get("/pbb/:id", getPBBById);
router.post("/pbb", createPBB);
router.patch("/pbb/:id", updatePBB);
router.delete("/pbb/:id", deletePBB);

export default router;
