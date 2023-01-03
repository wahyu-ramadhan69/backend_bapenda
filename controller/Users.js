import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient({
  // log: ["query"],
});

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  const data = await prisma.user.findMany({
    where: {
      email: email,
    },
  });
  if (data.length > 0)
    return res.status(400).json({
      data: data,
      msg: "Email telah digunakan mohon gunakan email lain",
    });
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
    });
    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
  }
};

export const ubahPass = async (req, res) => {
  const { email, password, confPass } = req.body;
  if (password !== confPass)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await prisma.$queryRaw`UPDATE user SET password = ${hashPassword} WHERE email = ${email}`;
    res.status(200).json({ msg: "Password berhasil di ubah" });
  } catch (error) {
    res.json(error);
  }
};

export const ubahUser = async (req, res) => {
  const { email, password, confPass, newPass } = req.body;
  if (password !== confPass)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });
  const user = await prisma.user.findMany({
    where: {
      email: email,
    },
  });
  const match = await bcrypt.compare(password, user[0].password);
  if (!match) return res.status(400).json({ msg: "Password salah" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(newPass, salt);
  try {
    await prisma.$queryRaw`UPDATE user SET password = ${hashPassword} WHERE email = ${email}`;
    res.status(200).json({ msg: "Password berhasil di ubah" });
  } catch (error) {
    res.json(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await prisma.user.findMany({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Password salah" });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const role = user[0].role;
    const accessToken = jwt.sign(
      { userId, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: refreshToken,
      },
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email tidak ditemukan" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await prisma.user.findMany({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: { refresh_token: null },
  });
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

export const Delete = async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json({ msg: "user berhasil di hapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
