import { Eye, ShieldCheck, ShieldX, Clock, CheckCircle, XCircle, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ViewDormitoryModal } from "../../components/admin/ViewDormitoryModal";
import { toast } from "sonner";
import { useDormitories } from "../../../hooks/useApi";

type RegStatus = "Pending" | "Verified" | "Rejected";

export function DormitoryListings() {
  const { dormitories: liveDormitories } = useDormitories(true);
  const [dormitories, setDormitories] = useState<any[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDormitory, setSelectedDormitory] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<"All" | RegStatus>("All");
  const [confirmModal, setConfirmModal] = useState<{ dorm: any; action: "Verified" | "Rejected" } | null>(null);

  useEffect(() => {
    setDormitories(liveDormitories.map((dorm, index) => ({
      ...dorm,
      registrationStatus: dorm.registrationStatus || (index % 3 === 0 ? "Pending" : "Verified"),
      registrationNumber: dorm.registrationNumber || `RS-${String(dorm.id).padStart(4, "0")}`
    })));
  }, [liveDormitories]);

  const handleViewDormitory = (dormitory: any) => {
    setSelectedDormitory(dormitory);
    setIsViewModalOpen(true);
  };

  const handleRegistrationAction = (dorm: any, action: "Verified" | "Rejected") => {
    setConfirmModal({ dorm, action });
  };

  const confirmAction = () => {
    if (!confirmModal) return;
    setDormitories(prev =>
      prev.map(d =>
        d.id === confirmModal.dorm.id
          ? { ...d, registrationStatus: confirmModal.action }
          : d
      )
    );
    if (confirmModal.action === "Verified") {
      toast.success(`${confirmModal.dorm.name} registration has been verified.`);
    } else {
      toast.error(`${confirmModal.dorm.name} registration has been rejected.`);
    }
    setConfirmModal(null);
  };

  const filtered = filterStatus === "All"
    ? dormitories
    : dormitories.filter(d => (d as any).registrationStatus === filterStatus);

  const counts = {
    All: dormitories.length,
    Pending: dormitories.filter(d => (d as any).registrationStatus === "Pending").length,
    Verified: dormitories.filter(d => (d as any).registrationStatus === "Verified").length,
    Rejected: dormitories.filter(d => (d as any).registrationStatus === "Rejected").length,
  };

  const regBadge = (status: RegStatus) => {
    if (status === "Verified") return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
        <ShieldCheck className="w-3.5 h-3.5" /> Verified
      </span>
    );
    if (status === "Pending") return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
        <Clock className="w-3.5 h-3.5" /> Pending
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        <ShieldX className="w-3.5 h-3.5" /> Rejected
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dormitory Listings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and verify dormitory registrations</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["All", "Pending", "Verified", "Rejected"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === tab
                ? "bg-[#0d9488] text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {tab}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              filterStatus === tab
                ? "bg-white/20 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dorm) => {
          const regStatus = (dorm as any).registrationStatus as RegStatus;
          const regNumber = (dorm as any).registrationNumber as string;
          return (
            <div key={dorm.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="relative">
                <img
                  src={dorm.images[0]}
                  alt={dorm.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  {regBadge(regStatus)}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dorm.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{dorm.location}</p>

                {/* Registration Number */}
                <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Registration No.</p>
                    <p className="text-sm font-mono font-medium text-gray-900 dark:text-white truncate">{regNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    dorm.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {dorm.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {dorm.available} / {dorm.capacity} available
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Owner</span>
                    <span className="font-medium text-gray-900 dark:text-white">{dorm.owner}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500 dark:text-gray-400">Monthly Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">₱{dorm.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 flex-1 flex flex-col justify-end">
                  <button
                    onClick={() => handleViewDormitory(dorm)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-lg text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>

                  {regStatus === "Pending" && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleRegistrationAction(dorm, "Verified")}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRegistrationAction(dorm, "Rejected")}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}

                  {regStatus === "Rejected" && (
                    <button
                      onClick={() => handleRegistrationAction(dorm, "Verified")}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Registration
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No dormitories found</p>
          <p className="text-sm mt-1">No dormitories with "{filterStatus}" registration status.</p>
        </div>
      )}

      <ViewDormitoryModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        dormitory={selectedDormitory}
      />

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              confirmModal.action === "Verified"
                ? "bg-emerald-100 dark:bg-emerald-900/30"
                : "bg-red-100 dark:bg-red-900/30"
            }`}>
              {confirmModal.action === "Verified"
                ? <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                : <ShieldX className="w-6 h-6 text-red-600 dark:text-red-400" />
              }
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              {confirmModal.action === "Verified" ? "Approve Registration?" : "Reject Registration?"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              {confirmModal.action === "Verified"
                ? `Verify registration number `
                : `Reject registration number `}
              <span className="font-mono font-semibold text-gray-700 dark:text-gray-200">
                {(confirmModal.dorm as any).registrationNumber}
              </span>
              {" "}for <span className="font-semibold">{confirmModal.dorm.name}</span>?
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm transition-colors ${
                  confirmModal.action === "Verified"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
