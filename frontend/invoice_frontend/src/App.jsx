import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import AddInvoice from "./pages/AddInvoice";

function App() {

  return (
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/addinvoice" element={<AddInvoice />} />
      </Routes>
  );
}

export default App;
