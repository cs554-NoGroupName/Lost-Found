import LayoutProvider from "components/common/Layout";
import { AuthContext } from "../../FirebaseUtils/authenticate";
import React from "react";
import useDocumentTitle from "components/common/useDocumentTitle";

function Home() {
  const [currentUser] = React.useContext(AuthContext);
  console.log({ currentUser });
  return (
    <LayoutProvider>

      {useDocumentTitle("Home")}
      <div>Home</div>
    </LayoutProvider>
  );
}

export default Home;
