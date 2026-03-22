const SkeletonLoader = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="flex flex-col bg-surface border border-border rounded-xl overflow-hidden animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="aspect-[4/5] bg-gray-200"></div>
          
          {/* Content Placeholder */}
          <div className="p-5 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="flex justify-between items-center gap-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
