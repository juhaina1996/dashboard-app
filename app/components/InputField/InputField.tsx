import React from "react";
import styles from "./InputField.module.scss";

interface InputFieldProps {
  type: string; // Specifies the type of the input (e.g., text, number)
  value: string; // Sets the value of the input field
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Event handler for input value changes
  ariaLabel?: string; // Accessibility label for the input field (optional)
  step?: string; // Specifies the step size for numeric input fields (optional)
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  value,
  onChange,
  ariaLabel,
  step,
}) => (
  <div className={styles.inputBox}>
    <input
      className={styles.input}
      type={type}
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      step={step}
    />
  </div>
);

export default InputField;
