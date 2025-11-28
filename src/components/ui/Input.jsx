'use client'

const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f0a647] focus:border-transparent ${className}`}
      {...props}
    />
  );
};

export default Input;

