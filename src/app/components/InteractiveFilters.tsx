import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface InteractiveFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  amenities: string[];
  availability: string;
  distance: number;
}

export function InteractiveFilters({ onFilterChange }: InteractiveFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [2000, 4000],
    amenities: [],
    availability: 'all',
    distance: 10
  });

  const amenitiesList = [
    "WiFi", "Aircon", "Study Area", "Laundry", 
    "24/7 Security", "CCTV", "Gym", "Common Kitchen"
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilter('amenities', newAmenities);
  };

  const clearFilters = () => {
    const defaultFilters = {
      priceRange: [2000, 4000] as [number, number],
      amenities: [],
      availability: 'all',
      distance: 10
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const activeFilterCount = 
    (filters.amenities.length > 0 ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.distance !== 10 ? 1 : 0);

  return (
    <>
      {/* Filter Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
      >
        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-700">Filters</span>
        {activeFilterCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-[#0d9488] text-white rounded-full text-xs flex items-center justify-center font-medium"
          >
            {activeFilterCount}
          </motion.span>
        )}
      </motion.button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                  <p className="text-sm text-gray-500 mt-1">Customize your search</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Filters Content */}
              <div className="p-6 space-y-8">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    Price Range
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">₱{filters.priceRange[0].toLocaleString()}</span>
                      <span className="text-gray-600">₱{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="2000"
                      max="5000"
                      step="100"
                      value={filters.priceRange[1]}
                      onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0d9488]"
                    />
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={filters.priceRange[0]}
                          onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 2000, filters.priceRange[1]])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Min"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          value={filters.priceRange[1]}
                          onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 4000])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {amenitiesList.map((amenity) => {
                      const isSelected = filters.amenities.includes(amenity);
                      return (
                        <motion.button
                          key={amenity}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleAmenity(amenity)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? 'bg-[#0d9488] text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {amenity}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    Availability
                  </label>
                  <div className="space-y-2">
                    {['all', 'available', 'full'].map((option) => (
                      <motion.button
                        key={option}
                        whileHover={{ x: 4 }}
                        onClick={() => updateFilter('availability', option)}
                        className={`w-full px-4 py-3 rounded-lg text-left transition-all ${
                          filters.availability === option
                            ? 'bg-[#ccfbf1] border-2 border-[#0d9488] text-[#0f766e]'
                            : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="font-medium capitalize">
                          {option === 'all' ? 'All Dormitories' : option === 'available' ? 'Available Only' : 'Fully Booked'}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Distance from Campus */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    Distance from Campus
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Walking Distance</span>
                      <span className="font-medium text-gray-900">{filters.distance} mins</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={filters.distance}
                      onChange={(e) => updateFilter('distance', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0d9488]"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {[5, 10, 15, 20].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => updateFilter('distance', mins)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            filters.distance === mins
                              ? 'bg-[#0d9488] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#0d9488] text-white rounded-lg font-medium hover:bg-[#0f766e] transition-colors shadow-lg"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}