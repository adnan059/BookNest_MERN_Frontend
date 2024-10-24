import { useNavigate } from "react-router-dom";
import "../assets/styles/FeaturedProperties.css";
import useFetch from "./../hooks/useFetch";
import { baseUrl } from "./../lib/utils";

const FeaturedProperties = () => {
  const { data, loading } = useFetch(`${baseUrl}/hotels/featured`);
  const navigate = useNavigate();

  console.log(data);

  return (
    <div className="fp">
      {data?.map((item, i) => (
        <div
          onClick={() => navigate(`/hotels/${item?._id}`)}
          key={item.name}
          className="fpItem"
        >
          <img
            src={
              item.photos[0] ||
              "https://cf.bstatic.com/xdata/images/hotel/square600/13125860.webp?k=e148feeb802ac3d28d1391dad9e4cf1e12d9231f897d0b53ca067bde8a9d3355&o=&s=1"
            }
            alt=""
            className="fpImg"
          />
          <span className="fpName">{item.name}</span>
          <span className="fpCity">{item.city}</span>
          <span className="fpPrice">Starting from ${item.cheapestPrice}</span>
          {item.rating && (
            <div className="fpRating">
              <button>{item.rating}</button>
              <span>Excellent</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeaturedProperties;
