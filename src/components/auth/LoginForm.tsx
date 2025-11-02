"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import api from "@/utils/api";
import InputField from "./InputField";
import Button from "./Button";
import { motion } from "framer-motion";

type FormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: {
    name: string;
    email: string;
    role: "owner" | "vendor";
  };
};

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError("");

    try {
      // ✅ call login endpoint
      const res = await api.post<LoginResponse>("/api/auth/login", data);
      const { token, user } = res.data;

      if (!user || !token) {
        setError("Invalid server response");
        return;
      }

      // ✅ Store login data
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);

      // ✅ Redirect by role
      if (user.role === "owner") router.push("/owner/dashboard");
      else if (user.role === "vendor") router.push("/vendor/dashboard");
      else setError("Unknown role");
    } catch (err: unknown) {
      // ✅ handle errors cleanly
      if (
        err &&
        typeof err === "object" &&
        "isAxiosError" in err &&
        (err as AxiosError).isAxiosError
      ) {
        const axiosErr = err as AxiosError<{ message: string }>;
        setError(axiosErr.response?.data?.message || "Login failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 w-96 shadow-xl"
    >
      <h2 className="text-2xl font-semibold text-white mb-2 text-center">
        Dloklz Management
      </h2>
      <p className="text-md text-white mb-6 text-center">
        Enter your credentials to login.
      </p>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          placeholder="Email"
          type="email"
          register={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Enter a valid email address",
            },
          })}
          required
        />
        {errors.email && (
          <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}

        <InputField
          placeholder="Password"
          type="password"
          register={register("password", { required: "Password is required" })}
          required
        />
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit">Login</Button>
      </form>
    </motion.div>
  );
}
