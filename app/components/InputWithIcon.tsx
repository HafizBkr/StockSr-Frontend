import React from "react";

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  label,
  icon,
  rightIcon,
  containerClassName = "",
  ...inputProps
}) => {
  return (
    <div className={containerClassName}>
      <label
        htmlFor={inputProps.id}
        className="block mb-1 text-sm font-medium text-gray-800"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
          {icon}
        </span>
        <input
          {...inputProps}
          className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black placeholder-gray-400 bg-white ${inputProps.className || ""}`}
        />
        {rightIcon && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
            {rightIcon}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputWithIcon;
