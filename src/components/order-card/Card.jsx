import React from "react";

const Card = ({ title, Icon, quantity, className }) => {
  return (
    <div className="flex h-full">
      <div className="flex items-center w-full rounded-xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow gap-4">
        <div
          className={`flex items-center justify-center rounded-xl h-12 w-12 text-xl flex-shrink-0 ${className}`}
        >
          <Icon />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium leading-none mb-1.5">{title}</p>
          <p className="text-2xl font-bold text-gray-800 leading-none">{quantity ?? 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
