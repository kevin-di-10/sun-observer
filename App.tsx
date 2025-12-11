import React, { useState } from 'react';
import { fetchSunData } from './services/geminiService';
import { SunDataResponse, AppState, LocationInput } from './types';
import SunDashboard from './components/SunDashboard';
import { MapPinIcon, CalendarIcon, SearchIcon } from './components/Icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [data, setData] = useState<SunDataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Search State
  const [manualLocation, setManualLocation] = useState("");
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const executeSearch = async (location: LocationInput) => {
    setAppState(AppState.FETCHING_DATA);
    setError(null);
    try {
      const result = await fetchSunData(location, date);
      setData(result);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sun data");
      setAppState(AppState.ERROR);
    }
  };

  const handleSearch = () => {
    if (manualLocation.trim()) {
      executeSearch({ type: 'text', query: manualLocation });
    } else {
      handleLocate();
    }
  };

  const handleLocate = () => {
    setAppState(AppState.LOCATING);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setAppState(AppState.ERROR);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        executeSearch({ 
          type: 'coords', 
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        });
      },
      (err) => {
        setError("Unable to retrieve your location. Please enter a city manually.");
        setAppState(AppState.ERROR);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const resetSearch = () => {
    setAppState(AppState.IDLE);
    setData(null);
  };

  // Background style
  const bgGradient = "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black";

  return (
    <div className={`min-h-screen text-slate-100 ${bgGradient} selection:bg-orange-500/30`}>
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="font-bold text-2xl tracking-tighter flex items-center gap-2 cursor-pointer" onClick={resetSearch}>
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500"></div>
          Horizon
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        
        {/* IDLE State - Hero & Search */}
        {appState === AppState.IDLE && (
          <div className="text-center px-6 max-w-2xl animate-fade-in-up w-full">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-200 via-orange-100 to-indigo-200 mb-6 pb-2">
              Chase the Light.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
              Discover the perfect time and place for sunrise and sunset. 
              Search any location or date to get historical insights and future forecasts.
            </p>
            
            {/* Search Box */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-2xl max-w-lg mx-auto flex flex-col gap-2 shadow-2xl">
               {/* Location Input */}
               <div className="relative group">
                 <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-400 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Current Location (Leave empty for GPS)" 
                   value={manualLocation}
                   onChange={(e) => setManualLocation(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                   className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                 />
               </div>
               
               <div className="flex gap-2">
                 {/* Date Input */}
                 <div className="relative flex-1 group">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-400 transition-colors pointer-events-none" />
                    <input 
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all [color-scheme:dark]" 
                    />
                 </div>
                 
                 {/* Submit Button */}
                 <button
                   onClick={handleSearch}
                   disabled={appState === AppState.LOCATING}
                   className="bg-white text-slate-900 px-6 rounded-xl font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center disabled:opacity-50"
                 >
                   <SearchIcon className="w-5 h-5" />
                 </button>
               </div>
            </div>
            
            <div className="mt-4 text-xs text-slate-500">
               {manualLocation ? "Searching by location name" : "Will use your current GPS location"} • Supports historical dates
            </div>
          </div>
        )}

        {/* LOADING States */}
        {(appState === AppState.LOCATING || appState === AppState.FETCHING_DATA) && (
          <div className="flex flex-col items-center justify-center space-y-6 animate-pulse">
             <div className="relative">
               <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-2 h-2 bg-orange-200 rounded-full"></div>
               </div>
             </div>
             <p className="text-slate-400 font-medium">
                {appState === AppState.LOCATING ? "Locating you..." : `Analyzing sky conditions for ${date}...`}
             </p>
          </div>
        )}

        {/* ERROR State */}
        {appState === AppState.ERROR && (
          <div className="text-center px-6 max-w-md">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={resetSearch}
              className="text-sm font-medium text-orange-400 hover:text-orange-300 underline underline-offset-4"
            >
              Try Again
            </button>
          </div>
        )}

        {/* SUCCESS State - Dashboard */}
        {appState === AppState.SUCCESS && data && (
          <SunDashboard data={data} onBack={resetSearch} />
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} Horizon App. Powered by Gemini.</p>
      </footer>
      
      {/* Global CSS injection for simple animations */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;