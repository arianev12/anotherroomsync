import { Bell, Calendar, AlertCircle, CheckCircle, Clock, Receipt, FileText, X, Printer, Download, Smartphone } from "lucide-react";
import { useState } from "react";
import { GCashPaymentModal } from "../../components/student/GCashPaymentModal";

export function StudentPayments() {
  const [activeTab, setActiveTab] = useState<"reminders" | "history">("reminders");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showGCashModal, setShowGCashModal] = useState(false);

  const currentReminder = {
    amount: 2500,
    dueDate: "2026-03-31",
    status: "Upcoming",
    roomNumber: "101",
    dormitory: "Arasof Student Lodge",
    ownerName: "Maria Santos",
    ownerContact: "+63 912 345 6789",
    ownerGCashQR: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ownerGCashNumber: "09123456789",
    ownerGCashName: "Maria Santos"
  };

  const paymentHistory = [
    { id: 1, month: "February 2026", amount: 2500, dueDate: "2026-02-28", status: "Paid", paidOn: "2026-02-27", receiptNumber: "RS-1709053200-1" },
    { id: 2, month: "January 2026", amount: 2500, dueDate: "2026-01-31", status: "Paid", paidOn: "2026-01-30", receiptNumber: "RS-1706659200-2" },
    { id: 3, month: "December 2025", amount: 2500, dueDate: "2025-12-31", status: "Paid", paidOn: "2025-12-28", receiptNumber: "RS-1703721600-3" },
    { id: 4, month: "November 2025", amount: 2500, dueDate: "2025-11-30", status: "Paid", paidOn: "2025-11-29", receiptNumber: "RS-1701129600-4" },
  ];

  const today = new Date('2026-03-15');
  const dueDate = new Date(currentReminder.dueDate);
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const handleViewReceipt = (payment: any) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate a PDF
    alert("Receipt download started!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Payment Reminders</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your monthly rent payment schedule</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("reminders")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === "reminders"
              ? "border-[#0d9488] text-[#0d9488] dark:border-[#14b8a6] dark:text-[#14b8a6] font-medium"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Bell className="w-4 h-4" />
          Payment Reminders
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === "history"
              ? "border-[#0d9488] text-[#0d9488] dark:border-[#14b8a6] dark:text-[#14b8a6] font-medium"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Receipt className="w-4 h-4" />
          Payment History ({paymentHistory.length})
        </button>
      </div>

      {/* Important Note - Only show on reminders tab */}
      {activeTab === "reminders" && (
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 dark:text-blue-300 font-medium">Payment Information</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              This is a reminder system only. Please make payments directly to your dormitory owner using the contact information provided below. 
              The owner will update your payment status after confirming receipt.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Current Payment Reminder - Only show on reminders tab */}
      {activeTab === "reminders" && (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Payment</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentReminder.dormitory} - Room {currentReminder.roomNumber}</p>
          </div>
          {daysUntilDue <= 7 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">Due in {daysUntilDue} days</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Rent</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">₱{currentReminder.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {new Date(currentReminder.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Contact Information */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Payment Instructions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dormitory Owner</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{currentReminder.ownerName}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contact Number</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{currentReminder.ownerContact}</p>
              </div>
            </div>
            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 rounded-lg">
              <p className="text-sm text-teal-800 dark:text-teal-300">
                💡 <strong>Tip:</strong> Contact your owner to confirm payment methods (GCash, Bank Transfer, Cash, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowGCashModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
            >
              <Smartphone className="w-5 h-5" />
              Pay via GCash
            </button>
            <button className="flex-1 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              Mark as Paid
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Use GCash for instant payment or mark as paid after manual payment
          </p>
        </div>
      </div>
      )}

      {/* Payment History */}
      {activeTab === "history" ? (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment History</h2>
        <div className="space-y-3">
          {paymentHistory.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{payment.month}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Paid on {new Date(payment.paidOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Receipt: {payment.receiptNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">₱{payment.amount.toLocaleString()}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Paid
                  </span>
                </div>
                <button
                  onClick={() => handleViewReceipt({ 
                    ...payment, 
                    tenantName: "Current Student",
                    roomNumber: currentReminder.roomNumber,
                    dormitory: currentReminder.dormitory,
                    monthlyRent: payment.amount,
                    paidDate: payment.paidOn
                  })}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d9488] dark:bg-[#14b8a6] text-white text-sm rounded-lg hover:bg-[#0f766e] dark:hover:bg-[#0d9488] transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  View Receipt
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">Total Paid</p>
            <p className="text-2xl font-semibold text-green-900 dark:text-green-400">₱10,000</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Last 4 months</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">On-Time Payments</p>
            <p className="text-2xl font-semibold text-blue-900 dark:text-blue-400">100%</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Great record!</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Next Payment</p>
            <p className="text-2xl font-semibold text-purple-900 dark:text-purple-400">{daysUntilDue} days</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Until due date</p>
          </div>
        </div>
      </div>
      ) : (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Payment History</h2>
        <div className="space-y-3">
          {paymentHistory.slice(0, 2).map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  payment.status === 'Paid' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {payment.status === 'Paid' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{payment.month}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {payment.status === 'Paid' 
                      ? `Paid on ${new Date(payment.paidOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                      : `Due: ${new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">₱{payment.amount.toLocaleString()}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  payment.status === 'Paid' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setActiveTab("history")}
          className="w-full mt-4 py-2.5 text-[#0d9488] dark:text-[#14b8a6] hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
        >
          View All Payment History →
        </button>
      </div>
      )}

      {/* Tips Section - Only show on reminders tab */}
      {activeTab === "reminders" && (
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/30 dark:to-blue-900/30 rounded-xl border border-teal-200 dark:border-teal-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Payment Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📅</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Pay on Time</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Set reminders 3-5 days before due date</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📱</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Keep Receipts</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Save transaction screenshots for records</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Communicate Early</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Inform owner if you'll pay late</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">✅</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Confirm Payment</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Always get confirmation from owner</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* GCash Payment Modal */}
      <GCashPaymentModal
        isOpen={showGCashModal}
        onClose={() => setShowGCashModal(false)}
        ownerName={currentReminder.ownerName}
        ownerGCashQR={currentReminder.ownerGCashQR}
        ownerGCashNumber={currentReminder.ownerGCashNumber}
        ownerGCashName={currentReminder.ownerGCashName}
        amount={currentReminder.amount}
        dueDate={currentReminder.dueDate}
        dormitory={currentReminder.dormitory}
        roomNumber={currentReminder.roomNumber}
      />

      {/* Receipt Modal */}
      {showReceiptModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Payment Receipt</h2>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Receipt Content - Scrollable */}
            <div className="overflow-y-auto flex-1">
              <div className="p-4 sm:p-8" id="receipt-content">
                {/* RoomSync Branding */}
                <div className="text-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-teal-500">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl mb-3">
                    <span className="text-xl sm:text-2xl font-bold text-white">RS</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">RoomSync</h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Dormitory Management System</p>
                </div>

                {/* Receipt Title */}
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-3 sm:mb-4">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Received</h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">Official payment receipt for your records</p>
                </div>

                {/* Receipt Details */}
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Receipt Number</span>
                      <span className="text-xs sm:text-sm font-mono font-semibold text-teal-600 dark:text-teal-400 break-all">
                        {selectedPayment.receiptNumber || 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Payment Date</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white text-right">
                        {selectedPayment.paidDate 
                          ? new Date(selectedPayment.paidDate).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) 
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Dormitory</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{selectedPayment.dormitory || currentReminder.dormitory}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Room Number</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Room {selectedPayment.roomNumber}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Period</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{selectedPayment.month}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 pt-3">
                      <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Amount Paid</span>
                      <span className="text-xl sm:text-2xl font-bold text-teal-600 dark:text-teal-400">
                        ₱{selectedPayment.monthlyRent?.toLocaleString() || selectedPayment.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Status Badge */}
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base font-semibold">Payment Confirmed</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-300 font-medium mb-1">📝 Important Information</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    This receipt serves as proof of payment. Please keep it for your records. 
                    For any questions or concerns, please contact your dormitory owner.
                  </p>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Generated on {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    RoomSync Dormitory Management System • www.roomsync.com
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl flex-shrink-0">
              <button
                onClick={handlePrintReceipt}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base order-2 sm:order-1"
              >
                <Printer className="w-4 h-4" />
                Print Receipt
              </button>
              <button
                onClick={handleDownloadReceipt}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm sm:text-base order-1 sm:order-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}