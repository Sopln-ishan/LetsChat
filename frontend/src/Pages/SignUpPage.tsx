import { useState } from "react";
import { Link } from "react-router";
import { ImSpinner8 } from "react-icons/im";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import useAuthStore from "../store/useAuthStore";

type FormInput = {
  fullName: string;
  email: string;
  password: string;
};

const SignUpPage = () => {
  const { signup, isSigningUp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormInput>({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormInput>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormInput> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      signup(formData);
    }
  };

  return (
    <div className="z-10 w-full max-w-md">
      {/* Card */}
      <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-black/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Join the conversation today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 pl-1">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={`w-full bg-slate-900/60 border rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 text-sm
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.fullName ? "border-red-500/50 focus:ring-red-500/40 focus:border-red-500/50" : "border-slate-600/50 focus:ring-cyan-500/40 focus:border-cyan-500/50"}`}
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-red-400 pl-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 pl-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full bg-slate-900/60 border rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 text-sm
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.email ? "border-red-500/50 focus:ring-red-500/40 focus:border-red-500/50" : "border-slate-600/50 focus:ring-cyan-500/40 focus:border-cyan-500/50"}`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 pl-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 pl-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full bg-slate-900/60 border rounded-xl py-3 pl-11 pr-11 text-white placeholder-slate-500 text-sm
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.password ? "border-red-500/50 focus:ring-red-500/40 focus:border-red-500/50" : "border-slate-600/50 focus:ring-cyan-500/40 focus:border-cyan-500/50"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? (
                  <FiEyeOff className="size-4" />
                ) : (
                  <FiEye className="size-4" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="text-xs text-red-400 pl-1">{errors.password}</p>
            ) : (
              <p className="text-xs text-slate-500 pl-1">
                Must be at least 6 characters
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
              text-white font-semibold py-3 rounded-xl
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30
              cursor-pointer"
          >
            {isSigningUp ? (
              <span className="flex items-center justify-center gap-2">
                <ImSpinner8 className="animate-spin size-4" />
                Creating account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
