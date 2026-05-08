import React from 'react';

const Skeleton = ({ className }) => {
    return (
        <div className={`skeleton rounded-xl ${className}`}></div>
    );
};

export const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden p-0">
        <Skeleton className="aspect-[4/5] w-full rounded-none" />
        <div className="p-5 space-y-3">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
        </div>
    </div>
);

export default Skeleton;
