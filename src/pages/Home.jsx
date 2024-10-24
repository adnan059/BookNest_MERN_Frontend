import "../assets/styles/home.css";
import Featured from "../components/Featured";
import FeaturedProperties from "../components/FeaturedProperties";
import Header from "../components/Header";
import PropertyList from "./../components/PropertyList";
import MailList from "./../components/MailList";

import "../assets/styles/home.css";

const Home = () => {
  return (
    <>
      <Header />
      <div className="home">
        <div className="homeContainer">
          <Featured />
          <h1 className="homeTitle">Browse By Property Type</h1>
          <PropertyList />
          <h1 className="homeTitle">Homes Guests Love</h1>
          <FeaturedProperties />
          <MailList />
        </div>
      </div>
    </>
  );
};

export default Home;
