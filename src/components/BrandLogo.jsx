export const BrandLogo = ({ className = "", dark = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/tr-logo.png" 
        alt="TR Traders Logo" 
        className="h-10 w-auto object-contain shrink-0 p-1 bg-[#0D1B38] rounded-md"
      />
      
      {/* Text Wordmark */}
      <div className="flex flex-col justify-center leading-none">
        <span className={`font-serif text-xl md:text-2xl font-bold tracking-widest uppercase ${dark ? 'text-white' : 'text-text'}`}>
          TR Traders
        </span>
      </div>
    </div>
  );
};
