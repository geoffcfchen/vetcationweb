import { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

function checkRole() {
  const { userData } = useContext(GlobalContext);

  const getRole = () => {
    if (userData?.role?.label === "Tech" && userData.licenseNumber != null) {
      return "LicensedTech";
    }
    return userData?.role?.label || "";
  };

  return getRole();
}

export default checkRole;
