import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { MapPin, Users, Heart, ArrowLeft, Calendar, Send, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStudent } from "../../contexts/StudentContext";
import { toast } from "sonner";
import { useDormitory } from "../../../hooks/useApi";

export function DormitoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, setCurrentDorm } = useStudent();
  const { dormitory: dorm } = useDormitory(id ? Number(id) : null);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState<'visit' | 'rent'>('visit');
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
const [showRoommates, setShowRoommates] = useState<{ [key: number]: boolean }>({});

  if (!dorm) {
    return <div>Dormitory not found</div>;
  }

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) {
      toast.error("Please select a room");
      return;
    }
    const room = dorm.rooms.find(r => r.id === selectedRoom);
    if (requestType === 'visit') {
      toast.success(`Walk-in visit request submitted for Room ${room?.roomNumber} on ${visitDate} at ${visitTime}`);
    } else {
      toast.success(`Rent request submitted for Room ${room?.roomNumber}. Move-in date: ${moveInDate}. For demo purposes, you're now a tenant!`);
      // For demo: Automatically set as current dorm
      // Decrease available by 1 since student is now renting
      setCurrentDorm({
        id: dorm.id,
        name: dorm.name,
        roomNumber: room?.roomNumber || '',
        roomCapacity: room?.capacity || 0,
        roomAvailable: (room?.available || 0) - 1 // Student took one slot
      });
      setTimeout(() => {
        navigate('/student/my-dorm');
      }, 1500);
    }
    setShowRequestModal(false);
    setSelectedRoom(null);
    setVisitDate("");
    setVisitTime("");
    setMoveInDate("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>
        <motion.button
          onClick={() => toggleFavorite(dorm.id)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart
            className={`w-5 h-5 ${isFavorite(dorm.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
          />
          {isFavorite(dorm.id) ? 'Saved' : 'Save'}
        </motion.button>
      </div>

      {/* Main Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl overflow-hidden"
      >
        <img
          src={dorm.images[0]}
          alt={dorm.name}
          className="w-full h-96 object-cover"
        />
      </motion.div>

      {/* Dorm Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{dorm.name}</h1>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
          <MapPin className="w-5 h-5" />
          <span>{dorm.location}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{dorm.description}</p>

        {/* Amenities */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {(dorm.amenities || []).map((amenity) => (
              <span
                key={amenity}
                className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Capacity</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dorm.capacity}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Available Slots</p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{dorm.available}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Starting Price</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₱{dorm.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Available Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(dorm.rooms || []).map((room) => (
            <motion.div
              key={room.id}
              whileHover={{ y: -5 }}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              {/* Room Image */}
              <div className="relative h-44 overflow-hidden">
                <motion.img
                  src={(room as any).image || dorm.images[0]}
                  alt={`Room ${room.roomNumber}`}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {/* Room number badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Room {room.roomNumber}</span>
                </div>
                {/* Availability badge */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${room.available > 0 ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                  {room.available > 0 ? `${room.available} slot${room.available > 1 ? 's' : ''} left` : 'Full'}
                </div>
                {/* Price on image bottom */}
                <div className="absolute bottom-3 right-3">
                  <span className="text-xl font-bold text-white drop-shadow-lg">₱{room.price.toLocaleString()}</span>
                  <span className="text-xs text-white/80 ml-1">/mo</span>
                </div>
              </div>

              <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <Users className="w-4 h-4" />
                <span>Capacity: {room.capacity} persons</span>
                <span className="mx-1 text-gray-300 dark:text-gray-600">•</span>
                <span className={`font-medium ${room.available > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  {room.occupied}/{room.capacity} occupied
                </span>
              </div>

              {/* Current Roommates */}
              {(room as any).currentTenants && (room as any).currentTenants.length > 0 && (
                <div className="mb-3">
                  <motion.button
                    onClick={() => setShowRoommates(prev => ({ ...prev, [room.id]: !prev[room.id] }))}
                    className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg flex items-center justify-between hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                      Current Roommates ({(room as any).currentTenants.length})
                    </p>
                    {showRoommates[room.id] ? (
                      <ChevronUp className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {showRoommates[room.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                          {(room as any).currentTenants.map((tenant: any, idx: number) => (
                            <motion.div
                              key={idx}
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700"
                            >
                              <div className="flex items-start gap-2 mb-2">
                                <img
                                  src={tenant.image}
                                  alt={tenant.name}
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                    {tenant.name}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {tenant.gender} • {tenant.course}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500">
                                    {tenant.year}th Year
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-1 pl-12">
                                <div className="flex items-start gap-1.5">
                                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Study:</span>
                                  <span className="text-xs text-gray-700 dark:text-gray-300">{tenant.studyHabits}</span>
                                </div>
                                <div className="flex items-start gap-1.5">
                                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Sleep:</span>
                                  <span className="text-xs text-gray-700 dark:text-gray-300">{tenant.sleepSchedule}</span>
                                </div>
                                <div className="flex items-start gap-1.5">
                                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Clean:</span>
                                  <span className="text-xs text-gray-700 dark:text-gray-300">{tenant.cleanliness}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  onClick={() => {
                    if (room.available === 0) {
                      toast.error("This room is fully occupied");
                      return;
                    }
                    setRequestType('visit');
                    setSelectedRoom(room.id);
                    setShowRequestModal(true);
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar className="w-4 h-4" />
                  Request Visit
                </motion.button>
                <motion.button
                  onClick={() => {
                    if (room.available === 0) {
                      toast.error("This room is fully occupied");
                      return;
                    }
                    setRequestType('rent');
                    setSelectedRoom(room.id);
                    setShowRequestModal(true);
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-4 h-4" />
                  Request Rent
                </motion.button>
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowRequestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {requestType === 'visit' ? 'Request Walk-in Visit' : 'Request to Rent'}
                </h2>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected Room
                  </label>
                  <input
                    type="text"
                    value={`Room ${dorm.rooms.find(r => r.id === selectedRoom)?.roomNumber}`}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>

                {requestType === 'visit' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Visit Date
                      </label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Visit Time
                      </label>
                      <input
                        type="time"
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Desired Move-in Date
                    </label>
                    <input
                      type="date"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
