import Header from "./../components/Header";
import "../assets/styles/list.css";
import SearchItem from "../components/SearchItem";
import { useSelector } from "react-redux";

const List = () => {
  const { searchedData, loading } = useSelector((state) => state.searchData);

  return (
    <>
      <Header />

      <div className="list">
        <div className="listContainer">
          {loading ? (
            <h1>Loading...</h1>
          ) : searchedData.length === 0 ? (
            <h1>No Such Hotel Found!</h1>
          ) : (
            searchedData?.map((item, i) => <SearchItem item={item} key={i} />)
          )}
        </div>
      </div>
    </>
  );
};

export default List;
