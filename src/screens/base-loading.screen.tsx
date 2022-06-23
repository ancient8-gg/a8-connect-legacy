import React from "react";
import LoadingSpinner from "../components/loading-spiner";

export const BaseLoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen w-full py-[50px] flex justify-center items-center">
      <LoadingSpinner width={40} height={40} />
    </div>
  );
};
