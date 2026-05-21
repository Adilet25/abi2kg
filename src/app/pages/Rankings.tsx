import { useMemo } from "react";
import { Link } from "react-router";
import { universities } from "../data";
import { Trophy, Star, Users, DollarSign } from "lucide-react";

export function Rankings() {
  const rankedUniversities = useMemo(() => {
    return [...universities].sort((a, b) => b.rating - a.rating);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-indigo-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-yellow-400/20 rounded-full inline-block">
              <Trophy className="text-yellow-400" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Global University Rankings
          </h1>
          <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto">
            Discover the top-rated institutions based on student satisfaction, outcomes, and academic excellence.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-5xl">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-gray-100">
            {rankedUniversities.map((uni, index) => (
              <div key={uni.id} className="p-6 hover:bg-gray-50 transition-colors sm:flex items-center gap-6">
                
                {/* Rank Number */}
                <div className="hidden sm:flex shrink-0 w-16 flex-col items-center justify-center">
                  <span className={`text-3xl font-black ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-300'}`}>
                    #{index + 1}
                  </span>
                </div>

                {/* Mobile Rank + Image */}
                <div className="flex items-center gap-4 mb-4 sm:mb-0 shrink-0">
                  <span className={`sm:hidden text-2xl font-black ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-300'}`}>
                    #{index + 1}
                  </span>
                  <img src={uni.image} alt={uni.name} className="w-20 h-20 rounded-xl object-cover border border-gray-100 shadow-sm" />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{uni.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{uni.location}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-400" size={16} />
                      <div>
                        <div className="text-sm font-bold text-gray-900">{uni.rating}</div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="text-indigo-400" size={16} />
                      <div>
                        <div className="text-sm font-bold text-gray-900">{uni.acceptanceRate}</div>
                        <div className="text-xs text-gray-500">Acceptance</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-emerald-500" size={16} />
                      <div>
                        <div className="text-sm font-bold text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap" title={uni.tuition}>{uni.tuition.split(' ')[0]}</div>
                        <div className="text-xs text-gray-500">Tuition</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-6 sm:mt-0 shrink-0">
                  <Link 
                    to={`/university/${uni.id}`}
                    className="block w-full sm:w-auto text-center px-6 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    View Details
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}