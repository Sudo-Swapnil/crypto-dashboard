import React from "react";

const Change = ({data }) => {
  return (
    <span
    className={`text-lg font-semibold px-1 rounded-lg flex items-center ${
      data >= 0
        ? "custom-green custom-bg-green"
        : "custom-red custom-bg-red"
    }`}
  >
    {data >= 0 ? (
      <img
        src="/icons/up.svg"
        alt="Up Icon"
        className="w-4 h-4 mr-1"
      />
    ) : (
      data < 0 && (
        <img
          src="/icons/down.svg"
          alt="Down Icon"
          className="w-4 h-4 mr-2"
        />
      )
    )}
    {data >= 0
      ? data.toFixed(2) + "%"
      : data !== 0
      ? Math.abs(data).toFixed(2) + "%"
      : ""}
  </span>
  );
};

export default Change;