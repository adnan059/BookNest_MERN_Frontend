import "../assets/styles/header.css";
import HeaderSearchForm from "./HeaderSearchForm";

const Header = () => {
  return (
    <>
      <div className="headerContainer">
        <div className="headerContent">
          <h1 className="headerTitle">
            A lifetime of discounts? It&apos;s Genius.
          </h1>
          <p className="headerDesc">
            Get rewarded for your travels – unlock instant savings of 10% or
            more with a free Lamabooking account
          </p>
        </div>

        <HeaderSearchForm />
      </div>
    </>
  );
};

export default Header;
