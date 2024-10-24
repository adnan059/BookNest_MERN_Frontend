import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { baseUrl } from "./../../lib/utils";
import { useSelector } from "react-redux";

import "../../assets/styles/adminStyles/allHotels.css";
import useFetch from "../../hooks/useFetch.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useHandleApiError from "../../hooks/useHandleApiError.js";
import { useState } from "react";

const tableHeaderStyle = {
  fontSize: "1.7rem",
  fontWeight: "bold",
  color: "bisque",
  backgroundColor: "#3d1800",
};

const tableRowStyle = { fontSize: "1.5rem", color: "#333" };

// AllHotels Component

const AllHotels = () => {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { data, loading } = useFetch(`${baseUrl}/hotels`, token);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleApiError = useHandleApiError();

  // delete this hotel
  const deleteHotel = async (_id) => {
    if (!confirm("Do you really want to delete this hotel?")) {
      return;
    }

    setDeleteLoading(true);
    try {
      const { data } = await axios.delete(`${baseUrl}/hotels/delete/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteLoading(false);
      toast.success(data?.message);
      window.location.reload();
    } catch (error) {
      handleApiError(error);
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="allHotels">
        <div className="hotelsHeader">
          <h2>All Hotels</h2>
          <button onClick={() => navigate("/admin/create-hotel")}>
            <i className="fa-solid fa-plus"></i>
            Add New Hotel
          </button>
        </div>
        {loading ? (
          <h1>Loading</h1>
        ) : (
          <TableContainer
            sx={{ backgroundColor: "#faefe3", mt: 3 }}
            component={Paper}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeaderStyle} align="center">
                    Name
                  </TableCell>
                  <TableCell sx={tableHeaderStyle} align="center">
                    Type
                  </TableCell>
                  <TableCell sx={tableHeaderStyle} align="center">
                    City
                  </TableCell>
                  <TableCell sx={tableHeaderStyle} align="center">
                    Cheapest Price
                  </TableCell>
                  <TableCell sx={tableHeaderStyle} align="center">
                    IsFeatured
                  </TableCell>

                  <TableCell sx={tableHeaderStyle} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell sx={tableRowStyle} align="center" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell sx={tableRowStyle} align="center">
                      {row.type}
                    </TableCell>
                    <TableCell
                      sx={tableRowStyle}
                      align="center"
                      className="city"
                    >
                      {row.city}
                    </TableCell>
                    <TableCell sx={tableRowStyle} align="center">
                      ${row.cheapestPrice}
                    </TableCell>
                    <TableCell sx={tableRowStyle} align="center">
                      {row.featured ? "Yes" : "No"}
                    </TableCell>

                    <TableCell
                      className="adminUserActions"
                      sx={{
                        ...tableRowStyle,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                      align="center"
                    >
                      <button
                        onClick={() =>
                          navigate(`/admin/hotel/${row?._id}`, {
                            state: { hotelData: row },
                          })
                        }
                        className="fa-regular fa-eye"
                      ></button>
                      <button
                        disabled={deleteLoading}
                        onClick={() => deleteHotel(row?._id)}
                        className="fa-regular fa-trash-can"
                      ></button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </>
  );
};

export default AllHotels;
