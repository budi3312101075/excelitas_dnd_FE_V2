import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUser } from "react-icons/fa";
import { AiFillEyeInvisible } from "react-icons/ai";
import { IoEyeSharp } from "react-icons/io5";
import { TbPassword } from "react-icons/tb";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import Ballpit from "../../components/atoms/ballpit";
import SplitText from "../../components/atoms/splitText";

const Login = () => {
  const { register, handleSubmit, formState } = useForm();
  const { setLoginResponse } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`/login`, data);
      if (response.data !== undefined && response.status === 200) {
        const userData = await response.data;
        setLoginResponse(userData.data);
        navigate("/");
        toast.success(`Welcome! 🎉`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="flex justify-center items-center p-10">
        <div
          className="w-full max-w-lg bg-white rounded-2xl p-8"
          style={{ boxShadow: "4px 4px 40px 5px rgba(0, 0, 0, 0.15)" }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Login
          </h2>
          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            {/* Username Field */}
            <div>
              {formState.errors.username && (
                <span className="text-red-600 text-sm block mb-1">
                  Hanya huruf dan angka yang diperbolehkan untuk Username
                </span>
              )}
              <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <FaUser className="text-gray-500" />
                <input
                  type="text"
                  {...register("username", {
                    required: true,
                    maxLength: 75,
                    pattern: /^[A-Za-z0-9]+$/i,
                  })}
                  placeholder="Username"
                  className="w-full rounded-xl border-none bg-transparent focus:border-none focus-within:ring-0 tracking-wider" // Tambahkan focus:outline-none
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              {formState.errors.password && (
                <span className="text-red-600 text-sm block mb-1">
                  Password harus diisi.
                </span>
              )}
              <div className="flex items-center bg-gray-100 border  border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <TbPassword className="text-gray-500" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="Password"
                  className="w-full rounded-xl border-none bg-transparent focus:border-none focus-within:ring-0 tracking-wider" // Tambahkan focus:outline-none
                />
                {showPassword ? (
                  <AiFillEyeInvisible
                    size={20}
                    className="cursor-pointer text-gray-500"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <IoEyeSharp
                    size={20}
                    className="cursor-pointer text-gray-500"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            </div>

            <button className="w-full bg-[#8b5cf6] text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200">
              Login
            </button>
          </form>
        </div>
      </div>

      <div className="relative w-full h-screen flex items-center justify-center">
        <SplitText
          text="Wellcome To Excelitas!"
          className="absolute text-center text-white text-5xl font-bold z-10 w-[600px]"
          delay={150}
          animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
          animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-50px"
        />
        <Ballpit
          className="w-full h-full  bg-[#8b5cf6]"
          count={75}
          gravity={1}
          friction={0.8}
          wallBounce={1}
          followCursor={true}
          colors={[255, 190, 50]}
        />
      </div>
    </div>
  );
};

export default Login;
