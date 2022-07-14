import { FC, useState } from "react";
import classnames from "classnames";

import BrownClose from "../../assets/images/brown-close.png";
import Warning from "../../assets/images/warn.png";

export const Notification: FC<{
  title: string;
  description: string;
  type: "info" | "warn";
}> = (props) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className={classnames(
        "flex flex-col w-full bg-[#5537004d] p-[10px] rounded-[8px] text-[11px]",
        props.type === "warn" ? "text-[#b57b0ff5]" : ""
      )}
    >
      <div className={"flex flex-row"}>
        <div className={"flex-1 mr-[5px]"}>
          <img src={Warning} className={"h-[14px] w-[14px]"} />
        </div>
        <div className={"flex-col flex-[10] w-full"}>
          <div className={"flex flex-row w-full"}>
            <div className={"flex-[10]"}>
              <div className={"font-bold"}>{props.title}</div>
            </div>
            <div
              className={"flex-1 cursor-pointer"}
              onClick={() => setIsOpen(false)}
            >
              <img
                src={BrownClose}
                className={"float-right h-[11px] w-[11px]"}
              />
            </div>
          </div>
          <div className={"flex-1"}>
            <div>{props.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
