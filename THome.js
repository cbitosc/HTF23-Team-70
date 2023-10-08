import { useNavigate } from "react-router-dom";
import addScript from "./addScript";
import React, { useState, useEffect } from "react";
import "../css/style.css";
import pic1 from "./images/pic-1.jpg";
import pic2 from "./images/pic-2.jpg";
import pic3 from "./images/pic-3.jpg";
import pic4 from "./images/pic-4.jpg";
import pic5 from "./images/pic-5.jpg";
import pic6 from "./images/pic-6.jpg";
import pic7 from "./images/pic-7.jpg";
import pic8 from "./images/pic-8.jpg";
import pic9 from "./images/pic-9.jpg";
import thumb1 from "./images/thumb-1.png";
import thumb2 from "./images/thumb-2.png";
import thumb3 from "./images/thumb-3.png";
import thumb4 from "./images/thumb-4.png";
import thumb5 from "./images/thumb-5.png";
import thumb6 from "./images/thumb-6.png";
import thumb7 from "./images/thumb-7.png";
import thumb8 from "./images/thumb-8.png";
import thumb9 from "./images/thumb-9.png";
import defaul from "./images/defthumb.jpg";
import { useCustomNavigation } from "./functions";

function App() {
  const { hell, logout, navhome, navlog, navreg, navabout, navcon } =
    useCustomNavigation();

  const allDet = sessionStorage.getItem("dett");
  const parsedDet = JSON.parse(allDet) || [];
  const userid = parsedDet.userid;

  let imgsrc = defaul;
  let num = 0;

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

  const [allDetails, setAllDetails] = useState([]);

  function clicked() {
    navigate("/adddetails");
  }

  async function fetchDetails() {
    const url = "http://localhost:1337/api/details/" + userid;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const valuesArray = [];

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const value = data[key];
            valuesArray.push(value);
            console.log(value, typeof value);
          }
        }
        setAllDetails(valuesArray);
        console.log(Array.isArray(allDetails));
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }

  const clickedv = (e) => {
    const courseidstr = e.target.id;
    const part = courseidstr.split(",");
    const courseid = part[0];
    const num = part[1];
    sessionStorage.setItem("playlistcourseid", courseid);
    sessionStorage.setItem("num", num);
    navigate("/details");
  };

  const fetchDataDetails = async (paramdetid) => {
    console.log(paramdetid);
    let dataDetails = {};
    const url = "http://localhost:1337/api/datafind/" + paramdetid;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        dataDetails = data;
        console.log(data, dataDetails);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
    if (dataDetails.title.toLowerCase().includes("html")) {
      imgsrc = thumb1;
      num = 1;
    } else if (dataDetails.title.toLowerCase().includes("css")) {
      imgsrc = thumb2;
      num = 2;
    } else if (
      dataDetails.title.toLowerCase().includes("javascript") ||
      dataDetails.title.toLowerCase().includes("js")
    ) {
      imgsrc = thumb3;
      num = 3;
    } else if (dataDetails.title.toLowerCase().includes("boostrap")) {
      imgsrc = thumb4;
      num = 4;
    } else if (dataDetails.title.toLowerCase().includes("jquery")) {
      imgsrc = thumb5;
      num = 5;
    } else if (dataDetails.title.toLowerCase().includes("sass")) {
      imgsrc = thumb6;
      num = 6;
    } else if (dataDetails.title.toLowerCase().includes("php")) {
      imgsrc = thumb7;
      num = 7;
    } else if (dataDetails.title.toLowerCase().includes("mysql")) {
      imgsrc = thumb8;
      num = 8;
    } else if (dataDetails.title.toLowerCase().includes("react")) {
      imgsrc = thumb9;
      num = 9;
    }
    return dataDetails;
  };

  const [fetchedDetails, setFetchedDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dataPromises = allDetails.map((paramdetid) =>
        fetchDataDetails(paramdetid)
      );

      const resolvedDataDetails = await Promise.all(dataPromises);

      setFetchedDetails(resolvedDataDetails);
    };

    fetchData();
  }, [allDetails]);

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>thome</title>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"
      />
      <header className="header">
        <section className="flex">
          <button className="inline-btn" onClick={clicked}>
            ADD DETAILS
          </button>
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
          <a onClick={hell}>
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

      <section className="courses">
        <h1 className="heading">Your details</h1>

        <div className="box-container">
          {fetchedDetails.length === 0 ? (
            <p>No courses at the moment...</p>
          ) : (
            fetchedDetails.map((dataDetails, index) => (
              <div className="box" key={index}>
                <div className="tutor">
                  <div className="info">
                    <h3 className="title">{dataDetails.title}</h3>
                  </div>
                </div>
                <div className="thumb">
                  <img src={imgsrc} alt="" />
                </div>
                <br></br>
                <br></br>
                <p style={{ fontSize: "30px" }}>{dataDetails.description}</p>
                <br></br>
                <br></br>
                <br></br>
                <button
                  onClick={clickedv}
                  id={String(dataDetails.detid) + "," + String(num)}
                  className="inline-btn"
                >
                  view details
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
