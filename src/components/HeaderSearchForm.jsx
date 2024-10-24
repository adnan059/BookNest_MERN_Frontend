import { useReducer, useState } from "react";
import "../assets/styles/headerSearchForm.css";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  storeData,
  updateLoading,
  updateSearchQueries,
} from "../redux/searchDataSlice";
import axios from "axios";
import { baseUrl } from "../lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

const initialState = {
  adult: 1,
  children: 0,
  room: 1,
};

const reducer = (state, action) => {
  switch (action) {
    case "incAdult":
      return { ...state, adult: state.adult + 1 };

    case "decAdult":
      return state.adult > 1 ? { ...state, adult: state.adult - 1 } : state;

    case "incChildren":
      return { ...state, children: state.children + 1 };

    case "decChildren":
      return state.children > 0
        ? { ...state, children: state.children - 1 }
        : state;

    case "incRoom":
      return { ...state, room: state.room + 1 };

    case "decRoom":
      return state.room > 1 ? { ...state, room: state.room - 1 } : state;

    case "initial":
      return state;
  }
};

const HeaderSearchForm = () => {
  const [openDateRange, setOpenDateRange] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, dispatch] = useReducer(reducer, initialState);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [destination, setDestination] = useState("");
  const [minPrice, setMinPrice] = useState(10);
  const [maxPrice, setMaxPrice] = useState(1500);

  const navigate = useNavigate();

  const reduxDispatch = useDispatch();

  const { pathname } = useLocation();

  // handle Search submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    reduxDispatch(updateSearchQueries({ destination, dateRange, options }));

    reduxDispatch(updateLoading({ loading: true }));
    try {
      const response = await axios.get(
        `${baseUrl}/hotels?city=${destination}&min=${minPrice}&max=${maxPrice}`
      );

      reduxDispatch(storeData({ data: response.data }));

      if (pathname !== "/hotels") {
        navigate("/hotels");
      }

      reduxDispatch(updateLoading({ loading: false }));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      reduxDispatch(updateLoading({ loading: false }));
    }
  };

  return (
    <div className="headerFormContainer">
      <form className="headerSearchForm" onSubmit={handleSubmit}>
        <div className="formPart-1">
          {/* ----------- Setting Places ------------- */}

          <div className="headerSearchItem">
            <i className="fa-solid fa-bed"></i>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value.toLowerCase())}
              type="text"
              placeholder="Where are you going?"
              className="headerSearchInput"
            />
          </div>

          {/* ------------ Setting Dates ------------- */}
          <div className="headerSearchItem">
            <i className="fa-solid fa-calendar-days"></i>
            <span
              onClick={() => setOpenDateRange(!openDateRange)}
              className="headerSearchText"
            >
              {`${format(dateRange[0].startDate, "dd/MM/yyyy")} to ${format(
                dateRange[0].endDate,
                "dd/MM/yyyy"
              )}`}

              <i
                className={
                  openDateRange
                    ? "fa-solid fa-angle-down"
                    : "fa-solid fa-angle-up"
                }
              ></i>
            </span>
            {openDateRange && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                className="dateRange"
                minDate={new Date()}
              />
            )}
          </div>

          {/* ------------ Setting Options ------------- */}

          <div className="headerSearchItem">
            <i className="fa-solid fa-users"></i>

            <span
              onClick={() => setOpenOptions(!openOptions)}
              className="headerSearchText"
            >
              {`${options.adult} adults - ${options.children} children - ${options.room} rooms`}

              <i
                className={
                  openOptions
                    ? "fa-solid fa-angle-down"
                    : "fa-solid fa-angle-up"
                }
              ></i>
            </span>
            {openOptions && (
              <div className="options">
                <div className="optionItem">
                  <span className="optionText">Adult</span>
                  <div className="optionCounter">
                    <button
                      type="button"
                      onClick={() => dispatch("decAdult")}
                      className="optionCounterBtn"
                    >
                      -
                    </button>
                    <span className="optionCount">{options.adult}</span>
                    <button
                      type="button"
                      onClick={() => dispatch("incAdult")}
                      className="optionCounterBtn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="optionItem">
                  <span className="optionText">Children</span>
                  <div className="optionCounter">
                    <button
                      type="button"
                      onClick={() => dispatch("decChildren")}
                      className="optionCounterBtn"
                    >
                      -
                    </button>
                    <span className="optionCount">{options.children}</span>
                    <button
                      type="button"
                      onClick={() => dispatch("incChildren")}
                      className="optionCounterBtn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="optionItem">
                  <span className="optionText">Rooms</span>
                  <div className="optionCounter">
                    <button
                      type="button"
                      onClick={() => dispatch("decRoom")}
                      className="optionCounterBtn"
                    >
                      -
                    </button>
                    <span className="optionCount">{options.room}</span>
                    <button
                      type="button"
                      onClick={() => dispatch("incRoom")}
                      className="optionCounterBtn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="formPart-2">
          {/* --- Setting MinPrice --- */}
          <div className="headerSearchItem">
            <i className="fa-solid fa-dollar-sign"></i>
            <input
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              type="number"
              placeholder="Min Price"
              className="headerSearchInput"
              min={10}
            />
          </div>

          {/* --- Setting MaxPrice --- */}
          <div className="headerSearchItem">
            <i className="fa-solid fa-dollar-sign"></i>
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              type="number"
              placeholder="Max Price"
              className="headerSearchInput"
            />
          </div>

          {/* ----------- Search Button ------------- */}

          <div className="headerSearchItem">
            <input type="submit" className="headerBtn" value={"Search"} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default HeaderSearchForm;
