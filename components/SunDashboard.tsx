import React, { useState } from 'react';
import { SunDataResponse } from '../types';
import { SunIcon, MoonIcon, CameraIcon, CloudIcon, MapPinIcon, ArrowLeftIcon } from './Icons';
import SpotCard from './SpotCard';

interface SunDashboardProps {
  data: SunDataResponse;
  onBack: () => void;
}

type Tab = 'sunrise' | 'sunset';

const SunDashboard: React.FC<SunDashboardProps> = ({ data, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('sunset'); // Default to sunset as it's often more planned

  const activeData = activeTab === 'sunrise' ? data.sunrise : data.sunset;
  const isSunrise = activeTab === 'sunrise';

  // Helper to determine score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/20 border-emerald-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-12 animate-fade-in relative">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-4 md:left-0 p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
        aria-label="Back to search"
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>

      {/* Header Info */}
      <header className="mb-8 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-slate-300 mb-2 border border-white/5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          AI Weather Analysis
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
          {data.locationName}
        </h1>
        <p className="text-slate-400 text-sm md:text-base">{data.date}</p>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Weather Brief */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Condition</p>
              <div className="flex items-center gap-2">
                <CloudIcon className="w-5 h-5 text-sky-400" />
                <span className="text-xl font-medium text-white">{data.weather.condition}</span>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                Cloud Cover: <span className="text-slate-300">{data.weather.cloudCover}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Temp</p>
              <span className="text-3xl font-light text-white">{data.weather.temp}</span>
            </div>
        </div>

        {/* Golden Hour */}
        <div className="bg-gradient-to-br from-orange-500/10 to-purple-600/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
           <div className="flex justify-between items-end">
             <div>
               <p className="text-orange-300 text-xs uppercase tracking-wider font-semibold mb-1">Golden Hour</p>
               <p className="text-white text-lg">
                 <span className="text-slate-400 text-xs">AM: </span>{data.goldenHourMorning}
               </p>
               <p className="text-white text-lg">
                 <span className="text-slate-400 text-xs">PM: </span>{data.goldenHourEvening}
               </p>
             </div>
             <CameraIcon className="w-8 h-8 text-orange-400 opacity-50" />
           </div>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900/50 p-1 rounded-full border border-white/10 flex relative">
          <button
            onClick={() => setActiveTab('sunrise')}
            className={`relative z-10 px-8 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isSunrise ? 'text-white bg-slate-700 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <SunIcon className="w-4 h-4" /> Sunrise
          </button>
          <button
            onClick={() => setActiveTab('sunset')}
            className={`relative z-10 px-8 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              !isSunrise ? 'text-white bg-slate-700 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MoonIcon className="w-4 h-4" /> Sunset
          </button>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="relative overflow-hidden bg-slate-800/30 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            
            {/* Score Circle */}
            <div className="flex-shrink-0 flex flex-col items-center">
               <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center ${getScoreBg(activeData.qualityScore)} backdrop-blur-sm`}>
                 <span className={`text-4xl font-bold ${getScoreColor(activeData.qualityScore)}`}>
                   {activeData.qualityScore}
                 </span>
                 <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Quality</span>
               </div>
               <div className="mt-4 text-center">
                 <div className="text-2xl font-bold text-white">{activeData.time}</div>
                 <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">
                   {isSunrise ? 'Sunrise' : 'Sunset'} Time
                 </div>
               </div>
            </div>

            {/* Verdict & Advice */}
            <div className="flex-grow text-center md:text-left">
              <h3 className={`text-xl font-semibold mb-2 ${getScoreColor(activeData.qualityScore)}`}>
                {activeData.qualityDescription}
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                {activeData.advice}
              </p>
              
              <div className="inline-block bg-indigo-500/20 border border-indigo-500/30 rounded-lg p-4">
                <h4 className="flex items-center gap-2 text-indigo-300 text-sm font-semibold mb-1">
                  <CameraIcon className="w-4 h-4" />
                  Photography Tip
                </h4>
                <p className="text-indigo-100 text-xs opacity-80">
                  {isSunrise 
                    ? "Arrive 30 mins early for the blue hour. Use a tripod for lower ISO." 
                    : "Stay 20 mins after the sun dips for the most vibrant twilight colors."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <MapPinIcon className="w-5 h-5 text-orange-400" />
        Recommended {isSunrise ? 'Sunrise' : 'Sunset'} Spots
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {activeData.spots.map((spot, index) => (
          <SpotCard key={`${spot.name}-${index}`} spot={spot} delay={index * 100} />
        ))}
      </div>

      {/* Sources Footer */}
      {data.sources && data.sources.length > 0 && (
        <div className="border-t border-white/5 pt-6 mt-8">
          <p className="text-xs text-slate-500 mb-2">Information grounded by Google Search:</p>
          <div className="flex flex-wrap gap-2">
            {data.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-slate-400 hover:text-orange-400 truncate max-w-[200px] transition-colors"
              >
                {source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SunDashboard;