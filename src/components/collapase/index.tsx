import React from "react";

const Collapse: React.FC<{
  isOpened: boolean;
  children: React.ReactNode;
}> = ({ isOpened, children }) => {
  return isOpened ? (
    <div className="uid-collapse-container">{children}</div>
  ) : (
    <div></div>
  );
};

export default Collapse;
