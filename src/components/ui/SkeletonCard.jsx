'use client'

import Card from './Card'

const SkeletonCard = ({length, className = "" }) => {
  return (
    <div className={`container mx-auto px-4 mt-2 `}>
      <div className="flex justify-center flex-wrap gap-6">
        {Array.from({ length }).map((_, index) => (
          <Card key={index} className={`bg-white w-full  sm:w-[220px] md:min-w-[200px] md:min-w-[250px] lg:min-w-[300px] ${className} rounded-lg border border-[#e8e8e8] overflow-hidden`}>
            {/* Image skeleton */}
            
            <div className="w-full h-48 bg-gray-200 animate-pulse p-0"></div>
            {/* Content skeleton */}
            <div className="p-6">
              {/* Title skeleton */}
              <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse w-3/4"></div>
              {/* Description skeleton */}
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SkeletonCard;

