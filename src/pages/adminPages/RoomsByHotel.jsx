import React, { useState } from "react";
import "../../assets/styles/adminStyles/roomsByHotel.css";
import useFetch from "./../../hooks/useFetch";
import { baseUrl } from "./../../lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import useHandleApiError from "../../hooks/useHandleApiError";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const RoomsByHotel = () => {
  const { token } = useSelector((state) => state.user);
  const { state } = useLocation();
  const navigate = useNavigate();
  const hotelData = state.hotelData;
  const { data, loading } = useFetch(
    `${baseUrl}/rooms/roomsbyhotel/${hotelData?._id}`
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleApiError = useHandleApiError();

  const deleteRoom = async (roomId, hotelId) => {
    if (!confirm("Do you really want to delete this room?")) {
      return;
    }
    setDeleteLoading(true);
    try {
      const { data } = await axios.delete(
        `${baseUrl}/rooms/delete/${roomId}/${hotelId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDeleteLoading(false);
      toast.success(data?.message);
      window.location.reload();
    } catch (error) {
      handleApiError(error);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="roomsByHotel">
      <div className="roomsByHotelContainer">
        <div className="roomCardContainer">
          {loading ? (
            <h1>Loading...</h1>
          ) : data?.length > 0 ? (
            data?.map((room) => {
              return (
                <div className="roomBox" key={room?._id}>
                  <h3>{room?.title}</h3>
                  <p>${room?.price}</p>
                  <p>{room?.desc.slice(0, 15)}...</p>
                  <div className="btns">
                    <button
                      onClick={() =>
                        navigate(`/admin/room/${room?._id}`, {
                          state: { roomData: room, hotelId: hotelData?._id },
                        })
                      }
                      className="fa-regular fa-eye"
                    ></button>
                    <button
                      disabled={deleteLoading}
                      onClick={() => deleteRoom(room?._id, hotelData?._id)}
                      className="fa-regular fa-trash-can"
                    ></button>
                  </div>
                </div>
              );
            })
          ) : (
            <h1>No Rooms Found</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsByHotel;
