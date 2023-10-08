import { useNavigate } from "react-router-dom";

export const useCustomNavigation = () => {
  const navigate = useNavigate();

  const hell = (event) => {
    event.preventDefault();
  };

  const logout = () => {
    sessionStorage.removeItem("dett");
    navigate("/login");
  };

  const navhome = (rol) => {
    if (rol == "logged") {
      navigate("/thome");
    } else {
      navigate("/home");
    }
  };

  const navlog = () => {
    navigate("/login");
  };

  const navreg = () => {
    navigate("/register");
  };

  const navabout = () => {
    navigate("/about");
  };

  const navcon = () => {
    navigate("/contact");
  };

  return {
    hell,
    logout,
    navhome,
    navlog,
    navreg,
    navabout,
    navcon,
  };
};
