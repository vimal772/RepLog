
import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Dumbbell,
  Save,
  X,
  LoaderCircle,
  CalendarDays,
  ClipboardList,
} from "lucide-react";

import { apiRequest } from "../services/api";

const createEmptyExercise = () => ({
  name: "",
  sets: 3,
  reps: 10,
  weight: 0,
});

function getTodayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const initialForm = {
  date: getTodayDate(),
  exercises: [createEmptyExercise()],
  notes: "",
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch workout history
  async function fetchWorkouts() {
    try {
      setError("");

      const data = await apiRequest("/api/workouts");

      setWorkouts(
        Array.isArray(data.usersWorkout) ? data.usersWorkout : []
      );
    } catch (err) {
      setError(err.message || "Unable to load workouts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Update date and notes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Update an exercise field
  function handleExerciseChange(index, field, value) {
    setFormData((previous) => ({
      ...previous,
      exercises: previous.exercises.map((exercise, i) =>
        i === index
          ? { ...exercise, [field]: value }
          : exercise
      ),
    }));
  }

  // Add another exercise
  function addExercise() {
    setFormData((previous) => ({
      ...previous,
      exercises: [
        ...previous.exercises,
        createEmptyExercise(),
      ],
    }));
  }

  // Remove an exercise
  function removeExercise(index) {
    setFormData((previous) => ({
      ...previous,
      exercises: previous.exercises.filter(
        (_, i) => i !== index
      ),
    }));
  }

  // Reset the form
  function resetForm() {
    setFormData({
      ...initialForm,
      date: getTodayDate(),
      exercises: [createEmptyExercise()],
    });

    setEditingId(null);
  }

  // Create or update workout
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (formData.exercises.length === 0) {
      setError("Add at least one exercise.");
      return;
    }

    const invalidExercise = formData.exercises.some(
      (exercise) =>
        !exercise.name.trim() ||
        Number(exercise.sets) <= 0 ||
        Number(exercise.reps) <= 0 ||
        Number(exercise.weight) < 0
    );

    if (invalidExercise) {
      setError("Please enter valid details for every exercise.");
      return;
    }

    const payload = {
      date: formData.date,
      notes: formData.notes,
      exercises: formData.exercises.map((exercise) => ({
        name: exercise.name.trim(),
        sets: Number(exercise.sets),
        reps: Number(exercise.reps),
        weight: Number(exercise.weight),
      })),
    };

    try {
      setSaving(true);

      if (editingId) {
        await apiRequest(
          `/api/workouts/${editingId}`,
          "PUT",
          payload
        );

        setSuccess("Workout updated successfully.");
      } else {
        await apiRequest(
          "/api/workouts",
          "POST",
          payload
        );

        setSuccess("Workout saved successfully.");
      }

      resetForm();
      await fetchWorkouts();
    } catch (err) {
      setError(err.message || "Unable to save workout.");
    } finally {
      setSaving(false);
    }
  }

  // Load workout into the form for editing
  function handleEdit(workout) {
    setEditingId(workout.id);

    setFormData({
      date: workout.date,
      notes: workout.notes || "",
      exercises: workout.exercises.map((exercise) => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
      })),
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Delete workout
  async function handleDelete(workoutId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await apiRequest(
        `/api/workouts/${workoutId}`,
        "DELETE"
      );

      if (editingId === workoutId) {
        resetForm();
      }

      setSuccess("Workout deleted successfully.");
      await fetchWorkouts();
    } catch (err) {
      setError(err.message || "Unable to delete workout.");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Page heading */}
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <Dumbbell className="text-emerald-400" size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Workout Tracker
              </h1>
              <p className="mt-1 text-sm text-neutral-400">
                Record your workouts and track your progress.
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {/* Workout form */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Workout" : "Log Workout"}
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                Add the exercises you completed.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Workout Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
              />
            </div>

            {/* Exercises */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Exercises</h3>

                <span className="text-xs text-neutral-500">
                  {formData.exercises.length} added
                </span>
              </div>

              {formData.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-400">
                      Exercise {index + 1}
                    </span>

                    {formData.exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="rounded-lg p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Remove exercise ${index + 1}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>

                  {/* Exercise name */}
                  <div>
                    <label className="mb-2 block text-xs text-neutral-400">
                      Exercise Name
                    </label>

                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(event) =>
                        handleExerciseChange(
                          index,
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="e.g. Bench Press"
                      required
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Sets, reps, weight */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="mb-2 block text-xs text-neutral-400">
                        Sets
                      </label>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={exercise.sets}
                        onChange={(event) =>
                          handleExerciseChange(
                            index,
                            "sets",
                            event.target.value
                          )
                        }
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-3 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-neutral-400">
                        Reps
                      </label>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={exercise.reps}
                        onChange={(event) =>
                          handleExerciseChange(
                            index,
                            "reps",
                            event.target.value
                          )
                        }
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-3 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-neutral-400">
                        Weight (kg)
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        required
                        value={exercise.weight}
                        onChange={(event) =>
                          handleExerciseChange(
                            index,
                            "weight",
                            event.target.value
                          )
                        }
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-3 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addExercise}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-700 py-3 text-sm font-medium text-emerald-400 transition hover:border-emerald-500 hover:bg-emerald-500/5"
              >
                <Plus size={18} />
                Add Exercise
              </button>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Notes (Optional)
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="How was your workout today?"
                className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-neutral-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {editingId ? "Update Workout" : "Save Workout"}
                </>
              )}
            </button>
          </form>
        </section>

        {/* Workout history */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Workout History</h2>
              <p className="mt-1 text-sm text-neutral-400">
                Your previously recorded workouts.
              </p>
            </div>

            <span className="rounded-full bg-neutral-800 px-3 py-1 text-sm text-neutral-300">
              {workouts.length} workouts
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center rounded-xl border border-neutral-800 bg-neutral-900 py-12">
              <LoaderCircle className="animate-spin text-emerald-400" />
            </div>
          ) : workouts.length === 0 ? (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-12 text-center">
              <ClipboardList
                size={35}
                className="mx-auto mb-3 text-neutral-600"
              />
              <h3 className="font-medium">No workouts yet</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Your saved workouts will appear here.
              </p>
            </div>
          ) : (
            [...workouts]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((workout) => (
                <article
                  key={workout.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CalendarDays size={16} />
                        <span className="text-sm font-medium">
                          {workout.date}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-neutral-500">
                        {workout.exercises.length} exercises
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(workout)}
                        className="rounded-lg border border-neutral-700 p-2 text-neutral-300 hover:border-emerald-500 hover:text-emerald-400"
                        aria-label="Edit workout"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(workout.id)}
                        className="rounded-lg border border-neutral-700 p-2 text-neutral-300 hover:border-red-500 hover:text-red-400"
                        aria-label="Delete workout"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  {/* Exercise list */}
                  <div className="space-y-3">
                    {workout.exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800 pt-3"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {exercise.name}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {exercise.sets} sets × {exercise.reps} reps
                          </p>
                        </div>

                        <span className="text-sm font-semibold text-neutral-300">
                          {exercise.weight} kg
                        </span>
                      </div>
                    ))}
                  </div>

                  {workout.notes && (
                    <div className="mt-4 border-t border-neutral-800 pt-3">
                      <p className="text-xs text-neutral-500">Notes</p>
                      <p className="mt-1 text-sm text-neutral-300">
                        {workout.notes}
                      </p>
                    </div>
                  )}
                </article>
              ))
          )}
        </section>
      </div>
    </div>
  );
}
