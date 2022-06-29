import { FC, ReactNode } from "react";

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
