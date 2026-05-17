import { useState, useRef, useEffect } from "react";
import {
  X, User, BookOpen, CreditCard, MessageCircle,
  CheckCircle, Clock, AlertCircle, Download,
  Send, ChevronRight, DollarSign, TrendingUp, Calendar,
  Receipt, Image as ImageIcon, XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ── Types ──────────────────────────────────────────────────────────────────
export interface TenantInfo {
  id: number;
  name: string;
  roomNumber: string;
  email: string;
  course: string;
  moveInDate: string;
  paymentStatus: string;
  phone?: string;
  monthlyRent?: number;
  image?: string;
}

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "charge" | "payment" | "adjustment";
  status: "Paid" | "Pending" | "Overdue";
  receiptNo?: string;
}

interface Message {
  id: number;
  sender: "owner" | "tenant";
  text: string;
  timestamp: string;
  read: boolean;
}

interface PendingPayment {
  id: number;
  amount: number;
  referenceNumber: string;
  receipt: string;
  submittedDate: string;
  month: string;
  status: "pending" | "approved" | "rejected";
}

// ── Mock data factory ──────────────────────────────────────────────────────
function generateLedger(tenant: TenantInfo): Transaction[] {
  const rent = tenant.monthlyRent ?? 2500;
  const base: Transaction[] = [
    { id: 1, date: "2026-05-01", description: "Monthly Rent — May 2026", amount: rent, type: "charge", status: "Pending" },
    { id: 2, date: "2026-04-01", description: "Monthly Rent — April 2026", amount: rent, type: "charge", status: "Paid", receiptNo: `RS-2604-${tenant.id}01` },
    { id: 3, date: "2026-04-02", description: "Payment Received", amount: rent, type: "payment", status: "Paid", receiptNo: `RX-2604-${tenant.id}01` },
    { id: 4, date: "2026-03-01", description: "Monthly Rent — March 2026", amount: rent, type: "charge", status: "Paid", receiptNo: `RS-2603-${tenant.id}01` },
    { id: 5, date: "2026-03-03", description: "Payment Received", amount: rent, type: "payment", status: "Paid", receiptNo: `RX-2603-${tenant.id}01` },
    { id: 6, date: "2026-02-01", description: "Monthly Rent — February 2026", amount: rent, type: "charge", status: "Paid", receiptNo: `RS-2602-${tenant.id}01` },
    { id: 7, date: "2026-02-05", description: "Payment Received", amount: rent, type: "payment", status: "Paid", receiptNo: `RX-2602-${tenant.id}01` },
    { id: 8, date: "2026-01-01", description: "Monthly Rent — January 2026", amount: rent, type: "charge", status: "Paid", receiptNo: `RS-2601-${tenant.id}01` },
    { id: 9, date: "2026-01-04", description: "Payment Received", amount: rent, type: "payment", status: "Paid", receiptNo: `RX-2601-${tenant.id}01` },
    { id: 10, date: tenant.moveInDate, description: "Security Deposit", amount: rent, type: "charge", status: "Paid", receiptNo: `DP-${tenant.id}01` },
    { id: 11, date: tenant.moveInDate, description: "Security Deposit Paid", amount: rent, type: "payment", status: "Paid", receiptNo: `DX-${tenant.id}01` },
  ];
  return base;
}

function generateMessages(tenant: TenantInfo): Message[] {
  return [
    { id: 1, sender: "owner", text: `Hi ${tenant.name.split(" ")[0]}, welcome to the dormitory! Let me know if you need anything.`, timestamp: "2026-01-15 10:00", read: true },
    { id: 2, sender: "tenant", text: "Thank you! The room is great. I'll settle in today.", timestamp: "2026-01-15 10:30", read: true },
    { id: 3, sender: "owner", text: "Just a reminder that rent is due on the 1st of each month.", timestamp: "2026-03-28 09:00", read: true },
    { id: 4, sender: "tenant", text: "Got it, thank you for the reminder!", timestamp: "2026-03-28 09:45", read: true },
    { id: 5, sender: "owner", text: `Hi ${tenant.name.split(" ")[0]}, your May rent of ₱${(tenant.monthlyRent ?? 2500).toLocaleString()} is now due.`, timestamp: "2026-05-01 08:00", read: false },
  ];
}

// ── Sub-components ─────────────────────────────────────────────────────────
const statusBadge = (status: string) => {
  if (status === "Paid") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><CheckCircle className="w-3 h-3" />Paid</span>;
  if (status === "Pending") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><Clock className="w-3 h-3" />Pending</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><AlertCircle className="w-3 h-3" />Overdue</span>;
};

// ── Main Component ─────────────────────────────────────────────────────────
interface TenantLedgerModalProps {
  tenant: TenantInfo | null;
  onClose: () => void;
}

