import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import LabelDivider from "./LabelDiveder";
import { ChromeIcon } from "./Home";

export default function Signup() {
  return (
    <main className="min-h-screen bg-[#222226] px-4 py-10 flex flex-col items-center">
      <h1 className="mb-6 text-3xl font-bold text-white text-center">
        Create your account
      </h1>

      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#18181d] p-8">
        <CustomButton icon={<ChromeIcon />}>Sign up with Google</CustomButton>

        <LabelDivider className="my-5">Or continue with email</LabelDivider>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <CustomInput label="Full Name" required placeholder="John Doe" />
          <CustomInput label="Email Address" required type="email" placeholder="you@example.com" />
          <CustomInput label="Password" required type="password" placeholder="••••••••" />
          <CustomInput label="Confirm Password" required type="password" placeholder="••••••••" />

          <CustomButton type="submit">Create Account</CustomButton>
        </form>

        <LabelDivider className="my-5">Already have an account?</LabelDivider>

        <CustomButton>Sign in instead</CustomButton>
      </section>
    </main>
  );
}