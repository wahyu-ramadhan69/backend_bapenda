import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getBphtb = async (req, res) => {
  try {
    const data = await prisma.bphtb.findMany({
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

export const getBphtbMenunggu = async (req, res) => {
  try {
    const data = await prisma.bphtb.findMany({
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

export const getBphtbSelesai = async (req, res) => {
  try {
    const data = await prisma.bphtb.findMany({
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

export const jumlahAntrianBphtb = async (req, res) => {
  try {
    let lastDay = Date.now() - 24 * 60 * 60 * 1000;
    lastDay = new Date(lastDay).toISOString();
    const totalAntri = await prisma.bphtb.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    const totalSelesaiAntri = await prisma.bphtb.count({
      where: {
        status: 2,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    const totalMenunggu = await prisma.bphtb.count({
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

export const getBphtbById = async (req, res) => {
  try {
    const data = await prisma.bphtb.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createBphtb = async (req, res) => {
  const { nomer_antrian, status } = req.body;
  let lastDay = Date.now() - 24 * 60 * 60 * 1000;
  lastDay = new Date(lastDay).toISOString();
  try {
    const response = await prisma.bphtb.findMany();
    if (response.length < 1) {
      await prisma.bphtb.create({
        data: {
          nomer_antrian: 1,
          status: 1,
        },
      });
      res.status(201).json({ nomer: 1, msg: "data berhasil di tambahkan" });
    } else {
      const cek = await prisma.bphtb.findMany({
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
        await prisma.bphtb.create({
          data: {
            nomer_antrian: 1,
            status: 1,
          },
        });
        res.status(201).json({ nomer: 1, msg: "data berhasil di tambahkan" });
      } else {
        let nomer = cek[0].nomer_antrian + 1;
        await prisma.bphtb.create({
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
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};

export const updateBphtb = async (req, res) => {
  const { status, nomer } = req.body;

  try {
    const data = await prisma.bphtb.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: status,
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

export const deleteBphtb = async (req, res) => {
  try {
    await prisma.bphtb.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json({ msg: "data berhasil di hapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
