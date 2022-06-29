import {
  CSSProperties,
  ReactNode,
  FC,
  useState,
  useEffect,
  MouseEventHandler,
} from "react";

import classnames from "classnames";

import styles from "./index.module.scss";

export interface ButtonProps {
  text?: string;
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
  textClassName?: string;
  containerStyle?: CSSProperties;
  textStyle?: CSSProperties;
  disabled?: boolean | false;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  id?: string;
  children?: ReactNode;
}

const Button: FC<ButtonProps> = ({
  type,
  className,
  textClassName,
  containerStyle,
  textStyle,
  disabled,
  onClick,
  id,
  text,
  children,
}) => {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 300);
    } else {
      setIsRippling(false);
    }
  }, [coords]);

  useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 });
  }, [isRippling]);

  return (
    <button
      id={id}
      type={type}
      style={containerStyle}
      className={classnames(
        className,
        "rounded-[3px] py-[10px] px-[30px]",
        styles["ripple-button"],
        { "bg-[#b8b8b8]": disabled }
      )}
      disabled={disabled}
      onClick={(e) => {
        const rect = (e?.target as any)?.getBoundingClientRect();
        setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        onClick && onClick(e);
      }}
    >
      {isRippling ? (
        <span
          className={styles.ripple}
          style={{
            left: coords.x,
            top: coords.y,
          }}
        />
      ) : (
        ""
      )}
      {children && children}
      {text && (
        <span
          className={classnames(textClassName, "text-[14px]")}
          style={textStyle}
        >
          {text}
        </span>
      )}
    </button>
  );
};

export default Button;

export interface PolygonButtonProps extends ButtonProps {
  boxClassName?: string;
  boxStyle?: CSSProperties;
}

export const PolygonButton: FC<PolygonButtonProps> = ({
  type,
  boxClassName,
  boxStyle,
  className,
  textClassName,
  containerStyle,
  textStyle,
  disabled,
  onClick,
  children,
  id,
  text,
}) => {
  return (
    <div
      style={boxStyle}
      className={classnames("box-pp", "min-w-[250px] md:min-w-0", boxClassName)}
    >
      <button
        id={id}
        type={type}
        style={containerStyle}
        disabled={disabled}
        onClick={onClick}
        className={classnames("box-pp-chil", className)}
      >
        {text && (
          <span className={textClassName} style={textStyle}>
            {text}
          </span>
        )}
        {children && children}
      </button>
    </div>
  );
};
