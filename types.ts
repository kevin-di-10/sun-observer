export interface GeoLocation {
  lat: number;
  lng: number;
}

export type LocationInput = 
  | { type: 'coords'; lat: number; lng: number }
  | { type: 'text'; query: string };

export interface SpotRecommendation {
  name: string;
  description: string;
  distance?: string; // e.g. "5km away"
  rating: string; // e.g., "4.8/5"
}

export interface SunPhaseData {
  time: string;
  qualityScore: number; // 0-100
  qualityDescription: string; // "Perfect conditions", "Cloudy but possible color"
  advice: string; // "Arrive 20 mins early for blue hour..."
  spots: SpotRecommendation[];
}

export interface WeatherCondition {
  temp: string;
  condition: string;
  cloudCover: string;
  visibility: string;
}

export interface SunDataResponse {
  locationName: string;
  date: string;
  weather: WeatherCondition;
  sunrise: SunPhaseData;
  sunset: SunPhaseData;
  goldenHourMorning: string;
  goldenHourEvening: string;
  sources?: Array<{ title: string; uri: string }>;
}

export enum AppState {
  IDLE,
  LOCATING,
  FETCHING_DATA,
  SUCCESS,
  ERROR,
}