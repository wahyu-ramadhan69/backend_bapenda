import express from "express";
import {} from "../controller/BPHTB.js";
import {
  createSpptpbb,
  deleteSpptpbb,
  getSpptpbb,
  getSpptpbbById,
  getSpptpbbMenunggu,
  getSpptpbbSelesai,
  jumlahSpptpbbAntrian,
  updateSpptpbb,
} from "../controller/SPPTPBB.js";

const router = express.Router();

router.get("/spptpbb", getSpptpbb);
router.get("/spptpbb_menunggu", getSpptpbbMenunggu);
router.get("/spptpbb_selesai", getSpptpbbSelesai);
router.get("/spptpbb/jumlahantrian", jumlahSpptpbbAntrian);
router.get("/spptpbb/:id", getSpptpbbById);
router.post("/spptpbb", createSpptpbb);
router.patch("/spptpbb/:id", updateSpptpbb);
router.delete("/spptpbb/:id", deleteSpptpbb);

export default router;
