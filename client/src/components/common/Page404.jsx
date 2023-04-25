import React from "react";
import page404Png from "utils/images/404.png";
import "./styles.css";
import { Link } from "react-router-dom";

function Page404() {
  return (
    <div className="h-inherit flex flex-col items-center justify-center m-4">
      <div className="sm:text-xl md:text-2xl text-4xl text-logoBlue font-extrabold">
        Sorry, page not found!
      </div>
      <div className="py-4 sm:text-lg md:text-xl text-2xl text-logoDarkBlue small_text_msg">
        Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
        mistyped the URL? Be sure to check your spelling.
      </div>
      <div className="btn_default my-5">
        {" "}
        <Link to="/">Go to Home</Link>
      </div>
      <div className="w-[650px] sm:w-[400px] h-min">
        <img
          src={page404Png}
          alt="404- page not found"
          height={600}
          width={800}
        />
      </div>
    </div>
  );
}

export default Page404;
