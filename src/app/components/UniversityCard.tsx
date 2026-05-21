import { Link } from "react-router";
import { Star, MapPin, Target, CheckCircle2, AlertCircle } from "lucide-react";
import { calculateMatch, userProfile } from "../data";

interface University {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewsCount: number;
  tuition: string;
  students: string;
  image: string;
  majors: any[];
}

interface Props {
  university: University;
  isSaved?: boolean;
  onToggleSave?: (id: string, e: React.MouseEvent) => void;
}

export function UniversityCard({ university, isSaved = false, onToggleSave }: Props) {
  const matchData = calculateMatch(university, userProfile);
  
  // Color code the match badge
  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700 ring-green-600/20";
    if (score >= 50) return "bg-yellow-100 text-yellow-700 ring-yellow-600/20";
    return "bg-gray-100 text-gray-700 ring-gray-600/20";
  };

  return (
    <Link to={`/university/${university.id}`} className="group flex flex-col h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-indigo-200">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 shrink-0">
        <img
          src={university.image}
          alt={university.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Match Score Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur-md">
          <Target size={14} className={matchData.score >= 80 ? "text-green-600" : "text-indigo-600"} />
          <span className={matchData.score >= 80 ? "text-green-700" : "text-gray-900"}>
            {matchData.score}% Match
          </span>
        </div>

        {onToggleSave && (
          <button
            onClick={(e) => onToggleSave(university.id, e)}
            className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-gray-600 shadow-sm backdrop-blur-md transition-colors hover:text-red-500 hover:bg-white z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isSaved ? "text-red-500" : ""}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 line-clamp-1">{university.name}</h3>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="mr-1.5 h-4 w-4 shrink-0" />
          <span className="truncate">{university.location}</span>
        </div>
        
        {/* Personalized Analytics based on profile */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex-1 flex flex-col justify-end">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Personalized Fit</div>
          <div className="space-y-2">
            {matchData.insights.map((insight, idx) => (
              <div key={idx} className="flex items-start text-xs text-gray-600 leading-tight">
                {insight.isPositive ? (
                  <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500" />
                ) : (
                  <AlertCircle className="mr-2 h-4 w-4 shrink-0 text-amber-500" />
                )}
                <span>{insight.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* General Stats at the bottom */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-gray-900">{university.rating}</span>
            <span>({university.reviewsCount})</span>
          </div>
          <div className="truncate max-w-[50%]">{university.tuition}</div>
        </div>
      </div>
    </Link>
  );
}