import { motion } from "motion/react";
import { User, Mail, Phone, MapPin, Building2, Calendar, Award, TrendingUp } from "lucide-react";

export function OwnerProfile() {
  const profileData = {
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '+63 912 345 6789',
    address: 'Barangay Bucana, Nasugbu, Batangas',
    joinedDate: 'January 2024',
    businessName: 'Santos Dormitories',
    registrationNumber: 'DTI-123456789',
    taxId: '123-456-789-000',
    totalDorms: 5,
    totalTenants: 42,
    rating: 4.8,
  };

  const stats = [
    { icon: Building2, label: 'Active Dormitories', value: profileData.totalDorms, color: 'bg-[#14b8a6]' },
    { icon: User, label: 'Total Tenants', value: profileData.totalTenants, color: 'bg-[#0d9488]' },
    { icon: Award, label: 'Average Rating', value: profileData.rating, color: 'bg-[#0f766e]' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View your account information
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="h-32 bg-gradient-to-br from-[#14b8a6] to-[#0d9488]" />
        
        {/* Profile Content */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-6 -mt-16 mb-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-xl bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
              <User className="w-16 h-16 text-[#0f766e] dark:text-[#5eead4]" />
            </div>
            
            {/* Name and Title */}
            <div className="flex-1 mt-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {profileData.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dormitory Owner</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Member since {profileData.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Mail className="w-5 h-5 text-[#0f766e] dark:text-[#5eead4]" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm text-gray-900 dark:text-white">{profileData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Phone className="w-5 h-5 text-[#0f766e] dark:text-[#5eead4]" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm text-gray-900 dark:text-white">{profileData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <MapPin className="w-5 h-5 text-[#0f766e] dark:text-[#5eead4]" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-sm text-gray-900 dark:text-white">{profileData.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Business Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#14b8a6]/10 dark:bg-[#14b8a6]/20 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#0f766e] dark:text-[#14b8a6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Business Information
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your registered business details
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Business Name</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{profileData.businessName}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Registration Number</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{profileData.registrationNumber}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tax ID Number</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{profileData.taxId}</p>
          </div>
        </div>
      </motion.div>

      {/* Edit Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#14b8a6]/5 dark:bg-[#14b8a6]/10 border border-[#14b8a6]/20 dark:border-[#14b8a6]/30 rounded-lg p-4"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong className="text-gray-900 dark:text-white">Note:</strong> To edit your profile information, 
          business details, or security settings, please visit the{' '}
          <a href="/owner/settings" className="text-[#0f766e] dark:text-[#5eead4] hover:underline font-medium">
            Settings
          </a>{' '}
          page.
        </p>
      </motion.div>
    </div>
  );
}