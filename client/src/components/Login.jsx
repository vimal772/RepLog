import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";

export default function Login() {
  return (
    <section className="w-full md:w-1/2 mx-auto min-h-[calc(100vh-4.1rem)] flex flex-col items-center justify-center gap-4 bg-black px-6">
      <h1 className="text-4xl font-bold mb-4 text-white">Welcome Back</h1>

      <CustomInput placeholder="Email address" />
      <CustomInput placeholder="Password" type="password" />

      <CustomButton type="submit" className="cursor-pointer">Sign in</CustomButton>

      <p className="text-sm text-gray-400">
        Don't have an account?{" "}
        <a href="/signup" className="font-medium text-emerald-400 hover:underline">
          Sign up
        </a>
      </p>
    </section>
  );
}