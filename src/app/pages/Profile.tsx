import { useState } from "react";
import { useSearchParams } from "react-router";
import { userProfile, universities } from "../data";
import { UniversityCard } from "../components/UniversityCard";
import { Settings, Bookmark, GraduationCap, MapPin, Target, Heart, Languages } from "lucide-react";

export function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "preferences";
  
  const savedUnisData = universities.filter(u => userProfile.savedUniversities.includes(u.id));
  
  // Create a combined state for academics and preferences
  const [profileData, setProfileData] = useState({
    ortScore: userProfile.ortScore.toString(),
    gpa: userProfile.gpa.toString(),
    budget: userProfile.preferences.budget,
    city: userProfile.preferences.city,
    targetField: userProfile.preferences.targetField,
    interests: userProfile.preferences.interests.join(", "),
    languages: userProfile.preferences.languages.join(", "),
  });

  const tabs = [
    { id: "preferences", name: "My Information", icon: Settings },
    { id: "saved", name: "Saved Universities", icon: Bookmark },
  ];

  const handleTabChange = (id: string) => {
    setSearchParams({ tab: id });
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    alert("Profile information saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-10 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name} 
              className="h-24 w-24 rounded-full object-cover shadow-md border-4 border-white"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{userProfile.name}</h1>
              <p className="text-lg text-gray-500 mt-1">{userProfile.email}</p>
            </div>
            <div className="sm:ml-auto flex gap-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 text-center">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">ORT Score</div>
                <div className="text-xl font-black text-indigo-700">{profileData.ortScore || "0"}<span className="text-sm font-medium text-indigo-400">/245</span></div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 text-center">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">GPA</div>
                <div className="text-xl font-black text-indigo-700">{profileData.gpa ? parseFloat(profileData.gpa).toFixed(1) : "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 -mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col space-y-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-indigo-700" : "text-gray-400"} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            
            {activeTab === "preferences" && (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-6 sm:px-8 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-2xl font-bold text-gray-900">Your Information</h2>
                  <p className="mt-1 text-gray-500">Update your academic details and preferences to get better matches.</p>
                </div>
                
                <form onSubmit={handleSavePreferences} className="p-6 sm:p-8 space-y-10">
                  
                  {/* Academic Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <GraduationCap className="text-indigo-600" size={20} /> Academic Profile
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ORT Score (Max 245)</label>
                        <input
                          type="number"
                          min="0"
                          max="245"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          value={profileData.ortScore}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (val !== "" && parseInt(val, 10) > 245) val = "245";
                            if (val !== "" && parseInt(val, 10) < 0) val = "0";
                            setProfileData({...profileData, ortScore: val});
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GPA <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input
                          type="number"
                          min="0"
                          max="4"
                          step="0.01"
                          placeholder="e.g. 3.8"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          value={profileData.gpa}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (val !== "" && parseFloat(val) > 4) val = "4";
                            if (val !== "" && parseFloat(val) < 0) val = "0";
                            setProfileData({...profileData, gpa: val});
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Target Preferences Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <Target className="text-indigo-600" size={20} /> Target Preferences
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Field / Major</label>
                        <input
                          type="text"
                          placeholder="e.g. Computer Science"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          value={profileData.targetField}
                          onChange={(e) => setProfileData({...profileData, targetField: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                          <MapPin size={16} className="text-gray-400" /> Preferred City
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. San Francisco"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          value={profileData.city}
                          onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Maximum Annual Budget</label>
                      <div className="mt-2 flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <input
                          type="range"
                          min="10000"
                          max="80000"
                          step="1000"
                          value={profileData.budget}
                          onChange={(e) => setProfileData({...profileData, budget: parseInt(e.target.value)})}
                          className="w-full max-w-md accent-indigo-600"
                        />
                        <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded shadow-sm border border-gray-200">${profileData.budget.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <Heart className="text-indigo-600" size={20} /> About You
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interests (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Technology, Art, Traveling..."
                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        value={profileData.interests}
                        onChange={(e) => setProfileData({...profileData, interests: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                        <Languages size={16} className="text-gray-400" /> Languages Spoken (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. English, Spanish..."
                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        value={profileData.languages}
                        onChange={(e) => setProfileData({...profileData, languages: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <button type="submit" className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
                      Save All Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "saved" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-6 border-b border-gray-100 pb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Saved Universities</h2>
                    <p className="mt-1 text-gray-500">Keep track of the schools you are interested in.</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                    {savedUnisData.length} saved
                  </span>
                </div>
                
                {savedUnisData.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2">
                    {savedUnisData.map((uni) => (
                      <UniversityCard 
                        key={uni.id} 
                        university={uni} 
                        isSaved={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bookmark size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No saved universities</h3>
                    <p className="mt-1 text-gray-500">You haven't saved any universities yet.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}