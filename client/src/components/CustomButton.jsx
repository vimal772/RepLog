import { forwardRef } from "react";

/**
 * CustomButton
 * Matches the dark auth UI: green gradient pill-rect buttons with dark text.
 *
 * Props
 * - variant:   "primary" | "secondary" | "ghost"   (default "primary")
 * - size:      "sm" | "md" | "lg"                  (default "md")
 * - fullWidth: boolean                              (default true, like the form)
 * - icon:      ReactNode shown before the label
 * - loading:   boolean, shows spinner and disables the button
 * - type:      "button" | "submit" | "reset"        (default "button")
 */

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium " +
  "transition duration-150 select-none " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f] " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary:
    "bg-gradient-to-r from-[#00e676] to-[#1de9a0] text-[#0b1f14] " +
    "hover:brightness-110 active:brightness-95 active:scale-[0.99]",
  secondary:
    "border border-white/10 bg-white/5 text-gray-100 " +
    "hover:bg-white/10 active:bg-white/[0.07]",
  ghost: "bg-transparent text-emerald-400 hover:bg-emerald-400/10",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-90" />
  </svg>
);

const CustomButton = forwardRef(function CustomButton(
  {
    children,
    variant = "primary",
    size = "md",
    fullWidth = true,
    icon = null,
    loading = false,
    disabled = false,
    type = "button",
    className = "",
    ...props
  },
  ref
) {
  const classes = [
    base,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...props}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
});

export default CustomButton;

/* ---------------- Usage example (the form from your screenshot) ----------------

import CustomButton from "./CustomButton";
import { Chrome } from "lucide-react";

export default function SignUp() {
  return (
    <div className="mx-auto w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-[#18181d] p-8">
      <CustomButton icon={<Chrome size={18} />}>Sign up with Google</CustomButton>

      <form className="space-y-4">
        ...inputs...
        <CustomButton type="submit">Create Account</CustomButton>
      </form>

      <p className="text-center text-sm text-gray-400">Already have an account?</p>
      <CustomButton>Sign in instead</CustomButton>
    </div>
  );
}
-------------------------------------------------------------------------------- */