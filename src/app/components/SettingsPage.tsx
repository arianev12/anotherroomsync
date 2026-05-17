import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Shield, Bell, Palette, Monitor, Moon, Sun, Save, Check, QrCode, Upload, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsPageProps {
  role: 'admin' | 'owner' | 'student';
}

export function SettingsPage({ role }: SettingsPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [gcashQRPreview, setGcashQRPreview] = useState<string | null>(
    role === 'owner' ? 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' : null
  );
  const [settings, setSettings] = useState({
    // Profile
    displayName: '',
    email: '',
    phone: '',
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    maintenanceAlerts: true,
    paymentReminders: true,
    newListings: true,
    roommateMatches: false,
    allNotifications: true,
    // Appearance
    compactMode: false,
    showAnimations: true,
    // Preferences
    language: 'English',
    timezone: 'Asia/Manila',
    // GCash Payment (Owner only)
    gcashNumber: '',
    gcashName: '',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleGCashQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGcashQRPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGCashQR = () => {
    setGcashQRPreview(null);
  };

  const sections = [
    {
      icon: User,
      title: 'Profile',
      description: 'Update your personal information',
      fields: [
        { label: 'Display Name', value: settings.displayName, key: 'displayName', type: 'text', placeholder: 'Your name' },
        { label: 'Email Address', value: settings.email, key: 'email', type: 'email', placeholder: 'your@email.com' },
        { label: 'Phone Number', value: settings.phone, key: 'phone', type: 'tel', placeholder: '+63 9XX XXX XXXX' },
      ],
      selects: [
        { label: 'Language', value: settings.language, key: 'language', options: ['English', 'Filipino'] },
        { label: 'Timezone', value: settings.timezone, key: 'timezone', options: ['Asia/Manila', 'UTC', 'Asia/Singapore'] },
      ],
    },
    ...(role === 'owner' ? [{
      icon: QrCode,
      title: 'GCash Payment',
      description: 'Setup GCash payment method for your tenants',
      isGCashSection: true,
    }] : []),
    {
      icon: Shield,
      title: 'Security',
      description: 'Update your password and security settings',
      fields: [
        { label: 'Current Password', value: settings.currentPassword, key: 'currentPassword', type: 'password', placeholder: '••••••••' },
        { label: 'New Password', value: settings.newPassword, key: 'newPassword', type: 'password', placeholder: '••••••••' },
        { label: 'Confirm New Password', value: settings.confirmPassword, key: 'confirmPassword', type: 'password', placeholder: '••••••••' }
      ]
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: role === 'admin' || role === 'owner'
        ? 'Enable or disable all notifications (includes email, alerts, and system updates)'
        : 'Manage how you receive updates',
      toggles: role === 'admin' || role === 'owner' ? [
        { label: 'All Notifications', key: 'allNotifications', description: 'Enable all system notifications' }
      ] : [
        { label: 'Email Notifications', key: 'emailNotifications', description: 'Receive updates via email' },
        { label: 'Push Notifications', key: 'pushNotifications', description: 'Get real-time alerts' },
        { label: 'Maintenance Alerts', key: 'maintenanceAlerts', description: 'Notify about maintenance updates' },
        { label: 'Payment Reminders', key: 'paymentReminders', description: 'Remind about upcoming payments' },
        { label: 'New Dormitory Listings', key: 'newListings', description: 'Get notified about new dormitories' },
        { label: 'Roommate Matches', key: 'roommateMatches', description: 'Notifications for potential roommate matches' }
      ]
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize your interface',
      toggles: role === 'admin' || role === 'owner' ? [
        { label: 'Show Animations', key: 'showAnimations', description: 'Enable smooth transitions and visual effects' }
      ] : [
        { label: 'Compact Mode', key: 'compactMode', description: 'Show more content on screen' },
        { label: 'Show Animations', key: 'showAnimations', description: 'Enable smooth transitions' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account and preferences
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-[#14b8a6] text-white hover:bg-[#0d9488]'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </motion.button>
      </div>

      {/* Theme Toggle Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#14b8a6]/10 dark:bg-[#14b8a6]/20 rounded-xl flex items-center justify-center">
              <Monitor className="w-6 h-6 text-[#0f766e] dark:text-[#14b8a6]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Theme</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Switch between light and dark mode
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`relative w-16 h-8 rounded-full transition-colors ${
              theme === 'dark' ? 'bg-[#14b8a6]' : 'bg-gray-300'
            }`}
          >
            <motion.div
              layout
              className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
              animate={{ x: theme === 'dark' ? 32 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-[#0f766e]" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-500" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* Settings Sections */}
      {sections.map((section, sectionIndex) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#14b8a6]/10 dark:bg-[#14b8a6]/20 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#0f766e] dark:text-[#14b8a6]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {section.description}
                </p>
              </div>
            </div>

            {/* GCash Section */}
            {(section as any).isGCashSection && (
              <div className="space-y-4">
                {/* GCash QR Code Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GCash QR Code
                  </label>
                  {gcashQRPreview ? (
                    <div className="relative inline-block">
                      <div className="w-64 h-64 bg-white rounded-xl shadow-lg p-4">
                        <img
                          src={gcashQRPreview}
                          alt="GCash QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <button
                        onClick={removeGCashQR}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGCashQRUpload}
                        className="hidden"
                      />
                      <div className="w-64 h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-teal-500 dark:hover:border-teal-400 transition-colors bg-gray-50 dark:bg-gray-900">
                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Upload QR Code</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB</p>
                      </div>
                    </label>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Students can scan this QR code to pay via GCash
                  </p>
                </div>

                {/* GCash Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GCash Number
                  </label>
                  <input
                    type="tel"
                    value={settings.gcashNumber}
                    onChange={(e) => setSettings({ ...settings, gcashNumber: e.target.value })}
                    placeholder="09XX XXX XXXX"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] dark:text-white transition-all"
                  />
                </div>

                {/* GCash Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GCash Account Name
                  </label>
                  <input
                    type="text"
                    value={settings.gcashName}
                    onChange={(e) => setSettings({ ...settings, gcashName: e.target.value })}
                    placeholder="Your name as shown in GCash"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] dark:text-white transition-all"
                  />
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-300 font-medium mb-1">💡 How it works</p>
                  <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                    <li>Upload your GCash QR code for payments</li>
                    <li>Students can scan and pay directly via GCash</li>
                    <li>They'll upload payment receipt for verification</li>
                    <li>You can review and approve payments in the Ledger</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Text Fields */}
            {section.fields && (
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] dark:text-white transition-all"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Select Fields */}
            {section.selects && (
              <div className="space-y-4 mt-4">
                {section.selects.map((select) => (
                  <div key={select.key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {select.label}
                    </label>
                    <select
                      value={select.value}
                      onChange={(e) => setSettings({ ...settings, [select.key]: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] dark:text-white transition-all"
                    >
                      {select.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* Toggle Switches */}
            {section.toggles && (
              <div className="space-y-4">
                {section.toggles.map((toggle) => (
                  <div key={toggle.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {toggle.label}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {toggle.description}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSettings({
                        ...settings,
                        [toggle.key]: !settings[toggle.key as keyof typeof settings]
                      })}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        settings[toggle.key as keyof typeof settings]
                          ? 'bg-[#14b8a6]'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <motion.div
                        layout
                        className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                        animate={{
                          x: settings[toggle.key as keyof typeof settings] ? 28 : 0
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
