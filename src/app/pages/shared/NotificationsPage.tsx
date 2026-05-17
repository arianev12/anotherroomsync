import { CheckCircle, AlertCircle, Info, Bell, CheckCheck, Filter } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../../contexts/NotificationsContext";
import { motion, AnimatePresence } from "motion/react";

type FilterType = "all" | "unread" | "read" | "success" | "warning" | "info";

export function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return n.type === filter;
  });

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: "all",     label: "All" },
    { key: "unread",  label: "Unread" },
    { key: "read",    label: "Read" },
    { key: "success", label: "Success" },
    { key: "warning", label: "Warning" },
    { key: "info",    label: "Info" },
  ];

  const typeStyles = {
    success: {
      bg:   "bg-green-100 dark:bg-green-900/30",
      icon: "text-green-600 dark:text-green-400",
      dot:  "bg-green-500",
      badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    },
    warning: {
      bg:   "bg-amber-100 dark:bg-amber-900/30",
      icon: "text-amber-600 dark:text-amber-400",
      dot:  "bg-amber-500",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    },
    info: {
      bg:   "bg-blue-100 dark:bg-blue-900/30",
      icon: "text-blue-600 dark:text-blue-400",
      dot:  "bg-blue-500",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            Notifications
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? (
              <span><strong className="text-teal-600 dark:text-teal-400">{unreadCount}</strong> unread notification{unreadCount !== 1 ? "s" : ""}</span>
            ) : (
              "All caught up! No unread notifications."
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === f.key
                ? "bg-teal-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {f.label}
            {f.key === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white rounded-full" style={{ fontSize: "10px" }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No notifications found</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((n, index) => {
              const Icon = n.icon;
              const styles = typeStyles[n.type];
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => markAsRead(n.id)}
                  className={`flex items-start gap-4 p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer transition-colors ${
                    !n.isRead
                      ? "bg-teal-50/50 dark:bg-teal-900/10 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.bg}`}>
                    <Icon className={`w-5 h-5 ${styles.icon}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-semibold ${!n.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                          {n.title}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs capitalize ${styles.badge}`}>
                          {n.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!n.isRead && (
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${styles.dot}`} />
                        )}
                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{n.time}</span>
                      </div>
                    </div>
                    <p className={`text-sm mt-1 leading-relaxed ${!n.isRead ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}>
                      {n.message}
                    </p>
                    {!n.isRead && (
                      <p className="text-xs text-teal-600 dark:text-teal-400 mt-1.5">Click to mark as read</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
