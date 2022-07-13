import { FC, ReactNode } from "react";

import "./index.module.scss";

const Collapse: FC<{
  isOpened: boolean;
  children: ReactNode;
}> = ({ isOpened, children }) => {
  return isOpened ? (
    <div className="uid-collapse-container">{children}</div>
  ) : (
    <div></div>
  );
};

export default Collapse;
