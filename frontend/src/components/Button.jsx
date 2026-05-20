const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`btn-primary inline-flex items-center justify-center font-semibold ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
