import { MapPin, Users, Heart, Star, Sparkles, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useStudent } from "../contexts/StudentContext";

interface DormitoryCardProps {
  id: number;
  name: string;
  location: string;
  address: string;
  price: number;
  available: number;
  amenities: string[];
  images: string[];
  registrationStatus?: string;
  onClick?: () => void;
}

export function DormitoryCard({
  id,
  name,
  location,
  address,
  price,
  available,
  amenities,
  images,
  registrationStatus,
  onClick
}: DormitoryCardProps) {
  const { toggleFavorite, isFavorite } = useStudent();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <motion.img
          src={images[0]}
          alt={name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Availability Badge */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-3 left-3"
        >
          {available > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d9488] text-white rounded-lg text-xs font-medium shadow-lg backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {available} Available
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-gray-900/80 text-white rounded-lg text-xs font-medium shadow-lg backdrop-blur-sm">
              Fully Booked
            </div>
          )}
        </motion.div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(id);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors ${
              isFavorite(id) ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
            }`}
          />
        </motion.button>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
          <p className="text-lg font-bold text-[#0d9488]">₱{price.toLocaleString()}<span className="text-xs font-normal text-gray-500 dark:text-gray-400">/mo</span></p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#0d9488] transition-colors line-clamp-1">
            {name}
          </h3>
          {registrationStatus === "Verified" && (
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" title="Verified Dormitory" />
          )}
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <p className="line-clamp-1">{address}</p>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.slice(0, 3).map((amenity, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
            >
              {amenity}
            </motion.span>
          ))}
          {amenities.length > 3 && (
            <span className="px-2.5 py-1 bg-[#ccfbf1] text-[#0f766e] rounded-md text-xs font-medium">
              +{amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">4.8</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">(120 reviews)</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>{available} slots left</span>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-t from-[#0d9488]/10 to-transparent pointer-events-none"
      />
    </motion.div>
  );
}