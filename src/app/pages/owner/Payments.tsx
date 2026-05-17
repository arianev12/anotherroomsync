import { Bell, Calendar, CheckCircle, Clock, AlertCircle, Search, X, Printer, Download, FileText, Receipt } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlassmorphismCard } from "../../components/GlassmorphismCard";

interface Payment {
  id: number;
  tenantName: string;
  roomNumber: string;
  monthlyRent: number;
  dueDate: string;
  status: string;
  paidDate?: string;
  receiptNumber?: string;
}

export function OwnerPayments() {
  const [activeTab, setActiveTab] = useState<"reminders" | "history">("reminders");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [paymentsList, setPaymentsList] = useState<Payment[]>([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const filteredPayments = paymentsList.filter(payment => {
    const matchesSearch = payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.roomNumber.includes(searchTerm);
    const matchesFilter = filterStatus === "All" || payment.status === filterStatus;

    // For history tab, only show paid payments
    if (activeTab === "history") {
      return matchesSearch && payment.status === "Paid";
    }

    return matchesSearch && matchesFilter;
  });

  const paidPayments = paymentsList.filter(p => p.status === "Paid");

  const stats = {
    totalPaid: paymentsList.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.monthlyRent, 0),
    totalUnpaid: paymentsList.filter(p => p.status === "Unpaid").reduce((sum, p) => sum + p.monthlyRent, 0),
    paidCount: paymentsList.filter(p => p.status === "Paid").length,
    unpaidCount: paymentsList.filter(p => p.status === "Unpaid").length,
  };

  const collectionRate = paymentsList.length > 0 ? Math.round((stats.paidCount / paymentsList.length) * 100) : 0;

  const today = new Date('2026-03-15');

  const handleMarkAsPaid = (paymentId: number) => {
    const payment = paymentsList.find(p => p.id === paymentId);
    if (!payment) return;

    const receiptNumber = `RS-${Date.now()}-${paymentId}`;
    const paidDate = new Date().toISOString();

    setPaymentsList(paymentsList.map(p => 
      p.id === paymentId 
        ? { ...p, status: "Paid", paidDate, receiptNumber } 
        : p
    ));
    
    setSelectedPayment({ ...payment, status: "Paid", paidDate, receiptNumber });
    setShowReceiptModal(true);
    toast.success(`Payment from ${payment.tenantName} marked as paid!`);
  };

  const handleViewReceipt = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    toast.success("Receipt download started!");
    // In a real app, this would generate a PDF
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Payment Tracking</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monitor tenant payment reminders and status</p>
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
          Payment History ({paidPayments.length})
        </button>
      </div>

      {/* Important Note - Only show on reminders tab */}
      {activeTab === "reminders" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 dark:text-blue-300 font-medium">Payment Tracking System</p>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                This system helps you track payment reminders for your tenants. Mark payments as "Paid" after receiving them.
                Payment collection should be done directly with your tenants.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards - Only show on reminders tab */}
      {activeTab === "reminders" && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Collected</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">₱{stats.totalPaid.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">{stats.paidCount} payments</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">₱{stats.totalUnpaid.toLocaleString()}</p>
              <p className="text-xs text-amber-600 mt-1">{stats.unpaidCount} payments</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Collection Rate</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {collectionRate}%
              </p>
              <p className="text-xs text-blue-600 mt-1">This month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Expected</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                ₱{(stats.totalPaid + stats.totalUnpaid).toLocaleString()}
              </p>
              <p className="text-xs text-purple-600 mt-1">Monthly rent</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </GlassmorphismCard>
      </div>
      )}

      {/* Filters and Search */}
      <GlassmorphismCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by tenant name or room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          {activeTab === "reminders" && (
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("All")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === "All"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                All ({paymentsList.length})
              </button>
              <button
                onClick={() => setFilterStatus("Paid")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === "Paid"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Paid ({stats.paidCount})
              </button>
              <button
                onClick={() => setFilterStatus("Unpaid")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === "Unpaid"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Unpaid ({stats.unpaidCount})
              </button>
            </div>
          )}
        </div>
      </GlassmorphismCard>

      {/* Payment List */}
      <GlassmorphismCard padding={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="py-3 px-6 text-sm font-medium text-gray-600 dark:text-gray-400 text-left"> Tenant</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Room</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {activeTab === "history" ? "Receipt" : "Action"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.map((payment) => {
                const dueDate = new Date(payment.dueDate);
                const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysUntilDue < 0 && payment.status === "Unpaid";
                
                return (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900 dark:text-white">{payment.tenantName}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700 dark:text-gray-300">{payment.roomNumber}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900 dark:text-white">₱{payment.monthlyRent.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {new Date(payment.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        {payment.status === "Unpaid" && activeTab === "reminders" && (
                          <p className={`text-xs mt-0.5 ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {isOverdue ? `Overdue by ${Math.abs(daysUntilDue)} days` : `Due in ${daysUntilDue} days`}
                          </p>
                        )}
                        {activeTab === "history" && payment.paidDate && (
                          <p className="text-xs mt-0.5 text-green-600 dark:text-green-400">
                            Paid: {new Date(payment.paidDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        payment.status === "Paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : isOverdue
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {payment.status === "Paid" ? "Paid" : isOverdue ? "Overdue" : "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {activeTab === "history" ? (
                        <button
                          onClick={() => handleViewReceipt(payment)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d9488] dark:bg-[#14b8a6] text-white text-sm rounded-lg hover:bg-[#0f766e] dark:hover:bg-[#0d9488] transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          View Receipt
                        </button>
                      ) : payment.status === "Unpaid" ? (
                        <button
                          onClick={() => handleMarkAsPaid(payment.id)}
                          className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          Mark as Paid
                        </button>
                      ) : (
                        <button
                          onClick={() => handleViewReceipt(payment)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          View Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab === "history"
                  ? "No payment history yet"
                  : "No payments found matching your criteria"}
              </p>
            </div>
          )}
        </div>
      </GlassmorphismCard>

      {/* Tips for Owners - Only show on reminders tab */}
      {activeTab === "reminders" && (
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl border border-teal-200 dark:border-teal-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Payment Collection Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📱</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Send Reminders</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Remind tenants 3-5 days before due date</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💳</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Offer Multiple Methods</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">GCash, Bank Transfer, or Cash</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📝</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Issue Receipts</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Always provide payment confirmation</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">⏰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Track Promptly</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Update status immediately after receiving</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Payment Receipt</h2>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
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
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">RoomSync</h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Dormitory Management System</p>
                </div>

                {/* Receipt Title */}
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-3 sm:mb-4">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Payment Received</h2>
                  <p className="text-sm sm:text-base text-gray-600 px-4">Official payment receipt for your records</p>
                </div>

                {/* Receipt Details */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pb-3 border-b border-gray-200">
                      <span className="text-xs sm:text-sm font-medium text-gray-500">Receipt Number</span>
                      <span className="text-xs sm:text-sm font-mono font-semibold text-teal-600 break-all">
                        {selectedPayment.receiptNumber || 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pb-3 border-b border-gray-200">
                      <span className="text-xs sm:text-sm font-medium text-gray-500">Payment Date</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 text-right">
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

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pb-3 border-b border-gray-200">
                      <span className="text-xs sm:text-sm font-medium text-gray-500">Tenant Name</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">{selectedPayment.tenantName}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pb-3 border-b border-gray-200">
                      <span className="text-xs sm:text-sm font-medium text-gray-500">Room Number</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">Room {selectedPayment.roomNumber}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pb-3 border-b border-gray-200">
                      <span className="text-xs sm:text-sm font-medium text-gray-500">Due Date</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {new Date(selectedPayment.dueDate).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 pt-3">
                      <span className="text-sm sm:text-base font-semibold text-gray-900">Amount Paid</span>
                      <span className="text-xl sm:text-2xl font-bold text-teal-600">
                        ₱{selectedPayment.monthlyRent.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Status Badge */}
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-100 text-green-800 rounded-full">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base font-semibold">Payment Confirmed</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-blue-900 font-medium mb-1">📝 Important Information</p>
                  <p className="text-xs text-blue-700">
                    This receipt serves as proof of payment. Please keep it for your records. 
                    For any questions or concerns, please contact your dormitory owner.
                  </p>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 sm:pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Generated on {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    RoomSync Dormitory Management System • www.roomsync.com
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex-shrink-0">
              <button
                onClick={handlePrintReceipt}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base order-2 sm:order-1"
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