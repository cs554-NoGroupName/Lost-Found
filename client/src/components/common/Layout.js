import Nav from "components/navbar";
import React from "react";

function LayoutProvider({ children, title }) {
  return (
    <div className="h-[100%] overflow-y-auto bg-[#9da4ae17]">
      <Nav />
      <div className="p-4">
        {title && (
          <div className="layout_title sm:text-xl text-2xl">{title}</div>
        )}
        {children}
      </div>
    </div>
  );
}

export default LayoutProvider;
