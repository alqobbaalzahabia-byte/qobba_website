'use client'

const Card = ({ className = "", children, ...props }) => {
  return (
    <div className={`rounded-xl bg-white shadow ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;

