import { motion } from "motion/react";
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, BookOpen, Award } from "lucide-react";

export function StudentProfile() {
  const profileData = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+63 912 345 6789',
    address: 'Barangay Bucana, Nasugbu, Batangas',
    dateOfBirth: 'May 15, 2003',
    joinedDate: 'January 2024',
    university: 'University of Manila',
    studentId: '2024-123456',
    course: 'Bachelor of Science in Computer Science',
    yearLevel: '2nd Year',
    dormStatus: 'Active Tenant',
  };

  const academicInfo = [
    { icon: GraduationCap, label: 'University', value: profileData.university },
    { icon: BookOpen, label: 'Course/Program', value: profileData.course },
    { icon: Award, label: 'Year Level', value: profileData.yearLevel },
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
              <p className="text-sm text-gray-500 dark:text-gray-400">{profileData.course}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Member since {profileData.joinedDate}
                  </span>
                </div>
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                  {profileData.dormStatus}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Calendar className="w-5 h-5 text-[#0f766e] dark:text-[#5eead4]" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="text-sm text-gray-900 dark:text-white">{profileData.dateOfBirth}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Academic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#14b8a6]/10 dark:bg-[#14b8a6]/20 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[#0f766e] dark:text-[#14b8a6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Academic Information
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your educational details
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {academicInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#14b8a6] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{info.label}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{info.value}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Student ID</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{profileData.studentId}</p>
        </div>
      </motion.div>

      {/* Edit Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#14b8a6]/5 dark:bg-[#14b8a6]/10 border border-[#14b8a6]/20 dark:border-[#14b8a6]/30 rounded-lg p-4"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong className="text-gray-900 dark:text-white">Note:</strong> To edit your profile information, 
          academic details, or security settings, please visit the{' '}
          <a href="/student/settings" className="text-[#0f766e] dark:text-[#5eead4] hover:underline font-medium">
            Settings
          </a>{' '}
          page.
        </p>
      </motion.div>
    </div>
  );
}