import React from "react";
import styles from "./index.module.scss";
import cx from "classnames";

interface ButtonProps {
  outline?: boolean; // Make outline optional
  children: React.ReactNode;
  customStyling?: string; // Make customStyling optional
  ariaLabel?: string; // New prop for ARIA label
  [x: string]: any; // Allow any other props
}

const Button: React.FC<ButtonProps> = ({
  outline = false, // Default value for outline
  children,
  customStyling = "", // Default value for customStyling
  ariaLabel,
  ...otherProps
}) => {
  return (
    <button
      className={cx(
        styles.button, // Add base button styles
        {
          [styles.outline]: outline,
          [styles.filled]: !outline,
        },
        customStyling
      )}
      aria-label={ariaLabel}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
