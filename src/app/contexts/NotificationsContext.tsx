import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export type NotifType = "success" | "warning" | "info";

export interface Notification {
  id: number;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  icon: React.ElementType;
  isRead: boolean;
}

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  initForRole: (role: "admin" | "owner" | "student", extras?: Notification[]) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

const adminNotifications: Notification[] = [
  { id: 1, type: "success", title: "New Owner Registered",      message: "Maria Santos has successfully registered as a dormitory owner.",     time: "10 min ago",  icon: CheckCircle, isRead: false },
  { id: 2, type: "info",    title: "New Dormitory Submission",  message: "RedHawks Student Hub submitted for approval.",                         time: "1 hour ago",  icon: Info,        isRead: false },
  { id: 3, type: "warning", title: "Pending Approvals",         message: "3 dormitories are waiting for admin approval.",                        time: "3 hours ago", icon: AlertCircle, isRead: true  },
  { id: 4, type: "info",    title: "Dormitory Updated",         message: "Arasof Student Lodge updated their listing information.",              time: "1 day ago",   icon: Info,        isRead: true  },
  { id: 5, type: "warning", title: "ID Verification Needed",    message: "2 owner accounts are pending ID verification.",                        time: "2 days ago",  icon: AlertCircle, isRead: true  },
];

const ownerNotifications: Notification[] = [
  { id: 1, type: "warning", title: "Maintenance Request",  message: "Room 101: Leaking faucet reported by Sofia Chen.",                    time: "15 min ago",  icon: AlertCircle, isRead: false },
  { id: 2, type: "info",    title: "New Tenant Request",   message: "Miguel Torres requested to rent Room 203.",                           time: "1 hour ago",  icon: Info,        isRead: false },
  { id: 3, type: "success", title: "Viewing Schedule",     message: "Isabella Garcia scheduled a viewing for tomorrow at 2 PM.",           time: "2 hours ago", icon: CheckCircle, isRead: false },
  { id: 4, type: "warning", title: "Payment Reminder",     message: "2 tenants have pending payments due this week.",                      time: "5 hours ago", icon: AlertCircle, isRead: true  },
  { id: 5, type: "success", title: "Room Vacancy Filled",  message: "Room 102 has been successfully rented by a new tenant.",             time: "1 day ago",   icon: CheckCircle, isRead: true  },
  { id: 6, type: "info",    title: "Contract Expiring",    message: "3 tenant contracts are expiring within the next 30 days.",           time: "2 days ago",  icon: Info,        isRead: true  },
];

const studentBaseNotifications: Notification[] = [
  { id: 1, type: "success", title: "Booking Confirmed",      message: "Your booking for Arasof Student Lodge has been approved!",              time: "20 min ago", icon: CheckCircle, isRead: false },
  { id: 2, type: "info",    title: "Maintenance Update",     message: "Your maintenance request for Room 101 is now in progress.",             time: "1 hour ago", icon: Info,        isRead: false },
  { id: 3, type: "info",    title: "New Dormitory Listing",  message: "BatStateU Gateway Dormitel now available near campus.",                 time: "1 day ago",  icon: Info,        isRead: true  },
  { id: 4, type: "success", title: "Roommate Match",         message: "You have a new potential roommate match (95% compatibility).",          time: "2 days ago", icon: CheckCircle, isRead: true  },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentRole, setCurrentRole] = useState<string>("");

  const initForRole = (role: "admin" | "owner" | "student", extras: Notification[] = []) => {
    if (role === currentRole) return;
    setCurrentRole(role);
    const base =
      role === "admin" ? adminNotifications :
      role === "owner" ? ownerNotifications :
      studentBaseNotifications;
    setNotifications([...extras, ...base]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, initForRole }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
