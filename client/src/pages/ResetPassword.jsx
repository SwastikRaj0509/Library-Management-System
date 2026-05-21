import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import API from "../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await API.get(`/auth/verify-token/${token}`);
        setTokenValid(true);
        setLoading(false);
      } catch (error) {
        setTokenValid(false);
        setMessage("Invalid or expired reset link. Please request a new one.");
        setLoading(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setLoading(false);
      setMessage("No reset token provided.");
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password.trim()) {
      setMessage("Password cannot be empty");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const res = await API.post("/auth/reset-password", {
        token,
        password: formData.password
      });

      setSuccess(true);
      setMessage(res.data.message || "Password reset successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setSuccess(false);
      setMessage(
        error.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="
        min-h-screen
        bg-[#030712]
        flex
        items-center
        justify-center
        overflow-hidden
        relative
      ">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      bg-[#030712]
      flex
      items-center
      justify-center
      overflow-hidden
      relative
      px-6
    ">
      {/* Background Glow */}
      <div className="
        absolute
        w-[500px]
        h-[500px]
        bg-cyan-500/20
        blur-3xl
        rounded-full
        top-[-150px]
        left-[-150px]
      " />

      <div className="
        absolute
        w-[500px]
        h-[500px]
        bg-purple-600/20
        blur-3xl
        rounded-full
        bottom-[-150px]
        right-[-150px]
      " />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          relative
          z-10
          w-full
          max-w-md
          bg-white/5
          backdrop-blur-2xl
          border
          border-white/10
          rounded-[32px]
          p-10
          shadow-[0_0_40px_rgba(0,255,255,0.08)]
        "
      >
        <div className="text-center mb-10">
          <h1 className="
            text-4xl
            font-bold
            bg-gradient-to-r
            from-cyan-400
            to-purple-500
            text-transparent
            bg-clip-text
            mb-3
          ">
            New Password
          </h1>
          <p className="text-white/60 text-sm">
            Enter your new password below
          </p>
        </div>

        {message && (
          <div className={`
            mb-6
            p-4
            rounded-lg
            text-sm
            ${success 
              ? 'bg-green-500/20 border border-green-500/50 text-green-300' 
              : 'bg-red-500/20 border border-red-500/50 text-red-300'
            }
          `}>
            {message}
          </div>
        )}

        {tokenValid && !success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password */}
            <div>
              <label className="
                block
                text-white/80
                text-sm
                mb-3
                font-medium
              ">
                New Password
              </label>
              <div className="relative">
                <Lock className="
                  absolute
                  left-4
                  top-1/2
                  transform
                  -translate-y-1/2
                  w-5
                  h-5
                  text-cyan-400
                " />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="
                    w-full
                    bg-white/5
                    border
                    border-white/10
                    rounded-lg
                    py-3
                    px-4
                    pl-12
                    pr-12
                    text-white
                    placeholder-white/40
                    focus:outline-none
                    focus:border-cyan-400/50
                    focus:bg-white/10
                    transition
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    transform
                    -translate-y-1/2
                    text-white/60
                    hover:text-white/80
                  "
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="
                block
                text-white/80
                text-sm
                mb-3
                font-medium
              ">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="
                  absolute
                  left-4
                  top-1/2
                  transform
                  -translate-y-1/2
                  w-5
                  h-5
                  text-cyan-400
                " />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="
                    w-full
                    bg-white/5
                    border
                    border-white/10
                    rounded-lg
                    py-3
                    px-4
                    pl-12
                    pr-12
                    text-white
                    placeholder-white/40
                    focus:outline-none
                    focus:border-cyan-400/50
                    focus:bg-white/10
                    transition
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    transform
                    -translate-y-1/2
                    text-white/60
                    hover:text-white/80
                  "
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="
                w-full
                bg-gradient-to-r
                from-cyan-500
                to-purple-500
                hover:from-cyan-600
                hover:to-purple-600
                text-white
                font-bold
                py-3
                rounded-lg
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </motion.button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="text-6xl">❌</div>
            <p className="text-white/80">{message}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/forgot-password")}
              className="
                w-full
                bg-gradient-to-r
                from-cyan-500
                to-purple-500
                hover:from-cyan-600
                hover:to-purple-600
                text-white
                font-bold
                py-3
                rounded-lg
                transition
              "
            >
              Request New Link
            </motion.button>
          </div>
        )}

        {tokenValid && (
          <div className="
            mt-8
            pt-6
            border-t
            border-white/10
            text-center
          ">
            <Link
              to="/login"
              className="
                text-white/60
                hover:text-cyan-400
                transition
                flex
                items-center
                justify-center
                gap-2
                text-sm
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
