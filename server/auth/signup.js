import express from "express";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

import { writeJson, readJson } from "../utils/fileStorage.js";

const router = express.Router();
const saltRounds = 10;
const secret_key = process.env.JWT_SECRET;

async function hashPassword(password) {
  try {
    const passwordHashed = await bcrypt.hash(password, saltRounds);
    return passwordHashed;
  } catch (e) {
    throw new Error("Failure while hashing password");
  }
}

async function addData(fileType, name, email, passwordHash) {
  if (!fileType) {
    throw new Error("File type missing");
  }
  const fileData = await readJson(fileType);
  if (!Array.isArray(fileData)) {
    throw new Error("Invalid file type returned");
  }
  const duplicateEntry = fileData.find((obj) => {
    return obj.email.trim().toLowerCase() === email.trim().toLowerCase();
  });
  if (duplicateEntry) {
    const err = new Error("Duplicate mail found");
    err.code = 409;
    throw err;
  }

  const id = crypto.randomUUID();
  const obj = {
    id,
    name,
    email,
    passwordHash,
  };

  fileData.push(obj);

  await writeJson(fileData, fileType);
}
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (
    !name ||
    !email ||
    !password ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      message: "Invalid inputs given",
    });
  }
  if (name.trim() === "" || email.trim() === "") {
    return res.status(400).json({
      message: "Name or email cannot be empty",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password cannot be less than 8 characters",
    });
  }
  const normalizedMail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(normalizedMail)) {
    return res.status(400).json({
      message: "Email format mismatch",
    });
  }

  try {
    const normalizedName = name.trim();
    const hashedPw = await hashPassword(password);
    await addData("users", normalizedName, normalizedMail, hashedPw);
    res.status(201).json({ name: normalizedName, email: normalizedMail });
  } catch (e) {
    let status = 500,
      message = "Internal server error";
    if (e.code === 409) {
      ((status = 409), (message = e.message));
    }
    console.log("signup adding user failed " + e);
    return res.status(status).json({
      message: message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      message: "Invalid inputs given",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password cannot be less than 8 characters",
    });
  }
  const normalizedMail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(normalizedMail)) {
    return res.status(400).json({
      message: "Email format mismatch",
    });
  }
  try {
    const fileData = await readJson("users");
    if (!Array.isArray(fileData)) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
    const existingUser = fileData.find((obj) => {
      return obj.email.trim().toLowerCase() === normalizedMail;
    });
    if (!existingUser) {
      return res.status(401).json({
        message: "Given email does not registed in rep log",
      });
    }
    const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Unauthorized failed password match",
      });
    }
    const token = jwt.sign({ id: existingUser.id }, secret_key, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login success",
      token,
    });
  } catch (v2) {
    console.log("Invalid error occured in login " + v2);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
