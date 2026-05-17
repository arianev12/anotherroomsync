import { Outlet, useNavigate, useLocation } from "react-router";
import {
  Building2, LayoutDashboard, Users, Home, Search, Bell,
  Settings as SettingsIcon, Sun, Moon, LogOut, Menu, X, User,
  Wrench, FileText, UserCircle, CheckCircle, AlertCircle, Info
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";
import { useStudent } from "../contexts/StudentContext";
import { useNotifications } from "../contexts/NotificationsContext";
import { Toaster } from "sonner";

export function LayoutWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { hasDorm, currentDorm } = useStudent();
  const { notifications, unreadCount, markAsRead, markAllAsRead, initForRole } = useNotifications();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [paymentBannerDismissed, setPaymentBannerDismissed] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Mock payment due date for student with dorm
  const PAYMENT_DUE_DATE = new Date('2026-04-20');
  const today = new Date('2026-04-16');
  const daysUntilDue = Math.ceil((PAYMENT_DUE_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const showPaymentReminder = hasDorm && daysUntilDue <= 7 && daysUntilDue >= 0;

  // Derive userRole reactively from location so it updates on route change
  const userRole = location.pathname.startsWith("/admin")
    ? "admin"
    : location.pathname.startsWith("/owner")
    ? "owner"
    : "student";

  // Initialize notifications for current role
  useEffect(() => {
    if (userRole === "student" && showPaymentReminder) {
      initForRole("student", [{
        id: 0, type: "warning", title: "Payment Due Soon!",
        message: `Monthly rent of ₱2,500 for Arasof Student Lodge is due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'} (Apr 20, 2026). Contact your owner to arrange payment.`,
        time: "Just now", icon: AlertCircle, isRead: false,
      }]);
    } else {
      initForRole(userRole as "admin" | "owner" | "student");
    }
  }, [userRole]);

  const isRoomFullyOccupied = () => {
    if (!currentDorm) return false;
    return currentDorm.roomAvailable === 0;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    if (userRole === "admin") navigate("/admin/settings");
    else if (userRole === "owner") navigate("/owner/settings");
    else navigate("/student/settings");
  };

  const notifPath = `/${userRole}/notifications`;

  const adminMenu = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Manage Owners", path: "/admin/owners", icon: Users },
    { label: "Dormitories", path: "/admin/dormitories", icon: Building2 },
    { label: "Settings", path: "/admin/settings", icon: SettingsIcon },
  ];

  const ownerMenu = [
    { label: "Dashboard", path: "/owner", icon: Home },
    { label: "My Dormitories", path: "/owner/dormitories", icon: Building2 },
    { label: "Tenant Requests", path: "/owner/tenant-requests", icon: Users },
    { label: "Maintenance", path: "/owner/maintenance", icon: Wrench },
    { label: "Payments", path: "/owner/payments", icon: FileText },
    { label: "Profile", path: "/owner/profile", icon: UserCircle },
    { label: "Settings", path: "/owner/settings", icon: SettingsIcon },
  ];

  const studentMenu = hasDorm
    ? [
        { label: "Dashboard", path: "/student", icon: Home },
        { label: "My Dorm", path: "/student/my-dorm", icon: Building2 },
        { label: "Maintenance", path: "/student/maintenance", icon: Wrench },
        { label: "Profile", path: "/student/profile", icon: UserCircle },
        { label: "Settings", path: "/student/settings", icon: SettingsIcon },
      ]
    : [
        { label: "Dashboard", path: "/student", icon: Home },
        { label: "Find Dormitory", path: "/student/find", icon: Search },
        { label: "Profile", path: "/student/profile", icon: UserCircle },
        { label: "Settings", path: "/student/settings", icon: SettingsIcon },
      ];

  const menu =
    userRole === "admin" ? adminMenu : userRole === "owner" ? ownerMenu : studentMenu;

  const handleLogout = () => navigate("/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f0fdfa] to-[#ccfbf1] dark:from-[#042f2e] dark:via-[#134e4a] dark:to-[#042f2e] transition-colors relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ background: "radial-gradient(circle, rgba(153,246,228,0.3) 0%, rgba(204,251,241,0.15) 50%, transparent 100%)" }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [180, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ background: "radial-gradient(circle, rgba(94,234,212,0.25) 0%, rgba(153,246,228,0.12) 50%, transparent 100%)" }}
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 100, 0], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle, rgba(20,184,166,0.2) 0%, rgba(153,246,228,0.1) 50%, transparent 100%)" }}
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl"
        />
      </div>

      {/* Top Navigation */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="backdrop-blur-2xl bg-white/70 dark:bg-[#134e4a]/70 border-b border-[#99f6e4]/30 dark:border-[#115e59]/30 fixed top-0 left-0 right-0 z-30 transition-colors shadow-lg"
      >
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>

            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
              <div className="w-10 h-10 bg-gradient-to-br from-[#14b8a6] to-[#0f766e] rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-semibold text-gray-900 dark:text-white">RoomSync</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole} Portal</p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white rounded-full flex items-center justify-center font-medium"
                    style={{ fontSize: "10px", padding: "0 3px" }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 5).map(n => {
                        const Icon = n.icon;
                        return (
                          <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => markAsRead(n.id)}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer transition-colors ${
                              !n.isRead
                                ? "bg-teal-50/60 dark:bg-teal-900/10 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                n.type === "success" ? "bg-green-100 dark:bg-green-900/30" :
                                n.type === "warning" ? "bg-yellow-100 dark:bg-yellow-900/30" :
                                "bg-blue-100 dark:bg-blue-900/30"
                              }`}>
                                <Icon className={`w-4 h-4 ${
                                  n.type === "success" ? "text-green-600 dark:text-green-400" :
                                  n.type === "warning" ? "text-yellow-600 dark:text-yellow-400" :
                                  "text-blue-600 dark:text-blue-400"
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1">
                                  <h4 className={`text-sm font-medium truncate ${!n.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                                    {n.title}
                                  </h4>
                                  {!n.isRead && <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-1" />}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => { navigate(notifPath); setIsNotificationOpen(false); }}
                        className="w-full text-center text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                      >
                        View all notifications ({notifications.length})
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <motion.button
              onClick={handleAvatarClick}
              className="w-8 h-8 bg-gradient-to-br from-[#14b8a6] to-[#0f766e] rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {userRole === "admin" ? "A" : userRole === "owner" ? "O" : "S"}
            </motion.button>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="flex pt-16 relative z-10">
        {/* Desktop Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="hidden lg:block w-64 backdrop-blur-2xl bg-white/60 dark:bg-gray-900/60 border-r border-white/20 dark:border-gray-700/30 fixed left-0 top-16 bottom-0 overflow-y-auto transition-colors shadow-lg"
        >
          <nav className="p-4 space-y-1">
            {menu.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#14b8a6] to-[#0f766e] text-white shadow-lg border border-white/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </motion.div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-64 backdrop-blur-3xl bg-white/80 dark:bg-gray-900/80 z-50 overflow-y-auto shadow-2xl border-r border-white/20 dark:border-gray-700/30"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#14b8a6] to-[#0f766e] rounded-xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">RoomSync</span>
                  </div>
                  <motion.button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </motion.button>
                </div>

                <nav className="p-4 space-y-1">
                  {menu.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.button
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-[#14b8a6] to-[#0f766e] text-white shadow-lg"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-white/20 dark:border-gray-700/30">
                  <motion.button
                    onClick={handleLogout}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>

      <Toaster position="top-right" richColors />

      {/* Payment Due Banner */}
      {showPaymentReminder && !paymentBannerDismissed && userRole === 'student' && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-16 left-0 right-0 z-20 lg:pl-64"
        >
          <div className="bg-amber-500 dark:bg-amber-600 text-white px-4 py-2.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>Payment Reminder:</strong> Monthly rent of ₱2,500 for Arasof Student Lodge is due in{" "}
                <strong>{daysUntilDue} day{daysUntilDue === 1 ? '' : 's'}</strong> (Apr 20, 2026). Contact your owner to arrange payment.
              </span>
            </div>
            <button
              onClick={() => setPaymentBannerDismissed(true)}
              className="ml-4 p-1 hover:bg-amber-600 dark:hover:bg-amber-700 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}