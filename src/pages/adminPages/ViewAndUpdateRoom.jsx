import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useHandleApiError from "../../hooks/useHandleApiError";
import { TextField } from "@mui/material";
import { TagsInput } from "react-tag-input-component";
import { toast } from "react-toastify";
import { baseUrl } from "../../lib/utils";
import axios from "axios";
import "../../assets/styles/adminStyles/viewUpdateRoom.css";

const ViewAndUpdateRoom = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const { state } = useLocation();

  const { roomId } = useParams();
  const roomData = state.roomData;
  const hotelId = state.hotelId;
  const { token } = useSelector((state) => state.user);
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [roomNumberErr, setRoomNumberErr] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isInUpdateMode, setIsInUpdateMode] = useState(false);

  const handleApiError = useHandleApiError();

  // preparing the room numbers for the first render
  useEffect(() => {
    const roomNumbers = roomData?.roomNumbers.map((room) => {
      return room.number.toString();
    });

    setRoomNumbers(roomNumbers);
  }, []);

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
    const finalRoomNumbers = roomNumbers?.map((roomStr) => {
      const rNumber = parseInt(roomStr);
      return {
        number: rNumber,
        unavailableDates: [],
      };
    });
    return finalRoomNumbers;
  };

  // ------- handle creating room ------
  const vuRoomUpdateHandler = async (updatedRoomData) => {
    const finalRoomNumbers = finalizeRoomNumbers();
    if (finalRoomNumbers.length < 1) {
      setRoomNumberErr(true);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${baseUrl}/rooms/update/${roomId}`,
        { ...updatedRoomData, roomNumbers: finalRoomNumbers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);

      toast.success("Room Updated Successfully");
      navigate("/admin");
    } catch (error) {
      handleApiError(error);
      setLoading(false);
    }
  };

  // ------ delete room --------
  const deleteRoom = async () => {
    if (!confirm("Do you really want to delete this room?")) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${baseUrl}/rooms/delete/${roomId}/${hotelId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      toast.success(data?.message);
      navigate("/admin");
    } catch (error) {
      handleApiError(error);
      setLoading(false);
    }
  };

  // ------- return the jsx ---------
  return (
    <div className="vuRoom">
      <div className="vuRoomContainer">
        <div className="vuRoomBtnsContainer">
          <button onClick={() => setIsInUpdateMode(!isInUpdateMode)}>
            <i className="fa-solid fa-repeat"></i>{" "}
            {isInUpdateMode ? "Switch to View Mode" : "Switch to Update Mode"}
          </button>
          {hotelId && (
            <button disabled={loading} onClick={deleteRoom}>
              <i className="fa-regular fa-trash-can"></i> Delete Room
            </button>
          )}
        </div>
        <form
          className="vuRoomForm"
          onSubmit={handleSubmit(vuRoomUpdateHandler)}
        >
          {/* ------ room title ------ */}

          <Controller
            name="title"
            control={control}
            defaultValue={roomData?.title}
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
                disabled={!isInUpdateMode}
              />
            )}
          />

          {/* ------ Cheapest Price ---- */}
          <Controller
            name="price"
            control={control}
            defaultValue={roomData?.price}
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
                disabled={!isInUpdateMode}
              />
            )}
          />

          {/* ------ Maximum People------ */}

          <Controller
            name="maxPeople"
            control={control}
            defaultValue={roomData?.maxPeople}
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
                disabled={!isInUpdateMode}
              />
            )}
          />

          {/* ------ hotel description ------ */}
          <Controller
            name="desc"
            control={control}
            defaultValue={roomData?.desc}
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
                disabled={!isInUpdateMode}
              />
            )}
          />

          <div>
            <TagsInput
              value={roomNumbers}
              onChange={handleAddition}
              name="roomNumbers"
              placeHolder={
                isInUpdateMode ? "Enter Room Numbers" : "Room Numbers"
              }
              classNames={{
                tag: "rntag",
                input: "rninput",
              }}
              disabled={!isInUpdateMode}
            />
            {roomNumberErr && (
              <p className="roomNumberErr">Room numbers are required</p>
            )}
          </div>

          {isInUpdateMode && (
            <button disabled={loading} className="submitBtn" type="submit">
              Update
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ViewAndUpdateRoom;
