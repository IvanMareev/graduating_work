"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

import { useRouter } from "next/navigation"; 
import { LoginFormData } from "@/app/types/Auth";
import signinServices from "@/app/services/signinServices";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});



const LoginPage = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    let status = await signinServices(data);
    if(status == 200) {
      alert("Login successful!");
      router.push('/PersonalPage');
    } else {
      setServerError(status)
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
export default LoginPage;
