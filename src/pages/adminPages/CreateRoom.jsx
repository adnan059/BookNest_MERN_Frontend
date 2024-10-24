import { Controller, useForm } from "react-hook-form";
import "../../assets/styles/adminStyles/createRoom.css";
import useHandleApiError from "../../hooks/useHandleApiError";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { TextField } from "@mui/material";
import { TagsInput } from "react-tag-input-component";
import axios from "axios";
import { baseUrl } from "./../../lib/utils";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CreateRoom = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: "onTouched" });
  const { hotelId } = useParams();
  const { token } = useSelector((state) => state.user);
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [roomNumberErr, setRoomNumberErr] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleApiError = useHandleApiError();

  // handling the addition of new room number
  const handleAddition = (newTags) => {
    setRoomNumberErr(false);
    const validTags = newTags.filter((tag) => !isNaN(tag));

    if (validTags.length < newTags.length) {
      alert("Only numeric value is allowed");
    }

    setRoomNumbers(validTags);
  };

  //  finalize the room numbers for the http requst
  const finalizeRoomNumbers = () => {
    if (roomNumbers.length < 1) {
      return setRoomNumberErr(true);
    }

    const finalRoomNumbers = roomNumbers.map((roomStr) => {
      const rNumber = parseInt(roomStr);
      return {
        number: rNumber,
        unavailableDates: [],
      };
    });
    return finalRoomNumbers;
  };

  // handle creating room
  const createRoomHandler = async (roomData) => {
    console.log({ ...roomData, roomNumbers: finalizeRoomNumbers() });
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${baseUrl}/rooms/create-room/${hotelId}`,
        { ...roomData, roomNumbers: finalizeRoomNumbers() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      toast.success("Room created successfully");
      navigate("/admin");
      console.log(data);
    } catch (error) {
      console.log(error);
      handleApiError(error);
      setLoading(false);
    }
  };

  // return the jsx
  return (
    <div className="createRoom">
      <div className="createRoomContainer">
        <h2>Create Room</h2>
        <form
          className="createRoomForm"
          onSubmit={handleSubmit(createRoomHandler)}
        >
          {/* ------ room title ------ */}

          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: "Title of the room is required" }}
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

          {/* ------ Cheapest Price ---- */}
          <Controller
            name="price"
            control={control}
            defaultValue=""
            rules={{
              required: "Price is required. Enter a Number",
              validate: (value) =>
                value > 5 || "Value must be an integer greater than 5",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price ($)"
                variant="outlined"
                fullWidth
                type="number"
                error={!!errors.price}
                helperText={errors.price ? errors.price.message : ""}
                inputProps={{
                  min: 6,
                }}
                onChange={(e) => {
                  field.onChange(parseInt(e.target.value, 10));
                }}
                className="inputField"
              />
            )}
          />

          {/* ------ Maximum People------ */}

          <Controller
            name="maxPeople"
            control={control}
            defaultValue=""
            rules={{
              required: "Number of maximum people is required",
              pattern: {
                value: /^[0-4]$/,
                message: "Maximum people number must be between 0 and 4",
              },
              validate: (value) =>
                (value >= 0 && value <= 4) ||
                "Number of maximum people must be between 0 and 4",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Maximum People (0-4)"
                variant="outlined"
                fullWidth
                type="number"
                error={!!errors.maxPeople}
                helperText={errors.maxPeople ? errors.maxPeople.message : ""}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-4]*",
                  min: 0,
                  max: 4,
                }}
                onChange={(e) => {
                  field.onChange(parseInt(e.target.value, 10));
                }}
                className="inputField"
              />
            )}
          />

          {/* ------ hotel description ------ */}
          <Controller
            name="desc"
            control={control}
            defaultValue=""
            rules={{ required: "Description of the room is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Room Description"
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

          <div>
            <TagsInput
              value={roomNumbers}
              onChange={handleAddition}
              name="roomNumbers"
              placeHolder="Enter room numbers"
              classNames={{
                tag: "rntag",
                input: "rninput",
              }}
            />
            {roomNumberErr && <p>Room numbers are required</p>}
          </div>

          <button disabled={loading} className="submitBtn" type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
