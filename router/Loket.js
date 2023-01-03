import express from "express";

import {
  getLoket,
  getLoketById,
  createLoket,
  updateLoket,
  deleteLoket,
} from "../controller/Loket1.js";

const router = express.Router();

router.get("/loket", getLoket);
router.get("/loket/:id", getLoketById);
router.post("/loket", createLoket);
router.patch("/loket/update/:id", updateLoket);
router.delete("/loket/delete/:id", deleteLoket);

export default router;
