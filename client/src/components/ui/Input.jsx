const Input = ({
  type,
  placeholder,
  value,
  onChange
}) => {

  return (

    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full
        p-4
        rounded-2xl
        bg-white/5
        border
        border-white/10
        text-white
        placeholder-gray-500
        outline-none
        focus:border-cyan-400
        focus:shadow-[0_0_15px_rgba(34,211,238,0.4)]
        transition-all
      "
    />

  );
};

export default Input;