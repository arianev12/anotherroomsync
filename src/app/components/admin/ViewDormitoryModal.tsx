import { X, MapPin, Users, DollarSign, Building2, CheckCircle, Home, Star, Phone, Mail } from "lucide-react";

interface Room {
  id: number;
  roomNumber: string;
  capacity: number;
  price: number;
  available: number;
  occupied: number;
}

interface Dormitory {
  id: number;
  name: string;
  owner: string;
  location: string;
  address: string;
  price: number;
  capacity: number;
  available: number;
  occupied: number;
  status: string;
  description: string;
  amenities: string[];
  images: string[];
  rooms?: Room[];
}

interface ViewDormitoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  dormitory: Dormitory | null;
  onEditClick?: () => void;
}

export function ViewDormitoryModal({ isOpen, onClose, dormitory, onEditClick }: ViewDormitoryModalProps) {
  if (!isOpen || !dormitory) return null;

  const occupancyRate = dormitory.capacity > 0
    ? Math.round((dormitory.occupied / dormitory.capacity) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4 pt-20 pb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">

          {/* Hero Image */}
          <div className="relative">
            <img
              src={dormitory.images[0]}
              alt={dormitory.name}
              className="w-full h-72 object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-colors border border-white/30"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Status badge on image */}
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                dormitory.status === 'Active'
                  ? 'bg-green-500/20 text-green-100 border-green-400/40'
                  : 'bg-gray-500/20 text-gray-100 border-gray-400/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dormitory.status === 'Active' ? 'bg-green-400' : 'bg-gray-400'}`} />
                {dormitory.status}
              </span>
            </div>

            {/* Dorm name on image */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h2 className="text-2xl font-bold text-white leading-tight">{dormitory.name}</h2>
              <p className="text-sm text-white/80 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {dormitory.address}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/40 rounded-xl p-4 text-center">
                <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
                <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">Owner</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 truncate">{dormitory.owner}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-xl p-4 text-center">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Monthly Rate</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">₱{dormitory.price.toLocaleString()}</p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/40 rounded-xl p-4 text-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Capacity</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{dormitory.capacity} beds</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40 rounded-xl p-4 text-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">Available</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{dormitory.available} / {dormitory.capacity}</p>
              </div>
            </div>

            {/* Occupancy Bar */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Occupancy Rate</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{occupancyRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    occupancyRate >= 90 ? 'bg-red-500' :
                    occupancyRate >= 70 ? 'bg-amber-500' :
                    'bg-teal-500'
                  }`}
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{dormitory.occupied} occupied</span>
                <span>{dormitory.available} available</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">About this Dormitory</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{dormitory.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Amenities
                <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">({dormitory.amenities.length} total)</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {dormitory.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700"
                  >
                    <CheckCircle className="w-4 h-4 text-teal-500 dark:text-teal-400 flex-shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Details */}
            {dormitory.rooms && dormitory.rooms.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Room Details
                  <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">({dormitory.rooms.length} rooms)</span>
                </h3>
                <div className="space-y-2">
                  {dormitory.rooms.map((room) => {
                    const roomOccupancy = room.capacity > 0 ? Math.round((room.occupied / room.capacity) * 100) : 0;
                    return (
                      <div
                        key={room.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Home className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Room {room.roomNumber}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Capacity: {room.capacity} persons</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-teal-600 dark:text-teal-400">₱{room.price.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">/month</p>
                          </div>
                        </div>

                        {/* Room availability bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>{room.available} / {room.capacity} available</span>
                            <span className={`font-medium ${
                              room.available === 0 ? 'text-red-500' :
                              room.available <= 1 ? 'text-amber-500' :
                              'text-green-500'
                            }`}>
                              {room.available === 0 ? 'Full' : room.available <= 1 ? 'Almost Full' : 'Available'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                roomOccupancy >= 100 ? 'bg-red-500' :
                                roomOccupancy >= 75 ? 'bg-amber-500' :
                                'bg-teal-500'
                              }`}
                              style={{ width: `${roomOccupancy}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Close
              </button>
              {onEditClick && (
                <button
                  onClick={onEditClick}
                  className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors text-sm font-medium"
                >
                  Edit Dormitory
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}