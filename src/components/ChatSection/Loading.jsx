import React from 'react';

const LoadingComponent = ({ percentage }) => {
  return (
    <div className="relative h-8 w-full bg-gray-200 rounded-full overflow-hidden">
      {/* Line bar */}
      <div
        className="absolute top-0 left-0 h-full bg-blue-500"
        style={{ width: `${percentage}%` }}
      ></div>
      {/* Tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-2 bg-gray-800 text-white px-2 py-1 rounded-md text-xs">
        {percentage}%
      </div>
    </div>
  );
};

export default LoadingComponent;
