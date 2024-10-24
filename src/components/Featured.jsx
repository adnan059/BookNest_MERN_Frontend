import "../assets/styles/featured.css";
import useFetch from "../hooks/useFetch";
import { baseUrl } from "../lib/utils";

const Featured = () => {
  const { data, loading } = useFetch(
    `${baseUrl}/hotels/countbycity?cities=miami,berlin,london`
  );

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="featured">
          <div className="featuredItem">
            <img
              src="https://images.pexels.com/photos/9400883/pexels-photo-9400883.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Miami</h1>
              <h2>{data[0]} properties</h2>
            </div>
          </div>

          <div className="featuredItem">
            <img
              src="https://images.pexels.com/photos/1057840/pexels-photo-1057840.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Berlin</h1>
              <h2>{data[1]} properties</h2>
            </div>
          </div>
          <div className="featuredItem">
            <img
              src="https://images.pexels.com/photos/220887/pexels-photo-220887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>London</h1>
              <h2>{data[2]} properties</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Featured;
