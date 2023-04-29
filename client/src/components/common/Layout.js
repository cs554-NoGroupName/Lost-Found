import Nav from "components/navbar";
import React from "react";

function LayoutProvider({ children }) {
  return (
    <div className="h-[100vh]">
      <Nav />
      <div className="p-4 h-[92vh] overflow-y-auto">{children}</div>
    </div>
  );
}

export default LayoutProvider;
