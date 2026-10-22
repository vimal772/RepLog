import express from "express";
import crypto from "node:crypto";

import { readJson, writeJson } from "../utils/fileStorage.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const workoutRoute = express.Router();

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidCalendarDate(str) {
  if (typeof str !== "string" || !DATE_RE.test(str)) return false;
  const d = new Date(`${str}T00:00:00Z`);
  // round-trip catches things like 2026-02-31
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === str;
}

function todayLocal() {
  // toISOString() is UTC and can be off by a day in IST, so build it from local parts
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function validateWorkout({ date, exercises, notes }) {
  const errors = [];

  if (date !== undefined && !isValidCalendarDate(date)) {
    errors.push("date must be a valid date in YYYY-MM-DD format");
  }

  if (!Array.isArray(exercises) || exercises.length === 0) {
    errors.push("exercises must be a non-empty array");
  } else {
    exercises.forEach((ex, i) => {
      const p = `exercises[${i}]`;
      if (typeof ex?.name !== "string" || ex.name.trim() === "") {
        errors.push(`${p}.name must be a non-empty string`);
      }
      if (!Number.isInteger(ex?.sets) || ex.sets <= 0) {
        errors.push(`${p}.sets must be a positive integer`);
      }
      if (!Number.isInteger(ex?.reps) || ex.reps <= 0) {
        errors.push(`${p}.reps must be a positive integer`);
      }
      if (!Number.isFinite(ex?.weight) || ex.weight < 0) {
        errors.push(`${p}.weight must be a finite number, zero or greater`);
      }
    });
  }

  if (notes !== undefined && typeof notes !== "string") {
    errors.push("notes must be a string");
  }

  return errors;
}

workoutRoute.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({
      message: "unauthorized invalid token",
    });
  }
  try {
    const fileData = await readJson("workouts");
    if (!Array.isArray(fileData)) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
    const usersWorkout = fileData.filter((obj) => {
      return obj.userId === userId;
    });

    res.status(200).json({
      message: "success",
      usersWorkout,
    });
  } catch (v1) {
    console.log("Invalid error occured in login " + v1);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

workoutRoute.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({
      message: "unauthorized invalid token",
    });
  }
  const { date, exercises, notes } = req.body || {};
  const errors = validateWorkout({ date, exercises, notes });
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  try {
    const fileData = await readJson("workouts");
    if (!Array.isArray(fileData)) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
    const workout = {
      id: crypto.randomUUID(),
      userId,
      date: date ?? todayLocal(),
      exercises: exercises.map(({ name, sets, reps, weight }) => ({
        name: name.trim(),
        sets,
        reps,
        weight,
      })),
      notes: notes?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    fileData.push(workout);
    await writeJson(fileData, "workouts");

    return res.status(201).json(workout);
  } catch (v1) {
    console.log("Invalid error occured in login " + v1);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

workoutRoute.put("/:id", authMiddleware, async (req, res) => {
  const workoutId = req.params.id;
  if (!workoutId) {
    return res.status(401).json({
      message: "Invalid Workout Id",
    });
  }
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({
      message: "unauthorized invalid token",
    });
  }

  try {
    const fileData = await readJson("workouts");
    if (!Array.isArray(fileData)) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    const workoutIndex = fileData.findIndex((obj) => {
      return obj.id === workoutId;
    });

    if (workoutIndex === -1) {
      return res.status(404).json({
        message: "Workout does not exist for this id" + workoutId,
      });
    }
    if (fileData[workoutIndex].userId !== userId) {
      return res.status(403).json({
        message: "Given workout id is not for authenticated user",
      });
    }

    const { date, exercises, notes } = req.body || {};
    const errors = validateWorkout({ date, exercises, notes });
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const updatedWorkout = {
      createdAt: fileData[workoutIndex].createdAt,
      userId: fileData[workoutIndex].userId,
      id: fileData[workoutIndex].id,
      date: date,
      exercises: exercises.map(({ name, sets, reps, weight }) => ({
        name: name.trim(),
        sets,
        reps,
        weight,
      })),
      notes: notes?.trim(),
    };
    fileData[workoutIndex] = updatedWorkout;

    await writeJson(fileData, "workouts");
    return res.status(200).json(updatedWorkout);
  } catch (v1) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

workoutRoute.delete("/:id", authMiddleware, async (req, res) => {
  const workoutId = req.params.id;
  if (!workoutId) {
    return res.status(400).json({
      message: "Invalid Workout Id",
    });
  }
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({
      message: "unauthorized invalid token",
    });
  }
  try {
    const fileData = await readJson("workouts");
    if (!Array.isArray(fileData)) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    const workoutIndex = fileData.findIndex((obj) => {
      return obj.id === workoutId;
    });

    if (workoutIndex === -1) {
      return res.status(404).json({
        message: "Workout does not exist for this id" + workoutId,
      });
    }
    if (fileData[workoutIndex].userId !== userId) {
      return res.status(403).json({
        message: "Given workout id is not for authenticated user",
      });
    }

    fileData.splice(workoutIndex,1);
    await writeJson(fileData, "workouts");
    return res.status(200).json({
        message: 'Workout deleted successfully'
    });
  } catch (v1) {
    console.log("Invalid error occured in login " + v1);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default workoutRoute;
