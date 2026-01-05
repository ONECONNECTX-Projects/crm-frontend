"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/app/common/InputFeild";
import { LoginModel } from "./Model/model";
import { FiLock, FiUser } from "react-icons/fi";
import CommonButton from "@/app/common/button";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<LoginModel>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // VALIDATE form
  const validateForm = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = { email: "", password: "" };
    let isValid = true;

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white ">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full m-8"
        onSubmit={handleSubmit}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-500 mt-1 mb-8">
          Enter your credentials to access your account
        </p>
        <div className="mb-4">
          <InputField
            label="Email"
            type="email"
            noLeadingSpace={true}
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            icon={<FiUser size={18} />}
          />
        </div>
        <div className="mb-4">
          <InputField
            label="Password"
            type="password"
            noLeadingSpace={true}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            icon={<FiLock size={18} />}
          />
        </div>
        <CommonButton type="submit" label="Sign In" isLoading={loading} />
      </form>
    </div>
  );
}
