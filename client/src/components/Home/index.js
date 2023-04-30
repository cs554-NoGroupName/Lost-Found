import LayoutProvider from "components/common/Layout";
import { AuthContext } from "../../FirebaseUtils/authenticate";
import React, { useContext } from "react";

function Home() {
  const [currentUser, setCurrentUser] = useContext(AuthContext);
  console.log({ currentUser });
  return (
    <LayoutProvider>
      <div>Home</div>
    </LayoutProvider>
  );
}

export default Home;
