import { useParams, Link } from "react-router";
import { universities, userProfile } from "../data";
import { Star, MapPin, Users, Wallet, Percent, ChevronLeft, ArrowRight, Heart } from "lucide-react";
import { useState } from "react";

export function UniversityDetail() {
  const { id } = useParams();
  const university = universities.find(u => u.id === id);
  
  const [isSaved, setIsSaved] = useState(userProfile.savedUniversities.includes(id || ""));

  if (!university) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900">University not found</h2>
        <Link to="/" className="mt-4 text-indigo-600 hover:underline">Return to search</Link>
      </div>
    );
  }

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Banner */}
      <div className="relative h-72 sm:h-96 w-full bg-gray-900">
        <img
          src={university.image}
          alt={university.name}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        
        <div className="absolute bottom-0 w-full">
          <div className="container mx-auto px-4 pb-8 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center mb-6 text-sm font-medium text-gray-300 hover:text-white">
              <ChevronLeft size={16} className="mr-1" /> Back to Search
            </Link>
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {university.name}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-gray-200">
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-1.5 opacity-80" />
                    <span>{university.location}</span>
                  </div>
                  <div className="flex items-center bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                    <Star size={16} className="mr-1.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-white">{university.rating}</span>
                    <span className="ml-1 text-gray-300">({university.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={toggleSave}
                className={`flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors ${
                  isSaved 
                    ? "bg-white text-gray-900 hover:bg-gray-100" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <Heart size={20} className={isSaved ? "fill-red-500 text-red-500" : ""} />
                {isSaved ? "Saved to Profile" : "Save University"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {university.description}
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <Users className="h-6 w-6 text-indigo-600 mb-2" />
                  <div className="text-sm text-gray-500">Student Body</div>
                  <div className="font-semibold text-gray-900">{university.students}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <Percent className="h-6 w-6 text-indigo-600 mb-2" />
                  <div className="text-sm text-gray-500">Acceptance Rate</div>
                  <div className="font-semibold text-gray-900">{university.acceptanceRate}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 sm:col-span-1 col-span-2">
                  <Wallet className="h-6 w-6 text-indigo-600 mb-2" />
                  <div className="text-sm text-gray-500">Average Tuition</div>
                  <div className="font-semibold text-gray-900">{university.tuition}</div>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Write a review</button>
              </div>
              
              <div className="space-y-6">
                {university.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-900">{review.user}</div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm sticky top-24">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Available Majors & Costs</h2>
              </div>
              <div className="p-2">
                <div className="max-h-[500px] overflow-y-auto p-4 space-y-4">
                  {university.majors.map((major, idx) => (
                    <div key={idx} className="group rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700">{major.name}</h3>
                        <span className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                          {major.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{major.degree}</p>
                      <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-indigo-600 border border-gray-200 shadow-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors">
                        View details <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}