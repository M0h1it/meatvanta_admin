import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  forgotPasswordRequest,
  verifyResetOtpRequest,
  resetPasswordRequest,
} from "../api/authApi";
import BrandLogo from "../../../components/common/BrandLogo";

const STEPS = { PHONE: "phone", OTP: "otp", PASSWORD: "password" };
const MIN_PASSWORD_LENGTH = 8;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(STEPS.PHONE);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [devOtp, setDevOtp] = useState(null);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  async function handleSendCode(e) {
    e?.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await forgotPasswordRequest(phone);
      setDevOtp(result.devOtp || null);
      // Wording matches the API: it must not confirm whether the number
      // actually belongs to an admin account.
      setNotice("If that number has an admin account, a code has been sent to it.");
      setStep(STEPS.OTP);
      setResendIn(60);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't send the code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { resetToken: token } = await verifyResetOtpRequest({ phone, otp });
      setResetToken(token);
      setNotice(null);
      setStep(STEPS.PASSWORD);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't verify that code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("The two passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordRequest({ resetToken, newPassword });
      navigate("/login", {
        replace: true,
        state: { message: "Password updated. Please sign in with your new password." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't update the password.");
      setIsSubmitting(false);
    }
  }

  const passwordTooShort = newPassword.length > 0 && newPassword.length < MIN_PASSWORD_LENGTH;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-md">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-lg border border-outline-variant p-lg">
        <div className="flex justify-center mb-3">
          <BrandLogo variant="login" className="h-16 w-16" />
        </div>

        <h1 className="font-headline-md text-headline-md text-primary text-center">
          {step === STEPS.PASSWORD ? "Set a New Password" : "Reset Your Password"}
        </h1>
        <p className="text-sm text-on-surface-variant text-center mt-1 mb-lg">
          {step === STEPS.PHONE && "Enter the mobile number linked to your admin account."}
          {step === STEPS.OTP && `Enter the 6-digit code sent to ${phone}.`}
          {step === STEPS.PASSWORD && "Choose a password you haven't used before."}
        </p>

        {notice && (
          <div className="mb-md rounded bg-surface-container-low text-on-surface-variant text-sm px-3 py-2">
            {notice}
          </div>
        )}
        {error && (
          <div className="mb-md rounded bg-error-container text-on-error-container text-sm px-3 py-2">
            {error}
          </div>
        )}

        {devOtp && (
          <div className="mb-md rounded bg-accent-soft border border-accent text-on-surface text-sm px-3 py-2">
            No SMS provider configured — your code is{" "}
            <span className="font-mono font-bold">{devOtp}</span>
          </div>
        )}

        {step === STEPS.PHONE && (
          <form onSubmit={handleSendCode}>
            <label className="block font-label-bold text-label-bold text-on-surface mb-1">
              Mobile Number
            </label>
            <div className="flex items-center rounded border border-outline-variant overflow-hidden mb-4">
              <span className="px-3 py-2.5 text-sm font-semibold text-on-surface-variant border-r border-outline-variant">
                +91
              </span>
              <input
                autoFocus
                type="tel"
                inputMode="numeric"
                maxLength={10}
                required
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || phone.length !== 10}
              className="w-full bg-primary-container text-on-primary font-semibold py-2.5 rounded hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {isSubmitting ? "Sending..." : "Send Code"}
            </button>
          </form>
        )}

        {step === STEPS.OTP && (
          <form onSubmit={handleVerify}>
            <label className="block font-label-bold text-label-bold text-on-surface mb-1">
              6-Digit Code
            </label>
            <input
              autoFocus
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="------"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded border border-outline-variant px-4 py-3 text-center text-lg font-bold tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />

            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 6}
              className="w-full bg-primary-container text-on-primary font-semibold py-2.5 rounded hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              disabled={resendIn > 0 || isSubmitting}
              onClick={handleSendCode}
              className="w-full mt-3 text-sm font-semibold text-on-surface-variant disabled:opacity-50"
            >
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>
          </form>
        )}

        {step === STEPS.PASSWORD && (
          <form onSubmit={handleReset}>
            <label className="block font-label-bold text-label-bold text-on-surface mb-1">
              New Password
            </label>
            <div className="relative mb-1">
              <input
                autoFocus
                type={showPassword ? "text" : "password"}
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded border border-outline-variant px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
            <p className={`text-xs mb-3 ${passwordTooShort ? "text-error" : "text-on-surface-variant"}`}>
              At least {MIN_PASSWORD_LENGTH} characters.
            </p>

            <label className="block font-label-bold text-label-bold text-on-surface mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border border-outline-variant px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />

            <button
              type="submit"
              disabled={
                isSubmitting || newPassword.length < MIN_PASSWORD_LENGTH || !confirmPassword
              }
              className="w-full bg-primary-container text-on-primary font-semibold py-2.5 rounded hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>

            <p className="text-xs text-on-surface-variant mt-3 text-center">
              You'll be signed out everywhere and will need to sign in again.
            </p>
          </form>
        )}

        <div className="mt-lg pt-md border-t border-outline-variant text-center">
          <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}