require("dotenv").config();
const { AUTH_EMAIL } = process.env;
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const axios = require("axios");
const OTP = require("./models/otp");
const sendEmail = require("./models/sendEmail");
const detailsSchema = require("./models/detailsadd");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

app.use(cors());
app.use(express.json());

async function refreshData() {
  try {
    await User.deleteMany({});
    await detailsSchema.deleteMany({});
    await OTP.deleteMany({});
    console.log("All data in the User collection has been deleted.");
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

app.post("/api/register", async (req, res) => {
  try {
    function getRandomNumber() {
      const randomNumber = Math.random();
      const scaledNumber = Math.floor(randomNumber * 9);
      return scaledNumber;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      userid: req.body.userid,
      selectedRole: "Viewer",
      picn: getRandomNumber(),
      detailsList: [],
      verified: false,
    });

    const otpApiUrl = "http://localhost:1337/api/otp";
    const requestData = {
      email: req.body.email,
      subject: "Email Verification",
      message: "Your OTP code is:",
      duration: 1,
    };
    axios
      .post(otpApiUrl, requestData)
      .then((response) => {
        console.log("Success");
      })
      .catch((error) => {
        console.error("API Error:", error.message);
      });
    console.log("reached this point");
    res.json({ status: "ok", message: "Registration successful" });
  } catch (err) {
    res.json({ status: err, error: "Duplicate email" });
  }
});

app.post("/api/otp", async (req, res) => {
  try {
    const { email, subject, message, duration } = req.body;
    const generateOTP = async () => {
      return Math.floor(1000 + Math.random() * 9000);
    };
    let generatedOTP = await generateOTP();
    generatedOTP = String(generatedOTP);
    const sendOTP = async ({ email, subject, message, duration = 1 }) => {
      await OTP.deleteOne({ email });
      const mailOptions = {
        from: AUTH_EMAIL,
        to: email,
        subject: subject,
        html: `<p>${message}</p><p style="color:tomato;font-size:25px;letter-spacing:2px;"
      <b>${generatedOTP}</b></p>
      <p> This code<b> expires in ${duration} hour(s)</b></p>`,
      };
      await sendEmail(mailOptions);
      const hashedOTP = await bcrypt.hash(generatedOTP, 10);
      const newOTP = await new OTP({
        email,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000 * +duration,
      });
      const createdOTPRecord = await newOTP.save();
    };
    const createdOTP = await sendOTP({
      email,
      subject,
      message,
      duration,
    });
    res.status(200).json(createdOTP);
  } catch (error) {
    console.log("api error", error);
    res.status(400).send(error.message);
  }
});

app.post("/api/verify", async (req, res) => {
  try {
    let { email, otp } = req.body;
    const matchedOTPRecord = await OTP.findOne({ email });
    if (!matchedOTPRecord) {
      console.log("NO OTP FOUND");
      throw Error("NO OTP FOUND");
    }
    const { expiresAt } = matchedOTPRecord;
    if (expiresAt < Date.now()) {
      await OTP.deleteOne({ email });
      throw Error("OTP Expired");
    }
    const hashedOTP = matchedOTPRecord.otp;
    const validOTP = await bcrypt.compare(String(req.body.otp), hashedOTP);
    if (validOTP) {
      const veruser = await User.findOne({ email: req.body.email });
      veruser.verified = true;
      await veruser.save();
      return res.status(200).json({ valid: true });
    } else {
      return res.status(200).json({ valid: false });
    }
  } catch (error) {
    console.log("error somewhere", error);
    return res.status(400).send(error.message);
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.json({ status: "error", error: "Invalid login" });
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (isPasswordValid && user.verified === true) {
    user.selectedRole = "logged";
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );
    const detl = {
      name: user.name,
      userid: user.userid,
      selectedRole: user.selectedRole,
      detailsList: user.detailsList,
      picn: user.picn,
    };
    return res.json({ status: "ok", user: token, det: detl });
  } else {
    return res.json({ status: "error", error: "Invalid password" });
  }
});

app.post("/api/add_details", async (req, res) => {
  try {
    console.log("id is", req.body.detid);
    console.log("datafields", req.body.dataFields);
    const createddetail = await detailsSchema.create({
      title: req.body.title,
      description: req.body.description,
      dataFields: req.body.dataFields,
      user: req.body.user,
      detid: req.body.detid,
    });
    const user = await User.findOne({
      userid: req.body.user,
    });
    console.log(user, req.body.user);
    user.detailsList.push(req.body.detid);
    await user.save();
    res.json({
      status: "ok",
      message: "Details added successful",
      lis: user.detailsList,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: err,
      error: "Error in details creation",
      message: "Error in details creation",
    });
  }
});

app.get("/api/details/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    const user = await User.findOne({ userid: userid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const detailsList = user.detailsList;
    console.log(detailsList);
    return res.json(detailsList);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/datafind/:detid", async (req, res) => {
  try {
    const detid = req.params.detid;
    const details = await detailsSchema.findOne({ detid: detid });
    if (!details) {
      return res.status(404).json({ error: "Details not found" });
    }

    const dataDet = {
      title: details.title,
      description: details.description,
      detid: details.detid,
      dataFields: details.dataFields,
    };

    return res.json(dataDet);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/hello", (req, res) => {
  console.log("GET request received for /hello");
  res.send("hello world");
});

const port = process.env.PORT || 1337 || 80 || 443;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
