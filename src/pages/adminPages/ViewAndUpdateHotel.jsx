import { useState } from "react";
import "../../assets/styles/adminStyles/viewUpdateHotel.css";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  ImageList,
  ImageListItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import useHandleApiError from "../../hooks/useHandleApiError";
import { baseUrl, cloud_name, folder, upload_preset } from "../../lib/utils";
import axios from "axios";
import { toast } from "react-toastify";

const ViewAndUpdateHotel = () => {
  const { token } = useSelector((state) => state.user);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const [loading, setLoading] = useState(false);
  const [isInUpdateMode, setIsInUpdateMode] = useState(false);
  const { state } = useLocation();
  const hotelData = state.hotelData;
  const [images, setImages] = useState([]);
  const [photoUrls, setPhotoUrls] = useState(hotelData.photos);
  const handleApiError = useHandleApiError();
  const navigate = useNavigate();
  // handle the images right after the selection
  const handleImageUpload = (e) => {
    const files = [...e.target.files];

    let urls = [];
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const imgUrl = URL.createObjectURL(files[i]);
        files[i].imageUrl = imgUrl;
        urls.push(imgUrl);
      }
    }

    setImages(files);
    setPhotoUrls([...photoUrls, ...urls]);
  };

  // handle the hotel update
  const handleUpdateHotel = async (updatedData) => {
    setLoading(true);
    try {
      const newlyUploadedImagesLength = images.length;
      let newPhotoUrls;

      if (newlyUploadedImagesLength > 0) {
        newPhotoUrls = photoUrls?.filter((url) => {
          if (url.startsWith("blob:http:")) {
            return false;
          } else {
            return true;
          }
        });

        for (let i = 0; i < newlyUploadedImagesLength; i++) {
          const imgData = new FormData();
          imgData.append("file", images[i]);
          imgData.append("upload_preset", upload_preset);
          imgData.append("folder", folder);

          try {
            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
              imgData
            );

            newPhotoUrls.push(response?.data?.secure_url);
          } catch (error) {
            handleApiError(error);
          }
        }
      }

      const photos = newPhotoUrls?.length > 0 ? newPhotoUrls : photoUrls;

      const updatedHotelResponse = await axios.put(
        `${baseUrl}/hotels/update/${hotelData?._id}`,
        { photos, ...updatedData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      //console.log(updatedHotelResponse.data);

      setLoading(false);

      toast.success("Hotel Update Successful");
      navigate("/admin");
    } catch (error) {
      handleApiError(error);
      setLoading(false);
    }
  };

  // remove photo from the photoUrls
  const removePhotoUrl = (url) => {
    const newImages = images?.filter((file) => file.imageUrl !== url);
    setImages(newImages);
    const newUrls = photoUrls.filter((photoUrl) => photoUrl !== url);
    setPhotoUrls(newUrls);
  };

  // delete this hotel
  const deleteHotel = async (_id) => {
    if (!confirm("Do you really want to delete this hotel?")) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.delete(`${baseUrl}/hotels/delete/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);
      toast.success(data?.message);
      navigate("/admin");
    } catch (error) {
      handleApiError(error);
      setLoading(false);
    }
  };

  // ------------ return the jsx -------------
  return (
    <>
      <div className="vuHotel">
        <div className="vuHotelContainer">
          <div className="btnContainer">
            <button
              className="isUpdateModeBtn"
              onClick={() => setIsInUpdateMode(!isInUpdateMode)}
            >
              <i className="fa-solid fa-repeat"></i>
              {!isInUpdateMode
                ? "Switch to Update Mode"
                : "Switch to View Mode"}
            </button>
            <button
              onClick={() =>
                navigate(`/admin/hotel/${hotelData?._id}/create-room`)
              }
              className="createRoomBtn"
            >
              <i className="fa-solid fa-plus"></i>
              Create Room
            </button>
            <button
              onClick={() =>
                navigate(`/admin/hotel/${hotelData?._id}/rooms`, {
                  state: { hotelData },
                })
              }
            >
              <i className="fa-solid fa-house"></i>Rooms
            </button>
            <button onClick={() => deleteHotel(hotelData?._id)}>
              <i className="fa-regular fa-trash-can"></i> Delete Hotel
            </button>
          </div>
          <form
            onSubmit={handleSubmit(handleUpdateHotel)}
            className="vuHotelForm"
          >
            <div className="formContainer">
              <div className="formPartOne">
                {/* ------ hotel name ------ */}
                <Controller
                  name="name"
                  control={control}
                  defaultValue={hotelData?.name}
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
                      disabled={!isInUpdateMode}
                    />
                  )}
                />

                {/* ------ hotel type ------ */}

                <Controller
                  name="type"
                  control={control}
                  defaultValue={hotelData?.type}
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
                      disabled={!isInUpdateMode}
                    />
                  )}
                />

                {/* ------ hotel city ------ */}

                <Controller
                  name="city"
                  control={control}
                  defaultValue={hotelData?.city}
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
                      disabled={!isInUpdateMode}
                    />
                  )}
                />

                {/* ------ hotel address ------ */}

                <Controller
                  name="address"
                  control={control}
                  defaultValue={hotelData?.address}
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
                      disabled={!isInUpdateMode}
                    />
                  )}
                />

                {/* ------ Distance from the city center ------ */}

                <Controller
                  name="distance"
                  control={control}
                  defaultValue={hotelData?.distance}
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
                      disabled={!isInUpdateMode}
                      error={!!errors.distance}
                      helperText={
                        errors.distance ? errors.distance.message : ""
                      }
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
                  defaultValue={hotelData?.title}
                  rules={{ required: "Title of the hotel is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Title"
                      variant="outlined"
                      fullWidth
                      disabled={!isInUpdateMode}
                      className="inputField"
                      error={!!errors.title}
                      helperText={errors.title ? errors.title.message : ""}
                    />
                  )}
                />
              </div>

              <div className="formPartTwo">
                {/* ------ hotel description ------ */}
                <Controller
                  name="desc"
                  control={control}
                  defaultValue={hotelData?.desc}
                  rules={{ required: "Description of the hotel is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Hotel Description"
                      variant="outlined"
                      fullWidth
                      multiline
                      disabled={!isInUpdateMode}
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
                  defaultValue={hotelData?.rating}
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
                      disabled={!isInUpdateMode}
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
                  defaultValue={hotelData?.cheapestPrice}
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
                      disabled={!isInUpdateMode}
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
                    defaultValue={hotelData?.featured}
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
                          disabled={!isInUpdateMode}
                        />
                        <FormControlLabel
                          className="featuredRadioLabel"
                          value={false}
                          control={<Radio className="featuredRadioOption" />}
                          label="No"
                          disabled={!isInUpdateMode}
                        />
                      </RadioGroup>
                    )}
                  />
                </FormControl>

                {/* upload hotel images */}

                <div className="imgUpload">
                  {isInUpdateMode ? (
                    <>
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
                          disabled={!isInUpdateMode}
                        />
                      </span>

                      {photoUrls.length > 0 && (
                        <Box className="imageList" sx={{ overflowY: "scroll" }}>
                          <ImageList variant="masonry" cols={3} gap={8}>
                            {photoUrls?.map((item) => (
                              <ImageListItem
                                sx={{ position: "relative" }}
                                key={Math.random()}
                              >
                                <img
                                  srcSet={`${item}`}
                                  src={`${item}`}
                                  alt={item.title}
                                  loading="lazy"
                                />
                                <i
                                  onClick={() => removePhotoUrl(item)}
                                  className="fa-solid fa-xmark"
                                ></i>
                              </ImageListItem>
                            ))}
                          </ImageList>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Box className="imageList" sx={{ overflowY: "scroll" }}>
                      <ImageList variant="masonry" cols={3} gap={8}>
                        {photoUrls?.map((item) => (
                          <ImageListItem key={Math.random()}>
                            <img
                              srcSet={`${item}`}
                              src={`${item}`}
                              alt={item.title}
                              loading="lazy"
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )}
                </div>
              </div>
            </div>
            {isInUpdateMode ? (
              <button className="submitButton" disabled={loading} type="submit">
                Update
              </button>
            ) : null}
          </form>
        </div>
      </div>
    </>
  );
};

export default ViewAndUpdateHotel;
