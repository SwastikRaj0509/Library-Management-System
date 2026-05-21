const Card = ({ children }) => {

  return (

    <div className="
      bg-white/5
      backdrop-blur-2xl
      border
      border-white/10
      rounded-[32px]
      p-10
      shadow-[0_0_40px_rgba(0,255,255,0.08)]
    ">

      {children}

    </div>
  );
};

export default Card;