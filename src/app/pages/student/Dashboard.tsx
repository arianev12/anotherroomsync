import { Building2, MapPin, Heart, Home, Calendar, DollarSign, Bell } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useStudent } from "../../contexts/StudentContext";
import { useDormitories } from "../../../hooks/useApi";

export function StudentDashboard() {
  const navigate = useNavigate();
  const { savedFavorites, toggleFavorite, isFavorite, currentDorm } = useStudent();
  const { dormitories, loading, error } = useDormitories();

  const recommendedDorms = dormitories.slice(0, 3);
  const favoriteDorms = dormitories.filter((d) => savedFavorites.includes((d as any).dormitory_id ?? d.id));

  // Get current dorm details if student has one
  const currentDormDetails = currentDorm ? dormitories.find((d) => ((d as any).dormitory_id ?? d.id) === currentDorm.id) : null;
  const currentRoom = currentDormDetails?.rooms?.find((r: any) => String(r.room_number ?? r.roomNumber) === String(currentDorm?.roomNumber));
  const currentDormImage = currentDormDetails?.images_json?.[0] ?? currentDormDetails?.images?.[0] ?? 'https://via.placeholder.com/800x450?text=Dorm+Image';
  const currentDormAddress = currentDormDetails?.address ?? currentDormDetails?.location ?? 'No address available';

  // Payment reminder data
  const paymentDueDate = new Date('2026-03-31');
  const today = new Date('2026-03-15');
  const daysUntilDue = Math.ceil((paymentDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // If student has a dorm, show different dashboard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-700 dark:text-gray-200">Loading dormitories from the database...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Unable to load dormitories</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (currentDorm && currentDormDetails) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome Back!</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Here's your current residence overview</p>
        </motion.div>

        {/* Current Residence Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden shadow-lg"
        >
          <div className="relative h-48">
            <img
              src={currentDormDetails.images[0]}
              alt={currentDormDetails.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-6 right-6">
              <h2 className="text-xl font-bold text-white mb-1">{currentDormDetails.name}</h2>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{currentDormDetails.address}</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg">
                <Home className="w-6 h-6 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Your Room</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Room {currentDorm.roomNumber}</p>
              </div>
              <div className="text-center p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Rent</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">₱{currentRoom?.price.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Next Payment</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{daysUntilDue} days</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => navigate('/student/my-dorm')}
                className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                View My Dorm
              </button>
              <button
                onClick={() => navigate('/student/my-dorm')}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                View Payments
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Bell, value: daysUntilDue <= 7 ? 1 : 0, label: "Payment Reminders", bgColor: "bg-amber-500" },
            { icon: Heart, value: savedFavorites.length, label: "Saved Favorites", bgColor: "bg-red-500" },
            { icon: Home, value: 1, label: "Active Residence", bgColor: "bg-teal-600" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  y: -5, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Reminder - Only show if due soon */}
        {daysUntilDue <= 7 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="backdrop-blur-xl bg-amber-50/80 dark:bg-amber-900/30 rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-6 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-300 mb-2">Payment Due Soon</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
                  Your monthly rent of ₱{currentRoom?.price.toLocaleString()} is due in {daysUntilDue} days ({paymentDueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                </p>
                <button
                  onClick={() => navigate('/student/my-dorm')}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
                >
                  View Payment Details
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Saved Favorites - If any */}
        {favoriteDorms.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Favorites</h2>
              <motion.button
                onClick={() => navigate('/student/find')}
                className="text-sm text-[#0d9488] hover:text-[#0f766e] dark:text-[#5eead4] dark:hover:text-[#14b8a6] font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
              </motion.button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favoriteDorms.slice(0, 3).map((dorm: any, index) => {
                const dormId = dorm.dormitory_id ?? dorm.id;
                const imageUrl = dorm.images_json?.[0] ?? dorm.images?.[0] ?? 'https://via.placeholder.com/600x400?text=Dorm+Image';
                const amenityList = dorm.amenities_list ?? dorm.amenities ?? [];
                return (
                <motion.div
                  key={dormId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5, type: "spring" }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  onClick={() => navigate(`/student/dormitory/${dormId}`)}
                  className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden shadow-lg cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={dorm.name}
                      className="w-full h-48 object-cover"
                    />
                    <motion.button
                      className="absolute top-3 right-3 w-8 h-8 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center shadow-md hover:bg-white/90 dark:hover:bg-gray-800/90"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(dormId);
                      }}
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </motion.button>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dorm.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{dorm.address ?? dorm.location ?? 'No address available'}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Starting at</p>
                        <p className="text-lg font-semibold text-[#0d9488] dark:text-[#5eead4]">₱{Number(dorm.price ?? 0).toLocaleString()}/mo</p>
                      </div>
                      <div className="flex gap-1">
                        {amenityList.slice(0, 3).map((amenity: string) => (
                          <span key={amenity} className="px-2 py-1 backdrop-blur-xl bg-gray-100/70 dark:bg-gray-700/70 text-xs text-gray-600 dark:text-gray-300 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        <motion.div 
          className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
          <div className="space-y-3">
            {daysUntilDue <= 7 && (
              <motion.div 
                className="flex items-start gap-3 p-3 backdrop-blur-xl bg-amber-500/10 dark:bg-amber-500/20 rounded-xl border border-amber-200/30 dark:border-amber-400/30"
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                <div className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Payment reminder</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your rent is due in {daysUntilDue} days</p>
                </div>
              </motion.div>
            )}
            <motion.div 
              className="flex items-start gap-3 p-3 backdrop-blur-xl bg-gray-500/10 dark:bg-gray-500/20 rounded-xl border border-gray-200/30 dark:border-gray-600/30"
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
            >
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-1.5"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Welcome to {currentDormDetails.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enjoy your stay in Room {currentDorm.roomNumber}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Default dashboard for students without a dorm
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome Back!</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find your perfect dormitory match</p>
      </motion.div>

      {/* Quick Stats - Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Building2, value: dormitories.length, label: "Available Dorms", bgColor: "bg-[#0d9488]" },
          { icon: Heart, value: savedFavorites.length, label: "Saved Favorites", bgColor: "bg-[#14b8a6]" },
          { icon: MapPin, value: 1, label: "Pending Requests", bgColor: "bg-[#0f766e]" }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                y: -5, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recommended Dormitories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Dormitories</h2>
          <motion.button
            onClick={() => navigate('/student/find')}
            className="text-sm text-[#0d9488] hover:text-[#0f766e] dark:text-[#5eead4] dark:hover:text-[#14b8a6] font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedDorms.map((dorm: any, index) => {
            const dormId = dorm.dormitory_id ?? dorm.id;
            const imageUrl = dorm.images_json?.[0] ?? dorm.images?.[0] ?? 'https://via.placeholder.com/600x400?text=Dorm+Image';
            const amenityList = dorm.amenities_list ?? dorm.amenities ?? [];
            return (
            <motion.div 
              key={dormId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5, type: "spring" }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              onClick={() => navigate(`/student/dormitory/${dormId}`)}
              className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden shadow-lg cursor-pointer"
            >
              <div className="relative">
                <img 
                  src={imageUrl} 
                  alt={dorm.name}
                  className="w-full h-48 object-cover"
                />
                <motion.button
                  className="absolute top-3 right-3 w-8 h-8 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center shadow-md hover:bg-white/90 dark:hover:bg-gray-800/90"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(dormId);
                  }}
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorite(dormId) ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
                  />
                </motion.button>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dorm.name}</h3>
                <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{dorm.address ?? dorm.location ?? 'No address available'}</span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Starting at</p>
                    <p className="text-lg font-semibold text-[#0d9488] dark:text-[#5eead4]">₱{Number(dorm.price ?? 0).toLocaleString()}/mo</p>
                  </div>
                  <div className="flex gap-1">
                    {amenityList.slice(0, 3).map((amenity: string) => (
                      <span key={amenity} className="px-2 py-1 backdrop-blur-xl bg-gray-100/70 dark:bg-gray-700/70 text-xs text-gray-600 dark:text-gray-300 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Saved Favorites */}
      {favoriteDorms.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Favorites</h2>
            <motion.button
              onClick={() => navigate('/student/find')}
              className="text-sm text-[#0d9488] hover:text-[#0f766e] dark:text-[#5eead4] dark:hover:text-[#14b8a6] font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find More
            </motion.button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {favoriteDorms.map((dorm: any, index) => {
              const dormId = dorm.dormitory_id ?? dorm.id;
              const imageUrl = dorm.images_json?.[0] ?? dorm.images?.[0] ?? 'https://via.placeholder.com/600x400?text=Dorm+Image';
              const amenityList = dorm.amenities_list ?? dorm.amenities ?? [];
              return (
              <motion.div
                key={dormId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5, type: "spring" }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                onClick={() => navigate(`/student/dormitory/${dormId}`)}
                className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden shadow-lg cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={dorm.name}
                    className="w-full h-48 object-cover"
                  />
                  <motion.button
                    className="absolute top-3 right-3 w-8 h-8 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center shadow-md hover:bg-white/90 dark:hover:bg-gray-800/90"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(dormId);
                    }}
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </motion.button>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dorm.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{dorm.address || dorm.location || 'No address available'}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Starting at</p>
                      <p className="text-lg font-semibold text-[#0d9488] dark:text-[#5eead4]">₱{Number(dorm.price ?? 0).toLocaleString()}/mo</p>
                    </div>
                    <div className="flex gap-1">
                      {amenityList.slice(0, 3).map((amenity: string) => (
                        <span key={amenity} className="px-2 py-1 backdrop-blur-xl bg-gray-100/70 dark:bg-gray-700/70 text-xs text-gray-600 dark:text-gray-300 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications - Glassmorphism */}
      <motion.div 
        className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
        <div className="space-y-3">
          <motion.div 
            className="flex items-start gap-3 p-3 backdrop-blur-xl bg-blue-500/10 dark:bg-blue-500/20 rounded-xl border border-blue-200/30 dark:border-blue-400/30"
            whileHover={{ x: 5, transition: { duration: 0.2 } }}
          >
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-1.5"></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">New dormitory matches available</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on your preferences</p>
            </div>
          </motion.div>
          <motion.div 
            className="flex items-start gap-3 p-3 backdrop-blur-xl bg-gray-500/10 dark:bg-gray-500/20 rounded-xl border border-gray-200/30 dark:border-gray-600/30"
            whileHover={{ x: 5, transition: { duration: 0.2 } }}
          >
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-1.5"></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Payment reminder</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your rent is due in 3 days</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}