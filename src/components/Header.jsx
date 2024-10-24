import "../assets/styles/header.css";
import HeaderSearchForm from "./HeaderSearchForm";

const Header = () => {
  return (
    <>
      <div className="headerContainer">
        <div className="headerContent">
          <h1 className="headerTitle">Find Your Perfect Stay, Anywhere</h1>
          <p className="headerDesc">
            Explore the best hotels, resorts, and inns with unbeatable deals.
            Book your dream getaway today!
          </p>
        </div>

        <HeaderSearchForm />
      </div>
    </>
  );
};

export default Header;
