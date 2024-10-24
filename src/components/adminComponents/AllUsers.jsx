import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { baseUrl } from "./../../lib/utils";
import { useDispatch, useSelector } from "react-redux";

import "../../assets/styles/adminStyles/allUsers.css";
import useFetch from "../../hooks/useFetch.js";
import { Button } from "@mui/material";
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

// ---------------- Component ---------------------
const AllUsers = () => {
  const { token } = useSelector((state) => state.user);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleApiError = useHandleApiError();

  const { data, loading } = useFetch(`${baseUrl}/users`, token);

  // handle add or remove admin
  const handleAdminship = async (isAdmin, username, _id) => {
    if (
      window.confirm(
        isAdmin
          ? `Do you want to remove ${username} from admin panel?`
          : `Do you want to add ${username} to the admin panel?`
      )
    ) {
      setButtonLoading(true);
      try {
        const { data } = await axios.put(
          `${baseUrl}/users/update/${_id}`,
          {
            isAdmin: !isAdmin,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(data?.message);
        window.location.reload();
        setButtonLoading(false);
      } catch (error) {
        handleApiError(error);
        setButtonLoading(false);
      }
    }
  };

  // handle delete user
  const removeUser = async (_id, username) => {
    console.log(_id);
    if (confirm(`Do you want to remove ${username}`)) {
      setButtonLoading(true);
      try {
        const { data } = await axios.delete(`${baseUrl}/users/delete/${_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(data.message);
        window.location.reload();
        setButtonLoading(false);
      } catch (error) {
        handleApiError(error);
        setButtonLoading(false);
      }
    } else {
      return;
    }
  };

  // --------- return the jsx -----------
  return (
    <>
      <div className="allUsers">
        <h2>All Users</h2>
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <TableContainer
            sx={{ backgroundColor: "#faefe3", mt: 3 }}
            component={Paper}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeaderStyle} align="center">
                    Username
                  </TableCell>
                  <TableCell sx={tableHeaderStyle} align="center">
                    Email
                  </TableCell>
                  <TableCell sx={tableHeaderStyle} align="center">
                    Country
                  </TableCell>
                  <TableCell sx={tableHeaderStyle} align="center">
                    City
                  </TableCell>
                  <TableCell sx={tableHeaderStyle} align="center">
                    Phone
                  </TableCell>
                  <TableCell sx={tableHeaderStyle} align="center">
                    IsAdmin
                  </TableCell>
                  <TableCell sx={tableHeaderStyle} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row) => (
                  <TableRow
                    key={row.username}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell sx={tableRowStyle} align="center" scope="row">
                      {row.username}
                    </TableCell>
                    <TableCell sx={tableRowStyle} align="center">
                      {row.email}
                    </TableCell>
                    <TableCell sx={tableRowStyle} align="center">
                      {row.country}
                    </TableCell>
                    <TableCell sx={tableRowStyle} align="center">
                      {row.city}
                    </TableCell>
                    <TableCell sx={tableRowStyle} align="center">
                      {row.phone}
                    </TableCell>
                    <TableCell sx={tableRowStyle} align="center">
                      {row.isAdmin ? (
                        <Button
                          disabled={buttonLoading}
                          onClick={() =>
                            handleAdminship(
                              row?.isAdmin,
                              row?.username,
                              row?._id
                            )
                          }
                          color="error"
                          variant="contained"
                        >
                          Remove Admin
                        </Button>
                      ) : (
                        <Button
                          disabled={buttonLoading}
                          onClick={() =>
                            handleAdminship(
                              row?.isAdmin,
                              row?.username,
                              row?._id
                            )
                          }
                          color="success"
                          variant="contained"
                        >
                          Make Admin
                        </Button>
                      )}
                    </TableCell>
                    <TableCell
                      className="adminUserActions"
                      sx={tableRowStyle}
                      align="center"
                    >
                      <button
                        onClick={() => removeUser(row?._id, row?.username)}
                        disabled={buttonLoading}
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
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

export default AllUsers;
