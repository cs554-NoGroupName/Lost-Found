import LayoutProvider from "components/common/Layout";
import React from "react";
import useDocumentTitle from "components/common/useDocumentTitle";
import LoadingText from "components/common/loadingText";

function Home() {
  const [state, setState] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setState(false), 5000);
  }, []);

  return (
    <LayoutProvider>
      {useDocumentTitle("Home")}
      <div>{state ? <LoadingText /> : "Home"}</div>
    </LayoutProvider>
  );
}

export default Home;
