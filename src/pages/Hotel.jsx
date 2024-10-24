import { useState } from "react";
import "../assets/styles/hotel.css";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "./../hooks/useFetch";
import { baseUrl, dayDifference } from "../lib/utils";
import { useSelector } from "react-redux";
import Reserve from "../components/Reserve";

// const photos = [
//   {
//     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707778.jpg?k=56ba0babbcbbfeb3d3e911728831dcbc390ed2cb16c51d88159f82bf751d04c6&o=&hp=1",
//   },
//   {
//     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707367.jpg?k=cbacfdeb8404af56a1a94812575d96f6b80f6740fd491d02c6fc3912a16d8757&o=&hp=1",
//   },
//   {
//     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261708745.jpg?k=1aae4678d645c63e0d90cdae8127b15f1e3232d4739bdf387a6578dc3b14bdfd&o=&hp=1",
//   },
//   {
//     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707776.jpg?k=054bb3e27c9e58d3bb1110349eb5e6e24dacd53fbb0316b9e2519b2bf3c520ae&o=&hp=1",
//   },
//   {
//     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261708693.jpg?k=ea210b4fa329fe302eab55dd9818c0571afba2abd2225ca3a36457f9afa74e94&o=&hp=1",
//   },
//   {
//     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707389.jpg?k=52156673f9eb6d5d99d3eed9386491a0465ce6f3b995f005ac71abc192dd5827&o=&hp=1",
//   },
// ];

const Hotel = () => {
  const { id } = useParams();
  const [slideNumber, setSlideNumber] = useState(0);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, loading } = useFetch(`${baseUrl}/hotels/${id}`);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const { searchQueries } = useSelector((state) => state.searchData);

  const days = dayDifference(
    searchQueries?.dates[0]?.endDate,
    searchQueries?.dates[0]?.startDate
  );

  // ------- handle image click -------------
  const handleClickImage = (i) => {
    setSlideNumber(i);
    setIsSliderOpen(true);
  };

  // ----------- handle reservation ------------
  const handleReserve = () => {
    setIsModalOpen(true);
  };

  // ------- handle slider -----------
  const handleSlider = (dir) => {
    const maximumPhotoIndex = data?.photos?.length - 1;
    let newSlidenumber;
    if (dir === "left") {
      newSlidenumber = slideNumber === 0 ? maximumPhotoIndex : slideNumber - 1;
    } else if (dir === "right") {
      newSlidenumber = slideNumber === maximumPhotoIndex ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlidenumber);
  };

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <div className="hotelContainer">
      {/* -------- slider ui ------- */}
      {isSliderOpen && (
        <div className="slider">
          <i
            onClick={() => setIsSliderOpen(false)}
            className="fa-solid fa-xmark closeSliderIcon"
          ></i>
          <i
            onClick={() => handleSlider("left")}
            className="fa-solid fa-angles-left leftArrow arrow"
          ></i>
          <div className="sliderWrapper">
            <img src={data?.photos[slideNumber]} alt="" className="slideImg" />
          </div>
          <i
            onClick={() => handleSlider("right")}
            className="fa-solid fa-angles-right rightArrow arrow"
          ></i>
        </div>
      )}

      {/* -------- normal ui --------- */}
      <div className="hotelWrapper">
        <h1 className="hotelTitle">{data?.name}</h1>
        <div className="hotelAddress">
          <i className="fa-solid fa-location-dot"></i>
          <span>{data?.address}</span>
        </div>
        <span className="hotelDistance">
          Excellent location – {data?.distance} km from center
        </span>
        <span className="hotelPriceHighlight">
          Book a stay over ${data?.cheapestPrice} at this property and get a
          free airport taxi
        </span>
        <div className="hotelImages">
          {data?.photos?.map((photo, i) => (
            <div className="hotelImgWrapper" key={i}>
              <img
                src={photo}
                alt=""
                className="hotelImg"
                onClick={() => handleClickImage(i)}
              />
            </div>
          ))}
        </div>
        <div className="hotelDetails">
          <div className="hotelDetailsTexts">
            <h1 className="hotelTitle">{data?.title}</h1>
            <p className="hotelDesc">{data?.desc}</p>
          </div>
          <div className="hotelDetailsPrice">
            <h1>Perfect for a {days}-night stay!</h1>
            <span>
              Located near the real heart of the city, this property has an
              excellent location score of 9.8!
            </span>
            <h2>
              <b>${days * data?.cheapestPrice * searchQueries?.options.room}</b>{" "}
              ({days} nights)
            </h2>
            <button onClick={handleReserve}>Reserve or Book Now!</button>
          </div>
        </div>
      </div>

      <Reserve
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        hotelId={id}
      />
    </div>
  );
};

export default Hotel;