type Tab = "overview" | "ledger" | "messages" | "pending";

function generatePendingPayments(tenant: TenantInfo): PendingPayment[] {
  return [
    {
      id: 1,
      amount: tenant.monthlyRent ?? 2500,
      referenceNumber: "1234567890123",
      receipt: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      submittedDate: "2026-05-02",
      month: "May 2026",
      status: "pending"
    }
  ];
}

export function TenantLedgerModal({ tenant, onClose }: TenantLedgerModalProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const [messages, setMessages] = useState<Message[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tenant) {
      setMessages(generateMessages(tenant));
      setTransactions(generateLedger(tenant));
      setPendingPayments(generatePendingPayments(tenant));
      setTab("overview");
    }
  }, [tenant]);

  useEffect(() => {
    if (tab === "messages") messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, tab]);

  if (!tenant) return null;

  const rent = tenant.monthlyRent ?? 2500;
  const charges = transactions.filter(t => t.type === "charge").reduce((s, t) => s + t.amount, 0);
  const payments = transactions.filter(t => t.type === "payment").reduce((s, t) => s + t.amount, 0);
  const balance = charges - payments;
  const pendingTx = transactions.filter(t => t.type === "charge" && t.status === "Pending");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: "owner",
      text: newMessage.trim(),
      timestamp: new Date().toLocaleString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      read: true,
    }]);
    setNewMessage("");
  };

  const handleApprovePayment = (paymentId: number) => {
    setPendingPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: "approved" } : p));
    setTimeout(() => {
      setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
    }, 1500);
  };

  const handleRejectPayment = (paymentId: number) => {
    setPendingPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: "rejected" } : p));
    setTimeout(() => {
      setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
    }, 1500);
  };

  const pendingCount = pendingPayments.filter(p => p.status === "pending").length;

  const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
    { id: "ledger", label: "Ledger", icon: <CreditCard className="w-4 h-4" /> },
    { id: "pending", label: "Pending", icon: <Receipt className="w-4 h-4" />, badge: pendingCount },
    { id: "messages", label: "Messages", icon: <MessageCircle className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* ── Header ── */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5 flex items-start justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white border-2 border-white/30">
                {tenant.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{tenant.name}</h2>
                <p className="text-teal-100 text-sm mt-0.5">{tenant.course}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-teal-200">Room {tenant.roomNumber}</span>
                  <span className="text-teal-300">·</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${balance > 0 ? "bg-red-400/80 text-white" : "bg-emerald-400/80 text-white"}`}>
                    {balance > 0 ? `₱${balance.toLocaleString()} due` : "Fully paid"}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* ── Tabs ── */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 relative ${
                  tab === t.id
                    ? "border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {t.icon} {t.label}
                {t.badge && t.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {tab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-6 space-y-5">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: <DollarSign className="w-5 h-5 text-teal-600" />, label: "Monthly Rent", value: `₱${rent.toLocaleString()}`, bg: "bg-teal-50 dark:bg-teal-900/20" },
                      { icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, label: "Total Paid", value: `₱${payments.toLocaleString()}`, bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                      { icon: <AlertCircle className="w-5 h-5 text-amber-600" />, label: "Balance Due", value: balance > 0 ? `₱${balance.toLocaleString()}` : "₱0", bg: balance > 0 ? "bg-amber-50 dark:bg-amber-900/20" : "bg-gray-50 dark:bg-gray-900" },
                    ].map(s => (
                      <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                        <div className="flex justify-center mb-2">{s.icon}</div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tenant Info */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tenant Information</h3>
                    {[
                      { label: "Full Name", value: tenant.name },
                      { label: "Email", value: tenant.email },
                      { label: "Phone", value: tenant.phone ?? "+63 9XX XXX XXXX" },
                      { label: "Course", value: tenant.course },
                      { label: "Room", value: `Room ${tenant.roomNumber}` },
                      { label: "Move-in Date", value: new Date(tenant.moveInDate).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{row.label}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pending bills */}
                  {pendingTx.length > 0 && (
                    <div className="border border-amber-200 dark:border-amber-800 rounded-xl p-4 bg-amber-50 dark:bg-amber-900/20">
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3">Outstanding Bills</p>
                      {pendingTx.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between text-sm">
                          <span className="text-amber-700 dark:text-amber-300">{tx.description}</span>
                          <span className="font-bold text-amber-800 dark:text-amber-200">₱{tx.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setTab("ledger")} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all group">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-teal-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">View Ledger</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
                    </button>
                    <button onClick={() => setTab("messages")} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all group">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-teal-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Send Message</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
                    </button>
                  </div>
                </motion.div>
              )}

              {tab === "ledger" && (
                <motion.div key="ledger" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-6 space-y-4">
                  {/* Summary bar */}
                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Charged</p>
                      <p className="font-bold text-gray-900 dark:text-white mt-0.5">₱{charges.toLocaleString()}</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Paid</p>
                      <p className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">₱{payments.toLocaleString()}</p>
                    </div>
                    <div className={`rounded-xl p-3 ${balance > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-teal-50 dark:bg-teal-900/20"}`}>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                      <p className={`font-bold mt-0.5 ${balance > 0 ? "text-red-600 dark:text-red-400" : "text-teal-600 dark:text-teal-400"}`}>
                        {balance > 0 ? `₱${balance.toLocaleString()} due` : "Settled"}
                      </p>
                    </div>
                  </div>

                  {/* Transaction list */}
                  <div className="space-y-2">
                    {transactions.map(tx => (
                      <div key={tx.id} className={`flex items-center justify-between p-3 rounded-xl border ${
                        tx.type === "payment"
                          ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800"
                          : tx.status === "Pending"
                          ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
                          : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            tx.type === "payment" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-gray-100 dark:bg-gray-800"
                          }`}>
                            {tx.type === "payment"
                              ? <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              : <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            }
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.description}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</p>
                              {tx.receiptNo && <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{tx.receiptNo}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <p className={`text-sm font-bold ${tx.type === "payment" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}>
                            {tx.type === "payment" ? "+" : "-"}₱{tx.amount.toLocaleString()}
                          </p>
                          <div className="mt-0.5">{statusBadge(tx.status)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors">
                    <Download className="w-4 h-4" /> Download Statement
                  </button>
                </motion.div>
              )}

              {tab === "pending" && (
                <motion.div key="pending" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Payment Verifications</h2>

                  {pendingPayments.length === 0 ? (
                    <div className="text-center py-12">
                      <Receipt className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No pending payments</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Payment receipts will appear here for verification</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingPayments.map(payment => (
                        <div
                          key={payment.id}
                          className={`border rounded-xl p-5 transition-all ${
                            payment.status === "approved"
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                              : payment.status === "rejected"
                              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                              : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Receipt Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={payment.receipt}
                                alt="Payment Receipt"
                                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setSelectedReceipt(payment.receipt)}
                              />
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">Click to view</p>
                            </div>

                            {/* Payment Details */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white">{payment.month} Payment</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    Submitted on {new Date(payment.submittedDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </p>
                                </div>
                                <span className="text-xl font-bold text-teal-600 dark:text-teal-400">₱{payment.amount.toLocaleString()}</span>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500 dark:text-gray-400">Reference Number</span>
                                  <span className="font-mono font-semibold text-gray-900 dark:text-white">{payment.referenceNumber}</span>
                                </div>
                              </div>

                              {/* Status or Actions */}
                              {payment.status === "approved" ? (
                                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                  <CheckCircle className="w-5 h-5" />
                                  <span className="font-semibold">Payment Approved</span>
                                </div>
                              ) : payment.status === "rejected" ? (
                                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                  <XCircle className="w-5 h-5" />
                                  <span className="font-semibold">Payment Rejected</span>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApprovePayment(payment.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectPayment(payment.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Info Box */}
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mt-6">
                    <p className="text-sm text-blue-900 dark:text-blue-300 font-medium mb-1">💡 Payment Verification Tips</p>
                    <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                      <li>Verify the reference number in your GCash transaction history</li>
                      <li>Check if the amount matches the expected payment</li>
                      <li>Confirm the date is within the payment period</li>
                      <li>Contact tenant if details don't match before rejecting</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {tab === "messages" && (
                <motion.div key="messages" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full" style={{ minHeight: 400 }}>
                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === "owner" ? "justify-end" : "justify-start"}`}>
                        {msg.sender === "tenant" && (
                          <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-xs font-bold text-teal-700 dark:text-teal-300 mr-2 flex-shrink-0 self-end">
                            {tenant.name.charAt(0)}
                          </div>
                        )}
                        <div className={`max-w-[72%]`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            msg.sender === "owner"
                              ? "bg-teal-600 text-white rounded-br-md"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md"
                          }`}>
                            {msg.text}
                          </div>
                          <p className={`text-xs text-gray-400 dark:text-gray-500 mt-1 ${msg.sender === "owner" ? "text-right" : ""}`}>
                            {msg.timestamp}
                            {msg.sender === "owner" && <span className="ml-1">{msg.read ? "· Seen" : "· Sent"}</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 flex-shrink-0 bg-white dark:bg-gray-800">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendMessage()}
                      placeholder={`Message ${tenant.name.split(" ")[0]}…`}
                      className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder-gray-400"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="w-10 h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Receipt Preview Modal */}
        {selectedReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => setSelectedReceipt(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <img
                src={selectedReceipt}
                alt="Payment Receipt Full View"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
