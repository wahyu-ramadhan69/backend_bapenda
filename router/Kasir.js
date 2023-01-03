import express from "express";
import {
  getKasir,
  getKasirMenunggu,
  getKasirSelesai,
  getKasirById,
  createkasir,
  updateKasir,
  deleteKasir,
  jumlahAntrian,
} from "../controller/Kasir.js";

const router = express.Router();

router.get("/kasir", getKasir);
router.post("/kasir_menunggu", getKasirMenunggu);
router.get("/kasir_selesai", getKasirSelesai);
router.get("/kasir/jumlahantrian", jumlahAntrian);
router.get("/kasir/:id", getKasirById);
router.post("/kasir", createkasir);
router.patch("/kasir/:id", updateKasir);
router.delete("/kasir/:id", deleteKasir);

export default router;
