import React from "react";
import { Link } from "react-router-dom";

const BreadCrumbs = ({ breadcrumbs }) => {
  return (
    <div className="breadcrumbs text-sm mb-6">
      <ul className="flex items-center space-x-2 text-base">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            {index < breadcrumbs.length - 1 ? ( // Jika bukan item terakhir
              <Link to={breadcrumb.link}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  ></path>
                </svg>
                <h1 className="ml-1">{breadcrumb.name}</h1>
              </Link>
            ) : (
              // Jika item terakhir
              <span className="inline-flex items-center gap-2 text-[#8b5cf6]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <h1>{breadcrumb.name}</h1>
              </span>
            )}
            {index < breadcrumbs.length - 1 && <span></span>} {/* Separator */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BreadCrumbs;
