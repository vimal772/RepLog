
import { useEffect, useState } from "react";
import {
  UserRound,
  Save,
  LoaderCircle,
  Target,
  TrendingDown,
  TrendingUp,
  Minus,
  Dumbbell,
  CheckCircle2,
} from "lucide-react";

import { apiRequest } from "../services/api";

const initialForm = {
  age: "",
  sex: "",
  height: "",
  weight: "",
  targetWeight: "",
  workoutSplit: "",
};

const workoutSplits = [
  {
    id: "bro_split",
    name: "Bro Split",
    description: "One muscle group per day",
    days: "5–6 days/week",
  },
  {
    id: "push_pull_legs",
    name: "Push Pull Legs",
    description: "Push, pull and legs rotation",
    days: "3–6 days/week",
  },
  {
    id: "upper_lower",
    name: "Upper / Lower",
    description: "Alternate upper and lower body",
    days: "4 days/week",
  },
  {
    id: "full_body",
    name: "Full Body",
    description: "Train all major muscle groups",
    days: "3 days/week",
  },
];

export default function Profile() {
  const [formData, setFormData] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // DERIVED FITNESS GOAL
  const currentWeight = Number(formData.weight);
  const targetWeight = Number(formData.targetWeight);

  let fitnessGoal = "Not determined";
  let GoalIcon = Target;
  let goalDescription = "Enter your current and target weight.";

  if (
    formData.weight !== "" &&
    formData.targetWeight !== "" &&
    currentWeight > 0 &&
    targetWeight > 0
  ) {
    if (currentWeight > targetWeight) {
      fitnessGoal = "Weight Loss";
      GoalIcon = TrendingDown;
      goalDescription = "Your target weight is lower than your current weight.";
    } else if (currentWeight < targetWeight) {
      fitnessGoal = "Weight Gain";
      GoalIcon = TrendingUp;
      goalDescription = "Your target weight is higher than your current weight.";
    } else {
      fitnessGoal = "Maintenance";
      GoalIcon = Minus;
      goalDescription = "Your target weight matches your current weight.";
    }
  }

  // GET PROFILE
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiRequest("/api/profile");

        if (data?.profile) {
          setFormData({
            age: data.profile.age ?? "",
            sex: data.profile.sex ?? "",
            height: data.profile.height ?? "",
            weight: data.profile.weight ?? "",
            targetWeight: data.profile.targetWeight ?? "",
            workoutSplit: data.profile.workoutSplit ?? "",
          });
        }
      } catch (err) {
        if (err.status !== 404) {
          setError(err.message || "Unable to fetch profile");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // HANDLE INPUT CHANGE
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  // HANDLE WORKOUT SPLIT SELECTION
  function handleSplitChange(splitId) {
    setFormData((prev) => ({
      ...prev,
      workoutSplit: splitId,
    }));

    setError("");
    setSuccess("");
  }

  // PUT PROFILE
  async function handleSubmit(event) {
    event.preventDefault();

    setIsSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      age: Number(formData.age),
      sex: formData.sex,
      height: Number(formData.height),
      weight: Number(formData.weight),
      targetWeight: Number(formData.targetWeight),
      workoutSplit: formData.workoutSplit,
    };

    try {
      const data = await apiRequest(
        "/api/profile",
        "PUT",
        payload
      );

      setSuccess(data.message || "Profile saved successfully!");
    } catch (err) {
      setError(err.message || "Unable to save profile");
    } finally {
      setIsSaving(false);
    }
  }

  // REUSABLE STYLES
  const inputClass =
    "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

  const labelClass =
    "mb-2 block text-sm font-medium text-zinc-300";

  const cardClass =
    "rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/10 sm:p-7";

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-zinc-400">
        <LoaderCircle
          size={26}
          className="animate-spin text-violet-500"
        />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">

      {/* PAGE HEADER */}
      <div className="mb-8 flex items-center gap-4">
        <div className="rounded-2xl bg-violet-500/15 p-4 text-violet-400">
          <UserRound size={28} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-zinc-400 sm:text-base">
            Manage your personal and fitness information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* PERSONAL INFORMATION */}
        <section className={cardClass}>
          <div className="mb-7 flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/15 p-2.5 text-violet-400">
              <UserRound size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Personal Information
              </h2>
              <p className="text-xs text-zinc-500">
                Your basic body measurements
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
              <label className={labelClass}>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="16"
                max="100"
                required
                placeholder="Enter your age"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Sex</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                min="1"
                step="0.1"
                required
                placeholder="e.g. 175"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Current Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="1"
                step="0.1"
                required
                placeholder="e.g. 75"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Target Weight (kg)</label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={handleChange}
                min="1"
                step="0.1"
                required
                placeholder="e.g. 68"
                className={inputClass}
              />
            </div>

          </div>
        </section>

        {/* FITNESS INFORMATION */}
        <section className={cardClass}>

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/15 p-2.5 text-violet-400">
              <Dumbbell size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Fitness Information
              </h2>
              <p className="text-xs text-zinc-500">
                Your fitness goal and training preferences
              </p>
            </div>
          </div>

          {/* FITNESS GOAL */}
          <div className="mb-7 rounded-xl border border-zinc-700 bg-zinc-950 p-5">

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/15 p-3 text-violet-400">
                <GoalIcon size={24} />
              </div>

              <div>
                <p className="text-sm text-zinc-400">
                  Your Fitness Goal
                </p>
                <h3 className="mt-1 text-xl font-bold text-white">
                  {fitnessGoal}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-sm text-zinc-500">
              {goalDescription}
            </p>

            {fitnessGoal !== "Not determined" && (
              <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4">
                <div>
                  <p className="text-xs text-zinc-500">
                    Current Weight
                  </p>
                  <p className="font-semibold text-white">
                    {currentWeight} kg
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-zinc-500">
                    Difference
                  </p>
                  <p className="font-semibold text-violet-400">
                    {Math.abs(currentWeight - targetWeight).toFixed(1)} kg
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-zinc-500">
                    Target Weight
                  </p>
                  <p className="font-semibold text-white">
                    {targetWeight} kg
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* WORKOUT SPLIT */}
          <div>
            <div className="mb-4">
              <h3 className="font-semibold text-white">
                Workout Split
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Select your preferred training routine
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {workoutSplits.map((split) => {
                const isSelected =
                  formData.workoutSplit === split.id;

                return (
                  <button
                    key={split.id}
                    type="button"
                    onClick={() => handleSplitChange(split.id)}
                    aria-pressed={isSelected}
                    className={`rounded-xl border p-4 text-left transition duration-200 ${
                      isSelected
                        ? "border-violet-500 bg-violet-500/10 ring-1 ring-violet-500/30"
                        : "border-zinc-700 bg-zinc-950 hover:border-zinc-500"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Dumbbell
                        size={21}
                        className={
                          isSelected
                            ? "text-violet-400"
                            : "text-zinc-500"
                        }
                      />

                      {isSelected && (
                        <CheckCircle2
                          size={19}
                          className="text-violet-400"
                        />
                      )}
                    </div>

                    <h4 className="font-semibold text-white">
                      {split.name}
                    </h4>

                    <p className="mt-1 text-xs text-zinc-400">
                      {split.description}
                    </p>

                    <p className="mt-3 text-xs font-medium text-violet-400">
                      {split.days}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ERROR MESSAGE */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div
            role="status"
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
          >
            {success}
          </div>
        )}

        {/* SAVE BUTTON */}
        <div className="flex justify-end pb-6">
          <button
            type="submit"
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSaving ? (
              <>
                <LoaderCircle
                  size={19}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={19} />
                Save Profile
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
