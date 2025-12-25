import React from "react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  className = "",
  loading = false,
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={loading || props.disabled}
      className={`w-full py-2 rounded-lg bg-blue-600 text-white font-semibold text-base shadow transition-colors
        ${loading || props.disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700 cursor-pointer"}
        ${className}`}
      {...props}
    >
      {loading ? "Chargement..." : children}
    </button>
  );
};

export default PrimaryButton;
