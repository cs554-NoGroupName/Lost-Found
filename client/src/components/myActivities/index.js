import LayoutProvider from "components/common/Layout";
import React from "react";
import { getUserActivites } from "utils/apis/user";

function MyActivites() {
  const [data, setData] = React.useState();

  React.useEffect(() => {
    getUserActivites()
      .then((data) => {
        setData(data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <LayoutProvider>
      <div>
        <div>
          My MyActivites
        </div>
        <div>
          
        </div>
      </div>
    </LayoutProvider>
  );
}

export default MyActivites;
