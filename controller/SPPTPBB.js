import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSpptpbb = async (req, res) => {
  try {
    const data = await prisma.spptpbb.findMany({
      select: { id: true, nomer_antrian: true, status: true },
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const getSpptpbbMenunggu = async (req, res) => {
  try {
    const data = await prisma.spptpbb.findMany({
      select: { id: true, nomer_antrian: true, status: true },
      where: {
        status: 1,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const getSpptpbbSelesai = async (req, res) => {
  try {
    const data = await prisma.spptpbb.findMany({
      select: { id: true, nomer_antrian: true, status: true },
      where: {
        status: 2,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const jumlahSpptpbbAntrian = async (req, res) => {
  try {
    let lastDay = Date.now() - 24 * 60 * 60 * 1000;
    lastDay = new Date(lastDay).toISOString();
    const totalAntri = await prisma.spptpbb.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    const totalSelesaiAntri = await prisma.spptpbb.count({
      where: {
        status: 2,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    const totalMenunggu = await prisma.spptpbb.count({
      where: {
        status: 1,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    res.status(200).json({
      totalAntri: totalAntri,
      totalSelesaiAntri: totalSelesaiAntri,
      totalMenunggu: totalMenunggu,
    });
  } catch (error) {}
};

export const getSpptpbbById = async (req, res) => {
  try {
    const data = await prisma.spptpbb.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createSpptpbb = async (req, res) => {
  const { nomer_antrian, status } = req.body;
  let lastDay = Date.now() - 24 * 60 * 60 * 1000;
  lastDay = new Date(lastDay).toISOString();
  try {
    const response = await prisma.spptpbb.findMany();
    if (response.length < 1) {
      await prisma.spptpbb.create({
        data: {
          nomer_antrian: 1,
          status: 1,
        },
      });
      res.status(201).json({ nomer: 1, msg: "data berhasil di tambahkan" });
    } else {
      const cek = await prisma.spptpbb.findMany({
        take: 1,
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
        orderBy: {
          id: "desc",
        },
      });
      if (cek.length < 1) {
        await prisma.spptpbb.create({
          data: {
            nomer_antrian: 1,
            status: 1,
          },
        });
        res.status(201).json({ nomer: 1, msg: "data berhasil di tambahkan" });
      } else {
        let nomer = cek[0].nomer_antrian + 1;
        await prisma.spptpbb.create({
          data: {
            nomer_antrian: nomer,
            status: 1,
          },
        });
        res
          .status(201)
          .json({ nomer: nomer, msg: "data berhasil di tambahkan" });
      }
    }
    res.status(201).json({ msg: "data berhasil di tambahkan" });
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};

export const updateSpptpbb = async (req, res) => {
  const { status, nomer } = req.body;

  try {
    const data = await prisma.spptpbb.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: status,
      },
    });
    if (status === 1) {
      res
        .status(200)
        .json({ msg: `antrian nomer ${nomer} telah dikembalikan` });
    } else if (status === 2) {
      res.status(200).json({ msg: `antrian nomer ${nomer} telah selesai` });
    } else if (status === 3) {
      res.status(200).json({ msg: `antrian nomer ${nomer} telah ditolak` });
    } else {
      res.status(404).json({ msg: "status tidak diketahui" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteSpptpbb = async (req, res) => {
  try {
    await prisma.spptpbb.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json({ msg: "data berhasil di hapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
