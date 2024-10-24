import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/register.css";

// ---------------- city country phone import ----
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import axios from "axios";
import { baseUrl } from "./../lib/utils";
import { registerAction } from "../redux/userSlice";
import { toast } from "react-toastify";

// cloudinary constants
const upload_preset = import.meta.env.VITE_upload_preset;
const folder = import.meta.env.VITE_folder;
const cloud_name = import.meta.env.VITE_cloud_name;

// Register Component
const Register = () => {
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
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const [userImgUrl, setUserImgUrl] = useState("");

  // ------------- city country phone ... -----

  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);

  const [ccpi, setCcpi] = useState({
    country: "",
    city: "",
    phone: "",
    image: null,
  });

  // handle the registration process
  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      let uploadedImgUrl = userImgUrl;
      if (ccpi.image) {
        const imgData = new FormData();
        imgData.append(
          "file",
          ccpi.image,
          `${ccpi.image.name.slice(0, 10)}_${Date.now()}`
        );
        imgData.append("upload_preset", upload_preset);
        imgData.append("folder", folder);

        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          imgData
        );

        uploadedImgUrl = cloudinaryResponse.data.secure_url;
      }

      const userInfo = {
        ...formData,
        city: ccpi.city,
        country: ccpi.country,
        userImgUrl: uploadedImgUrl,
        phone: ccpi.phone,
      };

      const response = await axios.post(`${baseUrl}/auth/register`, userInfo);

      const { token, ...others } = response.data;

      dispatch(registerAction({ token, others }));

      toast.success(`Registration Successful! Welcome ${others.username}`);

      navigate("/");

      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="regFormContainer">
        <h3>Register Form</h3>
        <form onSubmit={handleSubmit(handleRegister)} className="regForm">
          <input
            type="text"
            name="username"
            placeholder="Enter Your Username *"
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
            name="email"
            placeholder="Enter Your Email *"
            {...register("email", {
              required: "Email is required",

              pattern: {
                value:
                  /^[a-zA-Z0-9]+([-_.]?[a-zA-Z0-9]+[_]?){1,}@([a-zA-Z0-9]{2,}\.){1,}[a-zA-Z]{2,4}$/,
                message: "This is not a valid email address",
              },
            })}
            data-error={Boolean(errors?.email?.message)}
          />

          {errors?.email?.message && (
            <p className="error-msg">{errors.email.message}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Enter Your Password *"
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

          <CountrySelect
            onChange={(e) => {
              setCountryid(e.id);
              setCcpi({ ...ccpi, country: e.name });
            }}
            placeHolder="Select Your Country *"
            required
          />

          <StateSelect
            countryid={countryid}
            onChange={(e) => {
              setstateid(e.id);
            }}
            placeHolder="Select Your State *"
          />

          <CitySelect
            countryid={countryid}
            stateid={stateid}
            onChange={(e) => {
              setCcpi({ ...ccpi, city: e.name });
            }}
            placeHolder="Select Your City *"
            required
          />

          <PhoneInput
            placeholder="Enter Phone Number *"
            value={ccpi.phone}
            onChange={(newValue) => {
              setCcpi({ ...ccpi, phone: newValue });
            }}
            defaultCountry="US"
          />

          <div className="userImgUpload">
            <label htmlFor="userImg">
              <i className="fa-solid fa-arrow-up-from-bracket"></i>
              Upload Your Image
            </label>
            <input
              style={{ display: "none" }}
              id="userImg"
              type="file"
              name="userImg"
              accept="image/*"
              onChange={(e) => setCcpi({ ...ccpi, image: e.target.files[0] })}
            />

            {ccpi.image && (
              <img
                className="previewImg"
                src={URL.createObjectURL(ccpi.image)}
              />
            )}
          </div>

          <button type="submit" className="reg-btn" disabled={loading}>
            Register
          </button>
        </form>
        <p>Fields marked with * are required</p>
        <p>
          Already have an account?{" "}
          <Link to="/login" className="" disabled={loading}>
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
