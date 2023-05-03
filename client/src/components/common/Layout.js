import { AuthContext } from "FirebaseUtils/authenticate";
import Nav from "components/navbar";
import React from "react";

function LayoutProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useContext(AuthContext);

  React.useEffect(() => {
    if (currentUser === null)
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
  }, [currentUser, setCurrentUser]);

  return (
    <div className="h-[100%] overflow-y-auto bg-[#f0eaeb52]">
      <Nav />
      <div className="p-4 ">{children}</div>
    </div>
  );
}

export default LayoutProvider;
