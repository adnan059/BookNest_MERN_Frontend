import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { baseUrl } from "./../../lib/utils";

import "../../assets/styles/adminStyles/allRooms.css";
import useFetch from "../../hooks/useFetch.js";
import { useNavigate } from "react-router-dom";

const tableHeaderStyle = {
  fontSize: "1.7rem",
  fontWeight: "bold",
  color: "bisque",
  backgroundColor: "#3d1800",
};

const tableRowStyle = { fontSize: "1.5rem", color: "#333" };

const AllRooms = () => {
  const { data, loading } = useFetch(`${baseUrl}/rooms`);
  const navigate = useNavigate();

  return (
    <>
      <div className="allRooms">
        <h2>All Rooms</h2>
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
                    Title
                  </TableCell>
                  <TableCell sx={tableHeaderStyle} align="center">
                    Price
                  </TableCell>
                  <TableCell sx={tableHeaderStyle} align="center">
                    Maximum People
                  </TableCell>

                  <TableCell sx={tableHeaderStyle} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row) => (
                  <TableRow
                    key={row.title}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell sx={tableRowStyle} align="center" scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell sx={tableRowStyle} align="center">
                      ${row.price}
                    </TableCell>
                    <TableCell sx={tableRowStyle} align="center">
                      {row.maxPeople}
                    </TableCell>

                    <TableCell
                      className="adminRoomActions"
                      sx={tableRowStyle}
                      align="center"
                    >
                      <button
                        onClick={() => {
                          navigate(`/admin/room/${row?._id}`, {
                            state: { roomData: row },
                          });
                        }}
                      >
                        <i className="fa-regular fa-eye"></i>
                        View
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

export default AllRooms;
