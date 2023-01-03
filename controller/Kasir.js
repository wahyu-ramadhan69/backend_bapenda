import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getKasir = async (req, res) => {
  try {
    const data = await prisma.kasir.findMany({
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

export const getKasirMenunggu = async (req, res) => {
  const { name } = req.body;
  try {
    const data = await prisma.kasir.findMany({
      select: { id: true, nomer_antrian: true, status: true },
      where: {
        status: 1,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        OR: [{ dilayani: name }, { dilayani: null }],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const getKasirSelesai = async (req, res) => {
  try {
    const data = await prisma.kasir.findMany({
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

export const jumlahAntrian = async (req, res) => {
  try {
    let lastDay = Date.now() - 24 * 60 * 60 * 1000;
    lastDay = new Date(lastDay).toISOString();
    const totalAntri = await prisma.kasir.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    const totalSelesaiAntri = await prisma.kasir.count({
      where: {
        status: 2,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    const totalMenunggu = await prisma.kasir.count({
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

export const getKasirById = async (req, res) => {
  try {
    const data = await prisma.kasir.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createkasir = async (req, res) => {
  let lastDay = Date.now() - 24 * 60 * 60 * 1000;
  lastDay = new Date(lastDay).toISOString();
  try {
    const response = await prisma.kasir.findMany();
    if (response.length < 1) {
      await prisma.kasir.create({
        data: {
          nomer_antrian: 1,
          status: 1,
        },
      });
      res.status(201).json({ nomer: 1, msg: "antrian berhasil ditambahkan" });
    } else {
      const cek = await prisma.kasir.findMany({
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
        await prisma.kasir.create({
          data: {
            nomer_antrian: 1,
            status: 1,
          },
        });
        res.status(201).json({ nomer: 1, msg: "antrian berhasil ditambahkan" });
      } else {
        let nomer = cek[0].nomer_antrian + 1;
        await prisma.kasir.create({
          data: {
            nomer_antrian: nomer,
            status: 1,
          },
        });
        res
          .status(201)
          .json({ nomer: nomer, msg: "antrian berhasil ditambahkan" });
      }
    }
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};

export const updateKasir = async (req, res) => {
  const { status, name, nomer } = req.body;

  try {
    if (!status) {
      await prisma.kasir.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          dilayani: name,
        },
      });
    }
    await prisma.kasir.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: status,
        dilayani: name,
      },
    });
    if (status === 1) {
      res.status(200).json({ msg: `antrian ${nomer} berhasil di kembalikan` });
    } else if (status === 2) {
      res.status(200).json({ msg: `antrian ${nomer} berhasil di selesaikan` });
    } else if (status === 3) {
      res.status(200).json({ msg: `antrian ${nomer} berhasil di tolak` });
    } else {
      return res.status(404).json({ msg: "status tidak diketahui" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteKasir = async (req, res) => {
  try {
    const data = await prisma.kasir.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json({ msg: "data berhasil di hapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
