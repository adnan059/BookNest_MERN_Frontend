import "../../assets/styles/adminStyles/createHotel.css";
import { Controller, useForm } from "react-hook-form";

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";

import { baseUrl, cloud_name, folder, upload_preset } from "./../../lib/utils";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useHandleApiError from "./../../hooks/useHandleApiError";

// ---------- create hotel component --------------
const CreateHotel = () => {
  const { token } = useSelector((state) => state.user);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: "onTouched" });
  const [images, setImages] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleApiError = useHandleApiError();

  // handle images when selecting
  const handleImageUpload = (e) => {
    const files = [...e.target.files];
    setImages(files);
    if (files && files.length > 0) {
      const imgUrl = URL.createObjectURL(files[0]);
      setPreviewImg(imgUrl);
    } else {
      setPreviewImg(null);
    }
  };

  const handleCreateHotel = async (hotelData) => {
    setLoading(true);
    try {
      const photos = [];

      const numberOfImages = images.length;

      if (numberOfImages > 0) {
        for (let i = 0; i < numberOfImages; i++) {
          const imgData = new FormData();
          imgData.append("file", images[i]);
          imgData.append("upload_preset", upload_preset);
          imgData.append("folder", folder);

          try {
            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
              imgData
            );
            photos.push(response?.data.secure_url);
          } catch (error) {
            handleApiError(error);
          }
        }
      }

      const { data } = await axios.post(
        `${baseUrl}/hotels/create-hotel`,
        { ...hotelData, photos },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("New hotel created successfully");
      setLoading(false);

      navigate("/admin");
    } catch (error) {
      handleApiError(error);
      setLoading(false);
    }
  };

  return (
    <div className="createHotel">
      <div className="createHotelContainer">
        <h2>Create Hotel</h2>

        <form
          onSubmit={handleSubmit(handleCreateHotel)}
          className="createHotelForm"
        >
          <div className="formContainer">
            <div className="formPartOne">
              {/* ------ hotel name ------ */}
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Hotel Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Hotel Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ""}
                    className="inputField"
                  />
                )}
              />

              {/* ------ hotel type ------ */}

              <Controller
                name="type"
                control={control}
                defaultValue=""
                rules={{ required: "Hotel type is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Hotel Type"
                    variant="outlined"
                    fullWidth
                    error={!!errors.type}
                    helperText={errors.type ? errors.type.message : ""}
                    className="inputField"
                  />
                )}
              />

              {/* ------ hotel city ------ */}

              <Controller
                name="city"
                control={control}
                defaultValue=""
                rules={{ required: "City of the hotel is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="City"
                    variant="outlined"
                    fullWidth
                    error={!!errors.city}
                    helperText={errors.city ? errors.city.message : ""}
                    className="inputField"
                    onChange={(e) => {
                      field.onChange(e.target.value.toLowerCase());
                    }}
                  />
                )}
              />

              {/* ------ hotel address ------ */}

              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{ required: "Address of the hotel is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    variant="outlined"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address ? errors.address.message : ""}
                    className="inputField"
                  />
                )}
              />

              {/* ------ Distance from the city center ------ */}

              <Controller
                name="distance"
                control={control}
                defaultValue=""
                rules={{
                  required: "Distance from the city center is required",
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Only numbers are allowed",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Distance from the city center in km"
                    variant="outlined"
                    fullWidth
                    error={!!errors.distance}
                    helperText={errors.distance ? errors.distance.message : ""}
                    className="inputField"
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.value.toString());
                    }}
                  />
                )}
              />

              {/* ------ hotel title ------ */}

              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: "Title of the hotel is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    variant="outlined"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title ? errors.title.message : ""}
                    className="inputField"
                  />
                )}
              />
            </div>

            <div className="formPartTwo">
              {/* ------ hotel description ------ */}
              <Controller
                name="desc"
                control={control}
                defaultValue=""
                rules={{ required: "Description of the hotel is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Hotel Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.desc}
                    helperText={errors.desc ? errors.desc.message : ""}
                    className="inputField"
                  />
                )}
              />

              {/* ------ hotel rating------ */}

              <Controller
                name="rating"
                control={control}
                defaultValue=""
                rules={{
                  required: "Rating is required",
                  pattern: {
                    value: /^[0-5]$/,
                    message: "Rating must be a number between 0 and 5",
                  },
                  validate: (value) =>
                    (value >= 0 && value <= 5) ||
                    "Rating must be between 0 and 5",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Rating (0-5)"
                    variant="outlined"
                    fullWidth
                    type="number"
                    error={!!errors.rating}
                    helperText={errors.rating ? errors.rating.message : ""}
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-5]*",
                      min: 0,
                      max: 5,
                    }}
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value, 10)); // Stores the value as a number
                    }}
                    className="inputField"
                  />
                )}
              />

              {/* ------ Cheapest Price ---- */}
              <Controller
                name="cheapestPrice"
                control={control}
                defaultValue=""
                rules={{
                  required: "Cheapest price is required. Enter a Number",
                  validate: (value) =>
                    value > 10 || "Value must be an integer greater than 10",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cheapest Price ($)"
                    variant="outlined"
                    fullWidth
                    type="number"
                    error={!!errors.cheapestPrice}
                    helperText={
                      errors.cheapestPrice ? errors.cheapestPrice.message : ""
                    }
                    inputProps={{
                      min: 11,
                    }}
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value, 10));
                    }}
                    className="inputField"
                  />
                )}
              />

              {/* ------ is Featured---- */}

              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Is it a featured hotel?
                </FormLabel>
                <Controller
                  name="featured"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value === "true")
                      }
                      row
                    >
                      <FormControlLabel
                        className="featuredRadioLabel"
                        value={true}
                        control={<Radio className="featuredRadioOption" />}
                        label="Yes"
                      />
                      <FormControlLabel
                        className="featuredRadioLabel"
                        value={false}
                        control={<Radio className="featuredRadioOption" />}
                        label="No"
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>

              {/* upload hotel images */}

              <div className="imgUpload">
                <span>
                  <i className="fa-solid fa-arrow-up-from-bracket"></i>
                  <label htmlFor="hotelImgs">Upload Hotel Images</label>
                  <input
                    type="file"
                    name="hotelImgs"
                    id="hotelImgs"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageUpload}
                    multiple
                  />
                </span>
                {previewImg && (
                  <span className="previewImg">
                    <img src={previewImg} alt="" />
                  </span>
                )}
              </div>
            </div>
          </div>
          <button disabled={loading} type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateHotel;
