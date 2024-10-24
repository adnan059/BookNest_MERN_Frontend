import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "./redux/store";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import BookingApp from "./BookingApp";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <BookingApp />
        </PersistGate>
      </Provider>
      <ToastContainer />
    </>
  );
};

export default App;
