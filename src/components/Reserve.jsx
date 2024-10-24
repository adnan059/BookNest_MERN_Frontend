import { useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import useFetch from "../hooks/useFetch";
import { baseUrl } from "../lib/utils";
import "../assets/styles/reserve.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../redux/userSlice.js";

const Reserve = ({ isModalOpen, setIsModalOpen, hotelId }) => {
  const { token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { searchQueries } = useSelector((state) => state.searchData);
  const { data } = useFetch(`${baseUrl}/rooms/roomsbyhotel/${hotelId}`);
  const startAndEndDateStr = searchQueries.dates[0];

  // getting all the dates the user wants to stay at the hotel
  const getDatesBetween = (startDateStr, endDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    const datesArray = [];

    let currendDate = new Date(start);

    while (currendDate <= end) {
      datesArray.push(currendDate.getTime());
      currendDate.setDate(currendDate.getDate() + 1);
    }

    return datesArray;
  };

  // all the dates the user wants to stay at the hotel
  const allDates = getDatesBetween(
    startAndEndDateStr.startDate,
    startAndEndDateStr.endDate
  );

  // checking if the room is available
  const isRoomBooked = (roomNumber) => {
    let isBooked;
    if (allDates.length < 2) {
      isBooked = true;
      return isBooked;
    }
    isBooked = roomNumber?.unavailableDates?.some((date) =>
      allDates.includes(new Date(date).getTime())
    );

    return isBooked;
  };

  // handling the selection of the room
  const handleSelectRoom = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;

    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((room) => room !== value)
    );
  };

  // handle the final reservation
  const handleReserve = async () => {
    if (!user) {
      toast.error("Please, log in first");
      navigate("/login");
      return;
    }
    if (allDates.length < 2) {
      toast.error("You have to stay at least 1 night.");
      return setIsModalOpen(false);
    }
    setLoading(true);
    try {
      const res = await Promise.all(
        selectedRooms.map((roomId) => {
          return axios.put(
            `${baseUrl}/rooms/update-availability/${roomId}`,
            { allDates },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
      );
      res.forEach((response) => toast.success(response.data.message));
      setIsModalOpen(false);
      setLoading(false);
      navigate("/");
    } catch (error) {
      if (error.response.data.message === "invalid token") {
        toast.error("Session Expired");
        dispatch(logoutAction());
        navigate("/login");
        setLoading(false);
        return;
      }
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center>
        <h2 className="reserveHeader">Select Your Rooms</h2>
        <div className="rItemContainer">
          {data?.map((item, i) => (
            <div key={i} className="rItem">
              <div className="rItemInfo">
                <div className="rTitle">{item?.title}</div>
                <div className="rDesc">{item?.desc}</div>
                <div className="rMax">Maximum People : {item?.maxPeople}</div>
                <div className="rPrice">${item?.price}</div>
              </div>

              {item?.roomNumbers?.map((roomNumber, i) => (
                <div key={i} className="rooms">
                  <label>Room Number: {roomNumber?.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber?._id}
                    onChange={handleSelectRoom}
                    disabled={isRoomBooked(roomNumber)}
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            onClick={handleReserve}
            className="reserveBtn"
            disabled={loading}
          >
            Reserve Now
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Reserve;
