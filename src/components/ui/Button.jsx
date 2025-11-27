'use client'

const Button = ({ variant = "default", className = "", children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    default: "",
    outline: "bg-transparent border hover:bg-opacity-10",
    ghost: " hover:bg-opacity-10"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

