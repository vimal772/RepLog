
import { useEffect, useState } from "react";
import {
    Dumbbell,
    Scale,
    Target,
    TrendingDown,
    TrendingUp,
    Minus,
    CalendarDays,
    ArrowRight,
    LoaderCircle,
    Activity,
} from "lucide-react";
import { Link } from "react-router";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import { apiRequest } from "../services/api";

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setError("");

                const [profileData, workoutData] = await Promise.all([
                    apiRequest("/api/profile"),
                    apiRequest("/api/workouts"),
                ]);

                setProfile(profileData.profile);
                setWorkouts(
                    Array.isArray(workoutData.usersWorkout)
                        ? workoutData.usersWorkout
                        : []
                );
            } catch (err) {
                setError(err.message || "Unable to load dashboard.");
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    const sortedWorkouts = [...workouts].sort((a, b) =>
        b.date.localeCompare(a.date)
    );
    const strengthExercises = [
        "Bench Press",
        "Deadlift",
        "Squat",
    ];

    const strengthChartData = strengthExercises.map((exerciseName) => {
        const data = sortedWorkouts
            .filter((workout) =>
                workout.exercises.some(
                    (exercise) =>
                        exercise.name.trim().toLowerCase() ===
                        exerciseName.toLowerCase()
                )
            )
            .map((workout) => {
                const exercise = workout.exercises.find(
                    (item) =>
                        item.name.trim().toLowerCase() ===
                        exerciseName.toLowerCase()
                );

                return {
                    date: workout.date,
                    weight: exercise.weight,
                };
            })
            .reverse();

        return {
            name: exerciseName,
            data,
        };
    });

    const recentWorkouts = sortedWorkouts.slice(0, 5);

    const totalExercises = workouts.reduce(
        (total, workout) => total + workout.exercises.length,
        0
    );

    const fitnessGoal = (() => {
        if (!profile) return "Not available";

        if (profile.weight > profile.targetWeight) {
            return "Weight Loss";
        }

        if (profile.weight < profile.targetWeight) {
            return "Weight Gain";
        }

        return "Maintenance";
    })();

    const GoalIcon =
        fitnessGoal === "Weight Loss"
            ? TrendingDown
            : fitnessGoal === "Weight Gain"
                ? TrendingUp
                : Minus;

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <LoaderCircle
                    className="animate-spin text-violet-500"
                    size={32}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-10">
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">

            {/* Welcome */}
            <section>
                <p className="text-sm text-zinc-400">
                    Welcome back,
                </p>

                <h1 className="mt-1 text-3xl font-bold text-white">
                    {profile?.name || "Athlete"} 👋
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                    Here's your fitness overview.
                </p>
            </section>

            {/* Statistics */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* Total workouts */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">
                            Total Workouts
                        </span>

                        <Dumbbell className="text-violet-400" size={21} />
                    </div>

                    <p className="mt-4 text-3xl font-bold text-white">
                        {workouts.length}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                        Sessions completed
                    </p>
                </div>

                {/* Total exercises */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">
                            Exercises Logged
                        </span>

                        <Activity className="text-blue-400" size={21} />
                    </div>

                    <p className="mt-4 text-3xl font-bold text-white">
                        {totalExercises}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                        Across all workouts
                    </p>
                </div>

                {/* Current weight */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">
                            Current Weight
                        </span>

                        <Scale className="text-emerald-400" size={21} />
                    </div>

                    <p className="mt-4 text-3xl font-bold text-white">
                        {profile?.weight ?? "--"}
                        <span className="ml-1 text-sm font-normal text-zinc-400">
                            kg
                        </span>
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                        Your latest profile weight
                    </p>
                </div>

                {/* Target weight */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">
                            Target Weight
                        </span>

                        <Target className="text-orange-400" size={21} />
                    </div>

                    <p className="mt-4 text-3xl font-bold text-white">
                        {profile?.targetWeight ?? "--"}
                        <span className="ml-1 text-sm font-normal text-zinc-400">
                            kg
                        </span>
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                        Your fitness target
                    </p>
                </div>
            </section>

            {/* Fitness goal */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-zinc-400">
                            Your Fitness Goal
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                            <GoalIcon
                                size={25}
                                className="text-violet-400"
                            />

                            <h2 className="text-xl font-bold text-white">
                                {fitnessGoal}
                            </h2>
                        </div>

                        <p className="mt-2 text-sm text-zinc-500">
                            Workout split:{" "}
                            <span className="text-zinc-300">
                                {profile?.workoutSplit
                                    ? profile.workoutSplit
                                        .split("_")
                                        .map(
                                            (word) =>
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1)
                                        )
                                        .join(" ")
                                    : "Not selected"}
                            </span>
                        </p>
                    </div>

                    <Link
                        to="/profile"
                        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-violet-500 hover:text-white"
                    >
                        Edit Profile
                    </Link>
                </div>
            </section>

            {/* Strength Progress Charts */}
            <section className="space-y-5">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        Strength Progress
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Track your lifting performance over time.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {strengthChartData.map((chart) => (
                        <div
                            key={chart.name}
                            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                        >
                            <h3 className="mb-1 font-semibold text-white">
                                {chart.name}
                            </h3>

                            <p className="mb-5 text-xs text-zinc-500">
                                Weight lifted (kg)
                            </p>

                            {chart.data.length < 2 ? (
                                <div className="flex h-56 items-center justify-center text-center text-sm text-zinc-500">
                                    Log this exercise in at least two workouts
                                    to see your progress.
                                </div>
                            ) : (
                                <div className="h-56 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chart.data}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#3f3f46"
                                            />

                                            <XAxis
                                                dataKey="date"
                                                stroke="#a1a1aa"
                                                tick={{ fontSize: 10 }}
                                            />

                                            <YAxis
                                                stroke="#a1a1aa"
                                                tick={{ fontSize: 10 }}
                                                unit=" kg"
                                                domain={["auto", "auto"]}
                                            />

                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#18181b",
                                                    border: "1px solid #3f3f46",
                                                    borderRadius: "10px",
                                                    color: "#fff",
                                                }}
                                                formatter={(value) => [
                                                    `${value} kg`,
                                                    "Weight lifted",
                                                ]}
                                            />

                                            <Line
                                                type="monotone"
                                                dataKey="weight"
                                                stroke="#a78bfa"
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: "#a78bfa" }}
                                                activeDot={{ r: 7 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent workouts */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">

                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Recent Workouts
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Your latest training sessions.
                        </p>
                    </div>

                    <Link
                        to="/workouts"
                        className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                    >
                        View All
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {recentWorkouts.length === 0 ? (
                    <div className="py-10 text-center">
                        <Dumbbell
                            size={32}
                            className="mx-auto mb-3 text-zinc-600"
                        />

                        <p className="font-medium text-zinc-300">
                            No workouts logged yet
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                            Start logging your workouts to see them here.
                        </p>

                        <Link
                            to="/workouts"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
                        >
                            <Dumbbell size={16} />
                            Log Workout
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentWorkouts.map((workout) => (
                            <div
                                key={workout.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-violet-500/10 p-3">
                                        <CalendarDays
                                            size={19}
                                            className="text-violet-400"
                                        />
                                    </div>

                                    <div>
                                        <p className="font-medium text-white">
                                            {new Date(
                                                `${workout.date}T00:00:00`
                                            ).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>

                                        <p className="mt-1 text-xs text-zinc-500">
                                            {workout.exercises.length} exercises
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-medium text-zinc-300">
                                        {workout.exercises
                                            .slice(0, 2)
                                            .map((exercise) => exercise.name)
                                            .join(", ")}
                                    </p>

                                    {workout.exercises.length > 2 && (
                                        <p className="mt-1 text-xs text-zinc-500">
                                            +{workout.exercises.length - 2} more
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
