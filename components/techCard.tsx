// components/TechCard.tsx
import React from 'react';
import Image from 'next/image';

interface TechCardProps {
  title: string;
  image: string;
  description: string;
  rating: number;
}

const TechCard: React.FC<TechCardProps> = ({ title, image, description, rating }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 max-w-sm">
      <Image src={image} alt={title} width={300} height={200} className="rounded-t-lg" />
      <div className="p-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
        <p className="text-yellow-500">Rating: {rating}⭐</p>
      </div>
    </div>
  );
};

export default TechCard;