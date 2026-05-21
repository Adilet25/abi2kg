import { useState, useMemo } from "react";
import { Search, Filter, SlidersHorizontal, MapPin, GraduationCap, DollarSign, Target, Trophy, ArrowRight } from "lucide-react";
import { universities, userProfile } from "../data";
import { UniversityCard } from "../components/UniversityCard";
import { Link } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";

export function Home() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMajors, setActiveMajors] = useState<string[]>([]);
  const [activeLocations, setActiveLocations] = useState<string[]>([]);
  const [budgetFilter, setBudgetFilter] = useState<number>(5000);
  const [ortScoreFilter, setOrtScoreFilter] = useState<number | "">(userProfile.ortScore || "");
  const [savedUnis, setSavedUnis] = useState<Set<string>>(new Set(userProfile.savedUniversities));

  const allMajors = useMemo(() => {
    const majors = new Set<string>();
    universities.forEach(u => u.majors.forEach(m => majors.add(m.name)));
    return Array.from(majors).sort();
  }, []);

  const allLocations = useMemo(() => {
    const locations = new Set<string>();
    universities.forEach(u => locations.add(u.location));
    return Array.from(locations).sort();
  }, []);

  const toggleMajor = (major: string) => {
    setActiveMajors(prev => 
      prev.includes(major) ? prev.filter(m => m !== major) : [...prev, major]
    );
  };

  const toggleLocation = (location: string) => {
    setActiveLocations(prev => 
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSavedUnis(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveMajors([]);
    setActiveLocations([]);
    setBudgetFilter(5000);
    setOrtScoreFilter("");
  };

  const filteredUniversities = universities.filter(uni => {
    // 1. Search Query
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          uni.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Majors
    const matchesMajors = activeMajors.length === 0 || 
                          uni.majors.some(m => activeMajors.includes(m.name));

    // 3. Locations
    const matchesLocations = activeLocations.length === 0 || 
                             activeLocations.includes(uni.location);

    // 4. Budget (parse tuition string to number)
    const tuitionVal = parseInt(uni.tuition.replace(/[^0-9]/g, ''), 10) || 0;
    const matchesBudget = tuitionVal <= budgetFilter;

    // 5. ORT Score (ensure user has enough score for the uni, if they provided one)
    const matchesOrt = ortScoreFilter === "" || typeof uni.minOrtScore === 'undefined' || Number(ortScoreFilter) >= uni.minOrtScore;

    return matchesSearch && matchesMajors && matchesLocations && matchesBudget && matchesOrt;
  });

  const topRanked = useMemo(() => {
    return [...universities].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-indigo-900 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('findPerfectFit')}
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            {t('heroDesc')}
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mt-10">
            <div className="flex items-center overflow-hidden rounded-full bg-white p-1.5 shadow-xl">
              <div className="pointer-events-none pl-5 text-gray-400">
                <Search size={22} />
              </div>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full border-0 bg-transparent px-5 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="hidden sm:block rounded-full bg-indigo-600 px-8 py-3.5 font-bold text-white transition-colors hover:bg-indigo-700">
                {t('searchButton')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72 shrink-0 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <SlidersHorizontal size={20} className="text-indigo-600" />
                  <h3>{t('filters')}</h3>
                </div>
                {(activeMajors.length > 0 || activeLocations.length > 0 || budgetFilter < 5000 || ortScoreFilter !== "") && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {t('clearAll')}
                  </button>
                )}
              </div>
              
              <div className="space-y-8">
                
                {/* ORT Score Filter */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target size={16} className="text-gray-400" /> {t('myOrtScore')}
                  </h4>
                  <input
                    type="number"
                    min="0"
                    max="245"
                    placeholder="Out of 245"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={ortScoreFilter}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val !== "" && parseInt(val, 10) > 245) val = "245";
                      if (val !== "" && parseInt(val, 10) < 0) val = "0";
                      setOrtScoreFilter(val);
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">Shows universities within your score range.</p>
                </div>

                <hr className="border-gray-100" />

                {/* Budget Filter */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" /> {t('maxBudget')}
                    </div>
                    <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded text-xs">
                      ${budgetFilter.toLocaleString()}
                    </span>
                  </h4>
                  <input
                    type="range"
                    min="1000"
                    max="5000"
                    step="500"
                    value={budgetFilter}
                    onChange={(e) => setBudgetFilter(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <hr className="border-gray-100" />

                {/* Locations Filter */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" /> {t('locations')}
                  </h4>
                  <div className="space-y-2.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {allLocations.map(location => (
                      <label key={location} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            className="peer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                            checked={activeLocations.includes(location)}
                            onChange={() => toggleLocation(location)}
                          />
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-1" title={location}>
                          {location}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Majors Filter */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <GraduationCap size={16} className="text-gray-400" /> {t('majors')}
                  </h4>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {allMajors.map(major => (
                      <label key={major} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            className="peer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                            checked={activeMajors.includes(major)}
                            onChange={() => toggleMajor(major)}
                          />
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{major}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredUniversities.length} {filteredUniversities.length === 1 ? t('uniFound') : t('unisFound')}
              </h2>
            </div>
            
            {filteredUniversities.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredUniversities.map((uni) => (
                  <UniversityCard 
                    key={uni.id} 
                    university={uni} 
                    isSaved={savedUnis.has(uni.id)}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                  <Filter size={32} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{t('noUnis')}</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">We couldn't find any universities matching your current filters. Try adjusting your search or clearing your filters.</p>
                <button 
                  onClick={clearAllFilters}
                  className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-50 px-6 py-2.5 font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  {t('clearAll')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}