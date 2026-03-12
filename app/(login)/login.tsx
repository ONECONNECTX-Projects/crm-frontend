"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import InputField from "@/app/common/InputFeild";
import { LoginModel } from "./Model/model";
import { FiLock, FiUser } from "react-icons/fi";
import CommonButton from "@/app/common/button";
import { setAuthToken, api, isAuthenticated } from "@/app/utils/apiClient";
import { useError } from "@/app/providers/ErrorProvider";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useError();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<LoginModel>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
      return;
    }

    const error = searchParams.get("error");
    if (error === "session_expired") {
      showError("Your session has expired. Please login again.");
    } else if (error === "unauthorized") {
      showError("You need to login to access this page.");
    } else if (error) {
      showError("Authentication failed. Please login.");
    }
  }, [router, searchParams, showError]);

  // VALIDATE form
  const validateForm = () => {
    const newErrors: any = { email: "", password: "" };
    let isValid = true;

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post(
        "auth/login",
        {
          email: form.email,
          password: form.password,
        },
        { skipAuth: true },
      );

      if (response.token) {
        setAuthToken(response.token);
        showSuccess(response.message || "Login successful!");

        const redirectTo =
          sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectTo);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white ">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full m-8"
        onSubmit={handleSubmit}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/favicon.svg"
            alt="Company Logo"
            width={120}
            height={120}
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          Welcome Back
        </h1>

        <p className="text-gray-500 mt-1 mb-8 text-center">
          Enter your credentials to access your account
        </p>

        {/* Email */}
        <div className="mb-4">
          <InputField
            label="Email"
            type="email"
            noLeadingSpace={true}
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e })}
            error={errors.email}
            icon={<FiUser size={18} />}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <InputField
            label="Password"
            type="password"
            noLeadingSpace={true}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e })}
            error={errors.password}
            icon={<FiLock size={18} />}
          />
        </div>

        {/* Button */}
        <CommonButton type="submit" label="Sign In" isLoading={loading} />
      </form>
    </div>
  );
}
