import { useState } from "react";
import { MapPin, Heart, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import { useDormitories } from "../../../hooks/useApi";

export function DormMatching() {
  const navigate = useNavigate();
  const { dormitories } = useDormitories();
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    distance: 5,
    amenities: [] as string[],
    capacity: 'any'
  });

  const amenitiesOptions = ['WiFi', 'Aircon', 'Study Area', 'Laundry', 'Gym', 'Pool'];

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const filteredDorms = dormitories.filter(dorm => {
    const priceMatch = dorm.price >= filters.minPrice && dorm.price <= filters.maxPrice;
    const amenitiesMatch = filters.amenities.length === 0 || 
      filters.amenities.every(a => dorm.amenities.includes(a));
    return priceMatch && amenitiesMatch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dorm Matching</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find dormitories that match your preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
            </div>

            {/* Budget Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Budget Range
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Min Price</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Max Price</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>

            {/* Distance */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Distance (km)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={filters.distance}
                onChange={(e) => setFilters({ ...filters, distance: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>1 km</span>
                <span>{filters.distance} km</span>
                <span>10 km</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Amenities
              </label>
              <div className="space-y-2">
                {amenitiesOptions.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      filters.amenities.includes(amenity)
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Room Capacity
              </label>
              <select
                value={filters.capacity}
                onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="any">Any</option>
                <option value="single">Single</option>
                <option value="2-4">2-4 persons</option>
                <option value="5+">5+ persons</option>
              </select>
            </div>

            <button 
              onClick={() => setFilters({
                minPrice: 0,
                maxPrice: 10000,
                distance: 5,
                amenities: [],
                capacity: 'any'
              })}
              className="w-full mt-6 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found <span className="font-semibold">{filteredDorms.length}</span> dormitories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDorms.map((dorm) => (
              <div 
                key={dorm.id}
                onClick={() => navigate(`/student/dormitory/${dorm.id}`)}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={dorm.images[0]} 
                    alt={dorm.name}
                    className="w-full h-48 object-cover"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <span className="absolute bottom-3 left-3 px-2 py-1 bg-white dark:bg-gray-800 rounded-md text-xs font-medium text-gray-900 dark:text-white">
                    {dorm.available} / {dorm.capacity} available
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dorm.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{dorm.location}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">{dorm.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {dorm.amenities.slice(0, 4).map((amenity) => (
                      <span key={amenity} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Starting at</p>
                      <p className="text-xl font-semibold text-teal-600 dark:text-teal-400">₱{dorm.price.toLocaleString()}</p>
                    </div>
                    <button className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}