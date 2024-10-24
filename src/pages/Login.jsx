import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../assets/styles/login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { baseUrl } from "./../lib/utils";
import { loginAction } from "../redux/userSlice";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",

      password: "",
    },
    mode: "onTouched",
  });

  // handle the login form
  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${baseUrl}/auth/login`, formData);
      const { token, ...others } = data;

      dispatch(loginAction({ token, others }));

      navigate("/");

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="loginFormContainer">
        <h3>Login Form</h3>
        <form onSubmit={handleSubmit(handleLogin)} className="loginForm">
          <input
            type="text"
            name="username"
            placeholder="Enter Your Username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 2,
                message: "Not less than 2 characters is allowed",
              },
              maxLength: {
                value: 40,
                message: "Not more than 40 characters is allowed",
              },
            })}
            data-error={Boolean(errors?.username?.message)}
          />
          {errors?.username?.message && (
            <p className="error-msg">{errors.username.message}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value:
                  /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                message:
                  "Min 8 Chars: upperCase, lowerCase, number/special Char ",
              },
            })}
            data-error={Boolean(errors?.password?.message)}
          />
          {errors?.password?.message && (
            <p className="error-msg">{errors?.password?.message}</p>
          )}

          <button className="login-btn" disabled={loading}>
            Login
          </button>
        </form>
        <p>
          Don't have an account yet?{" "}
          <Link to="/register" className="" disabled={loading}>
            Register
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
