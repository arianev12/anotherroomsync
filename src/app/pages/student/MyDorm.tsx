import { useState } from "react";
import { useNavigate } from "react-router";
import { useStudent } from "../../contexts/StudentContext";
import { useDormitory } from "../../../hooks/useApi";
import { MapPin, Users, DollarSign, Calendar, Bell, LogOut, Phone, Mail, Receipt, X, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export function MyDorm() {
  const navigate = useNavigate();
  const { currentDorm, setCurrentDorm } = useStudent();
  const { dormitory, loading, error } = useDormitory(currentDorm?.id ?? null);
  const [activeTab, setActiveTab] = useState<"overview" | "payments">("overview");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const handleViewReceipt = (payment: any) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    alert("Receipt download started!");
  };

  if (!currentDorm) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Dormitory Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You haven't rented a dormitory yet. Find your perfect place to stay!
          </p>
          <button
            onClick={() => navigate('/student/find')}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Find Dormitory
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-700 dark:text-gray-200">Loading your dormitory details...</div>
      </div>
    );
  }

  if (error || !dormitory) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dormitory data unavailable</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {error ?? 'No dormitory information was found for your account.'}
          </p>
        </div>
      </div>
    );
  }

  const room = dormitory.rooms?.find((r: any) => String(r.room_number ?? r.roomNumber) === String(currentDorm.roomNumber));
  const roomPrice = Number(room?.price ?? dormitory.price ?? 0);
  const roomCapacity = Number(room?.capacity ?? currentDorm.roomCapacity ?? 0);
  const roomOccupied = Number(room?.current_occupants ?? room?.occupied ?? 0);
  const roomAvailable = Math.max(roomCapacity - roomOccupied, 0);
  const ownerName = [dormitory.owner_first_name, dormitory.owner_last_name].filter(Boolean).join(' ') || 'Owner information unavailable';
  const ownerEmail = dormitory.owner_email ?? 'Not available';
  const ownerPhone = dormitory.owner_phone ?? 'Not available';
  const amenities = Array.isArray(dormitory.amenities_list) ? dormitory.amenities_list : dormitory.amenities?.split(', ') ?? [];
  const imageUrl = dormitory.images_json?.[0] ?? dormitory.images?.[0] ?? 'https://via.placeholder.com/800x450?text=Dorm+Image';
  const dormAddress = dormitory.address ?? dormitory.location ?? 'Address not available';

  const handleLeaveDorm = () => {
    setCurrentDorm(null);
    toast.success("You have left the dormitory. Good luck!");
    navigate('/student');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Dormitory</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your current residence and payment information</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-[#0d9488] text-[#0d9488] dark:border-[#14b8a6] dark:text-[#14b8a6] font-medium"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <MapPin className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === "payments"
              ? "border-[#0d9488] text-[#0d9488] dark:border-[#14b8a6] dark:text-[#14b8a6] font-medium"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Receipt className="w-4 h-4" />
          Payments
        </button>
      </div>

      {activeTab === "overview" && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="relative h-64">
              <img
                src={imageUrl}
                alt={dormitory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl font-bold text-white mb-1">{dormitory.name}</h2>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{dormAddress}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Your Room</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">Room {currentDorm.roomNumber}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Capacity: {roomCapacity} persons</p>
                    <p>Occupied: {roomOccupied}/{roomCapacity}</p>
                    <p>Available: {roomAvailable}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Rent</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">₱{roomPrice.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Payment details are synced from your owner and tenant records.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Owner Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{ownerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{ownerEmail}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {amenities.length > 0 ? amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-sm"
                    >
                      {amenity}
                    </span>
                  )) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">No amenities listed yet.</span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                <button
                  onClick={handleLeaveDorm}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  Leave Dormitory
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  If you plan to move out, please notify the owner in advance.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "payments" && (
        <>
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-300 font-medium">Payment Information</p>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  Payment records are loaded from the database once your lease is confirmed.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Payment Status</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{dormitory.name} - Room {currentDorm.roomNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Rent</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">₱{roomPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Next Due Date</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">TBD</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Payment Instructions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dormitory Owner</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{ownerName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact Details</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{ownerPhone}</p>
                  </div>
                </div>
                <div className="p-3 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 rounded-lg">
                  <p className="text-sm text-teal-800 dark:text-teal-300">
                    💡 Please coordinate with the owner to confirm accepted payment methods.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment History</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Payment information will appear here once your lease and payments are recorded in the database.
            </div>
          </div>
        </>
      )}

      {showReceiptModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Receipt Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Payment history for your current dormitory</p>
              </div>
              <button onClick={() => setShowReceiptModal(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">Receipt: {selectedPayment.receiptNumber}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Amount: ₱{selectedPayment.amount.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Paid on: {new Date(selectedPayment.paidOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={handlePrintReceipt} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">Print</button>
                <button onClick={handleDownloadReceipt} className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700">Download</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
