// src/utility/checkUserBRole.js
export default function checkUserBRole(userBData) {
  const getUserBRole = () => {
    if (userBData?.role?.label === "Tech" && userBData.licenseNumber != null) {
      return "LicensedTech";
    } else {
      return userBData?.role?.label || "";
    }
  };

  return getUserBRole();
}
