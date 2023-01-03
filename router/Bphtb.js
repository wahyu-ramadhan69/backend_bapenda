import express from "express";
import {
  createBphtb,
  deleteBphtb,
  getBphtb,
  getBphtbById,
  getBphtbMenunggu,
  getBphtbSelesai,
  jumlahAntrianBphtb,
  updateBphtb,
} from "../controller/BPHTB.js";

const router = express.Router();

router.get("/bphtb", getBphtb);
router.get("/bphtb_menunggu", getBphtbMenunggu);
router.get("/bphtb_selesai", getBphtbSelesai);
router.get("/bphtb/jumlahantrian", jumlahAntrianBphtb);
router.get("/bphtb/:id", getBphtbById);
router.post("/bphtb", createBphtb);
router.patch("/bphtb/:id", updateBphtb);
router.delete("/bphtb/:id", deleteBphtb);

export default router;
