import React from "react";
import { Link } from "react-router-dom";
import StarBorder from "../../components/atoms/starBorder";
import notFoundImage from "../../images/404.gif";

const NotFound = () => {
  return (
    <div className="h-screen w-screen bg-white flex items-center justify-center flex-col">
      <img src={notFoundImage} alt="" />
      <StarBorder as="button" className="-mt-16" color="red" speed="1s">
        <Link to="/">Lost in Cyberspace?, Go Back ❗</Link>
      </StarBorder>
    </div>
  );
};

export default NotFound;
