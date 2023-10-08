import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddDetails from "./pages/AddDetails";
import THome from "./pages/THome";
import Details from "./pages/Detials";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Allhome from "./pages/allhome";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <div id="root">
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Allhome />} />
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/thome"
            element={
              <PrivateRoute element={<THome />} allowedRoles={"logged"} />
            }
          />
          <Route
            path="/adddetails"
            element={
              <PrivateRoute element={<AddDetails />} allowedRoles={"logged"} />
            }
          />
          <Route
            path="/details"
            element={
              <PrivateRoute element={<Details />} allowedRoles={"logged"} />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route
            path="/register"
            element={<PrivateRoute element={<Register />} allowedRoles={""} />}
          />
          <Route
            path="/login"
            element={<PrivateRoute element={<Login />} allowedRoles={""} />}
          /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
