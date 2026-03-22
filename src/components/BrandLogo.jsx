export const BrandLogo = ({ className = "", dark = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/images/svg-logo.png" 
        alt="SVG Logo" 
        className="h-10 w-auto object-contain shrink-0 p-1 bg-[#0D1B38] rounded-md"
      />
      
      {/* Text Wordmark */}
      <div className="flex flex-col justify-center leading-none">
        <span className={`font-serif text-xl md:text-2xl font-bold tracking-widest uppercase ${dark ? 'text-white' : 'text-primary'}`}>
          SVG
        </span>
      </div>
    </div>
  );
};
