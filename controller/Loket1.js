import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getLoket = async (req, res) => {
  try {
    const data = await prisma.loket_1.findMany();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
export const getLoketById = async (req, res) => {
  try {
    const data = await prisma.loket_1.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
export const createLoket = async (req, res) => {
  const { nomer_antrian, status } = req.body;
  try {
    const data = await prisma.loket_1.create({
      data: {
        nomer_antrian: nomer_antrian,
        status: status,
      },
    });
    res.status(201).json({ msg: "data berhasil di tambahkan" });
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};
export const updateLoket = async (req, res) => {
  const { nomer_antrian, status } = req.body;

  try {
    const data = await prisma.loket_1.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        nomer_antrian: nomer_antrian,
        status: status,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
export const deleteLoket = async (req, res) => {
  try {
    const data = await prisma.loket_1.delete({
      where: {
        id: Number(req.params.body),
      },
    });
    res.status(200).json({ msg: "data berhasil di hapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
