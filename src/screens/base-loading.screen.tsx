import React from "react";
import LoadingSpinner from "../components/loading-spiner";

export const BaseLoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen w-full py-[50px] flex justify-center items-center">
      <LoadingSpinner width={10} height={10} />
    </div>
  );
};
