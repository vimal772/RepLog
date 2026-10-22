import express from "express";

import { readJson, writeJson } from "../utils/fileStorage.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const profileRouter = express.Router();
const allowedSexValues = ["male", "female", "other"];

profileRouter.get("/", authMiddleware, async (req, res) => {
  const userID = req.user.id;
  if (!userID) {
    return res.status(401).json({
      message: "unauthorized invalid token",
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
      return obj.id === userID;
    });
    if (!existingUser) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    if (!existingUser.profile) {
      return res.status(404).json({
        message: "user dont have profile yet",
      });
    }
    const { profile } = existingUser;
    res.status(200).json({
      message: "success",
      profile,
    });
  } catch (v2) {
    console.log("Invalid error occured in login " + v2);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

profileRouter.put("/", authMiddleware, async (req, res) => {
  const { age, sex, height, weight, targetWeight } = req.body;
  if (
    !Number.isFinite(age) ||
    !sex ||
    !Number.isFinite(height) ||
    !Number.isFinite(weight) ||
    !Number.isFinite(targetWeight) ||
    typeof age !== "number" ||
    typeof height !== "number" ||
    typeof weight !== "number" ||
    typeof targetWeight !== "number" ||
    typeof sex !== "string" ||
    // Age must be an integer from 16 to 100
    !Number.isInteger(age) ||
    age < 16 ||
    age > 100 ||
    // Height, weight, and target weight must be positive numbers (> 0)
    height <= 0 ||
    weight <= 0 ||
    targetWeight <= 0 ||
    // Sex must be one of your explicitly allowed values
    !allowedSexValues.includes(sex.trim().toLowerCase())
  ) {
    return res.status(400).json({
      message: "Invalid inputs. Please check all profile fields.",
    });
  }

  const userID = req.user.id;
  if (!userID) {
    return res.status(401).json({
      message: "unautherized invalid token",
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
      return obj.id === userID;
    });

    const existingUserIndex = fileData.findIndex((obj) => {
      return obj.id === userID;
    });

    if (!existingUser || existingUserIndex === -1) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const newProfile = {
      age,
      sex: sex.trim().toLowerCase(),
      height,
      weight,
      targetWeight,
    };
    const updatedUser = {
      ...existingUser,
      profile: newProfile,
    };

    fileData[existingUserIndex] = updatedUser;
    await writeJson(fileData, "users");
    res.status(200).json({
      message: "profile added/updated successfully",
      profile: newProfile
    });
  } catch (v2) {
    console.log("Invalid error occured in login " + v2);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});
export default profileRouter;
