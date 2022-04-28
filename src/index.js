import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function getLibrary(provider) {
  const library = new Web3(provider);
  library.pollingInterval = 8000;
  return library;
}
ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ToastContainer/>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
