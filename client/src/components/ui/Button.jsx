const Button = ({ children, type = "button" }) => {
  return (
    <button
      type={type}
      className="
        w-full
        py-3
        rounded-xl
        bg-gradient-to-r
        from-cyan-500
        to-purple-600
        hover:scale-105
        transition-all
        duration-300
        font-semibold
        shadow-lg
        shadow-cyan-500/20
      "
    >
      {children}
    </button>
  );
};

export default Button;