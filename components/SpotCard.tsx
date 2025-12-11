import React from 'react';
import { SpotRecommendation } from '../types';
import { MapPinIcon, ArrowRightIcon } from './Icons';

interface SpotCardProps {
  spot: SpotRecommendation;
  delay: number;
}

const SpotCard: React.FC<SpotCardProps> = ({ spot, delay }) => {
  return (
    <div 
      className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all duration-300 backdrop-blur-sm animate-fade-in-up flex flex-col justify-between"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-semibold text-white group-hover:text-orange-300 transition-colors">
            {spot.name}
          </h4>
          <span className="flex items-center text-xs font-medium text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
            ★ {spot.rating}
          </span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          {spot.description}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <MapPinIcon className="w-3 h-3" />
          {spot.distance || 'Nearby'}
        </span>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name)}`} 
          target="_blank" 
          rel="noreferrer"
          className="text-xs text-orange-300 flex items-center gap-1 hover:underline"
        >
          View on Maps <ArrowRightIcon className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default SpotCard;