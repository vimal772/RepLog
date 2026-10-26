/**
 * LabelDivider
 * Renders:  ———————  Label  ———————
 * Used for "Or continue with email" and "Already have an account?"
 *
 * Props
 * - children:  the label text
 * - className: extra classes for the wrapper (e.g. "my-6")
 * - lineClassName: override the line color/thickness
 */
export default function LabelDivider({
  children,
  className = "",
  lineClassName = "bg-white/15",
}) {
  return (
    <div
      role="separator"
      aria-label={typeof children === "string" ? children : undefined}
      className={`flex items-center gap-3 text-sm text-gray-400 ${className}`}
    >
      <span className={`h-px flex-1 ${lineClassName}`} />
      <span className="shrink-0 px-1">{children}</span>
      <span className={`h-px flex-1 ${lineClassName}`} />
    </div>
  );
}

/* ---------------- Usage ----------------

import LabelDivider from "./LabelDivider";

<CustomButton icon={<Chrome size={18} />}>Sign up with Google</CustomButton>
<LabelDivider className="my-5">Or continue with email</LabelDivider>
...form fields...
<CustomButton type="submit">Create Account</CustomButton>
<LabelDivider className="my-5">Already have an account?</LabelDivider>
<CustomButton>Sign in instead</CustomButton>
------------------------------------------ */