import "../assets/styles/propertyList.css";
import useFetch from "./../hooks/useFetch";
import { baseUrl } from "./../lib/utils";

const propertyImages = [
  {
    type: "boutiques",
    url: "https://images.pexels.com/photos/8135504/pexels-photo-8135504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    type: "resorts",
    url: "https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    type: "lodges",
    url: "https://images.pexels.com/photos/2662183/pexels-photo-2662183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    type: "luxuries",
    url: "https://images.pexels.com/photos/3285725/pexels-photo-3285725.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    type: "apartments",
    url: "https://images.pexels.com/photos/565324/pexels-photo-565324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const PropertyList = () => {
  const { data, loading } = useFetch(`${baseUrl}/hotels/countbytype`);

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="pList">
          {propertyImages.map((img, i) => (
            <div key={img.type} className="pListItem">
              <img src={img.url} alt="" className="pListImg" />
              <div className="pListTitles">
                <h1>{data[i]?.type}</h1>
                <h2>
                  {data[i]?.count} {data[i]?.type}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PropertyList;
