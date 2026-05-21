import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

import API from "../services/api";

const Login = () => {

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if(token){

      navigate("/dashboard");
    }

  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post(
        "/auth/login",
        formData
      );

      console.log(res.data);

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      alert("Login Successful 🚀");

      navigate("/dashboard");

    } catch(error){

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    } finally {

      setLoading(false);
    }
  };

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

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
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
            text-5xl
            font-bold
            bg-gradient-to-r
            from-cyan-400
            to-purple-500
            text-transparent
            bg-clip-text
            mb-3
          ">
            AI Library
          </h1>

          <p className="text-gray-400">
            Welcome back
          </p>

        </div>

        <div className="space-y-5">

          {/* Email */}
          <div className="relative">

            <Mail
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
              size={20}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="
                w-full
                pl-12
                p-4
                rounded-2xl
                bg-white/5
                border
                border-white/10
                text-white
                placeholder-gray-500
                outline-none
                focus:border-cyan-400
                transition-all
              "
            />

          </div>

          {/* Password */}
          <div className="relative">

            <Lock
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
              size={20}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="
                w-full
                pl-12
                p-4
                rounded-2xl
                bg-white/5
                border
                border-white/10
                text-white
                placeholder-gray-500
                outline-none
                focus:border-cyan-400
                transition-all
              "
            />

          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="
                text-cyan-400
                hover:text-cyan-300
                text-sm
                transition-colors
              "
            >
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            className="
              w-full
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-purple-600
              text-white
              font-semibold
              text-lg
              hover:scale-[1.02]
              transition-all
              shadow-lg
              shadow-cyan-500/20
            "
          >

            {
              loading
              ? "Signing In..."
              : "Login"
            }

          </button>

        </div>

        <div className="
          mt-8
          text-center
          text-gray-400
        ">

          Don't have an account?

          <Link
            to="/register"
            className="
              text-cyan-400
              hover:text-cyan-300
              ml-2
            "
          >
            Register
          </Link>

        </div>

      </motion.form>

    </div>
  );
};

export default Login;