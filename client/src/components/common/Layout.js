import Nav from "components/navbar";
import React from "react";

function LayoutProvider({ children }) {
  return (
    <div className="h-[100%] overflow-y-auto">
      <Nav />
      <div className="p-4">{children}</div>
    </div>
  );
}

export default LayoutProvider;
