import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import BrandLogo from "../../../components/common/BrandLogo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low px-md">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface-container-lowest rounded-lg border border-outline-variant p-xl"
      >
        <div className="flex justify-center mb-3">
          <BrandLogo className="h-16 w-16" />
        </div>
        <h1 className="font-display-lg text-display-lg text-primary text-center">Meat Vanta</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant text-center mt-1 mb-lg">
          Admin Portal Login
        </p>

        {error && (
          <div className="mb-md rounded bg-error-container text-on-error-container text-body-md font-body-md px-sm py-2">
            {error}
          </div>
        )}

        <label className="block font-label-bold text-label-bold text-on-surface mb-1">Email Address</label>
        <div className="relative mb-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            mail
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@meatvanta.com"
            className="w-full rounded border border-outline-variant pl-10 pr-3 py-2.5 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <label className="block font-label-bold text-label-bold text-on-surface mb-1">Password</label>
        <div className="relative mb-xl">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            lock
          </span>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-outline-variant pl-10 pr-10 py-2.5 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline"
            tabIndex={-1}
          >
            <span className="material-symbols-outlined text-lg">
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-container text-on-primary rounded py-2.5 font-label-bold text-label-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-xs text-on-surface-variant text-center mt-lg">
          Secure environment for authorized personnel only.
        </p>
      </form>
    </div>
  );
}
