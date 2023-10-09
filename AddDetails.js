import "../css/style.css";
import { useNavigate } from "react-router-dom";
import addScript from "./addScript";
import React, { useState, useEffect } from "react";
import pic1 from "./images/pic-1.jpg";
import pic2 from "./images/pic-2.jpg";
import pic3 from "./images/pic-3.jpg";
import pic4 from "./images/pic-4.jpg";
import pic5 from "./images/pic-5.jpg";
import pic6 from "./images/pic-6.jpg";
import pic7 from "./images/pic-7.jpg";
import pic8 from "./images/pic-8.jpg";
import pic9 from "./images/pic-9.jpg";
import { useCustomNavigation } from "./functions";

function App() {
  const { hell, logout, navhome, navlog, navreg, navabout, navcon } =
    useCustomNavigation();

  const allDet = sessionStorage.getItem("dett");
  const parsedDet = JSON.parse(allDet) || [];
  const namer = parsedDet.name;
  const role = parsedDet.selectedRole;

  const arr = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9];
  const picp = arr[parsedDet.picn];
  const navigate = useNavigate();
  const getLog = () => {
    if (parsedDet.name == "VIEWER") {
      return (
        <div className="flex-btn">
          <a onClick={navlog} className="option-btn">
            login
          </a>
          <a onClick={navreg} className="option-btn">
            register
          </a>
        </div>
      );
    } else {
      return (
        <div className="flex-btn">
          <a onClick={logout} className="option-btn">
            logout
          </a>
        </div>
      );
    }
  };

  useEffect(() => {
    addScript();
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  let dataFields = {};
  const user = parsedDet.userid;

  async function generateDetId() {
    const min = 1000;
    const max = 9999;
    const detailId = Math.floor(Math.random() * (max - min + 1)) + min;
    return detailId;
  }

  function parse() {
    const jsonInput = document.getElementById("jsonInput");
    const resultDiv = document.getElementById("result");
    const jsonString = jsonInput.value.replace(/\n/g, "");
    try {
      dataFields = JSON.parse(jsonString);
      resultDiv.innerHTML =
        "<pre>" + JSON.stringify(dataFields, null, 2) + "</pre>";
    } catch (error) {
      resultDiv.innerHTML = "Invalid JSON input: " + error.message;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const detid = await generateDetId();
    console.log("id is", detid);
    const response = await fetch("http://localhost:1337/api/add_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        dataFields,
        user,
        detid,
      }),
    });

    const data = await response.json();
    alert(data.message);
    navigate("/thome");
  }
  return (
    <div>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>addcourse</title>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"
      />
      <header className="header">
        <section className="flex">
          <h1 className="logname">YOU ARE IN PASSGUARD</h1>
          <div className="icons">
            <div id="menu-btn" className="fas fa-bars"></div>
            <div id="user-btn" className="fas fa-user"></div>
            <div id="toggle-btn" className="fas fa-sun"></div>
          </div>

          <div className="profile">
            <img src={picp} className="image" alt="" />
            <h3 className="name">{parsedDet.name}</h3>

            {getLog()}
          </div>
        </section>
      </header>

      <div className="side-bar">
        <div id="close-btn">
          <i className="fas fa-times"></i>
        </div>

        <div className="profile">
          <img src={picp} className="image" alt="" />
          <h3 className="name">{parsedDet.name}</h3>
        </div>

        <nav className="navbar">
          <a onClick={() => navhome(parsedDet.selectedRole)}>
            <i className="fas fa-home"></i>
            <span>home</span>
          </a>
          <a onClick={navabout}>
            <i className="fas fa-question"></i>
            <span>about</span>
          </a>
          <a onClick={navcon}>
            <i className="fas fa-headset"></i>
            <span>contact us</span>
          </a>
        </nav>
      </div>

      <section className="form-container">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h3>ENTER THE DETAILS</h3>
          <p>
            TITLE<span>*</span>
          </p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            name="title"
            placeholder="Enter title of data you want to store"
            required
            maxLength="50"
            className="box"
          />
          <p>DESCRIPTION</p>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter decription of details"
            rows="3"
            columns="50"
            maxLength="2000"
            className="box"
          ></textarea>
          <p>
            DETAILS<span>*</span>
          </p>
          <textarea
            id="jsonInput"
            name="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Enter the details you want to store in below format
            {
              name: hello,
              password: 123
            }"
            rows="5"
            columns="50"
            maxLength="2000"
            className="box"
          ></textarea>
          <a id="parseButton" className="option-btn" onClick={parse}>
            Parse JSON
          </a>
          <div id="result"></div>
          <input
            type="submit"
            value="ADD DETAILS"
            name="ADD DETAILS"
            className="btn"
          />
        </form>
      </section>
    </div>
  );
}
export default App;
