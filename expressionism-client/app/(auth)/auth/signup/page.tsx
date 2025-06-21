"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useState } from "react";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

type RegisterFormData = {
  username: string;
  password: string;
};


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const RegisterPage = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try { 
      await axios.post(`${API_BASE_URL}/register`, data);
      alert("Registration successful!");
    } catch (error: any) {
      setServerError(error.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input {...register("username")} />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <div>
          <label>Password</label>
          <input type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        {serverError && <p style={{ color: "red" }}>{serverError}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
