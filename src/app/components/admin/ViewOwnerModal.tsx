import { X, Mail, Phone, Building2, Edit, Trash2, FileText } from "lucide-react";

interface Owner {
  id: number;
  name: string;
  email: string;
  phone: string;
  dormitories: number;
  status: string;
  idType?: string;
  idNumber?: string;
  idImages?: {
    front?: string;
    back?: string;
  };
}

interface ViewOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner: Owner | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function ViewOwnerModal({ isOpen, onClose, owner, onEdit, onDelete }: ViewOwnerModalProps) {
  if (!isOpen || !owner) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Owner Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#ccfbf1] dark:bg-[#0f766e]/30 rounded-full flex items-center justify-center">
              <span className="text-2xl font-medium text-[#0f766e] dark:text-[#5eead4]">
                {owner.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{owner.name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-1">
                {owner.status}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{owner.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{owner.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dormitories Managed</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{owner.dormitories} Properties</p>
              </div>
            </div>
          </div>

          {/* ID Documents Section */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#0d9488] dark:text-[#14b8a6]" />
              <h3 className="font-semibold text-gray-900 dark:text-white">ID Documents</h3>
            </div>

            {(owner.idType && owner.idNumber) ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ID Type</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{owner.idType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ID Number</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{owner.idNumber}</p>
                  </div>
                </div>

                {(owner.idImages?.front || owner.idImages?.back) && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Uploaded ID Documents</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {owner.idImages.front && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Front</p>
                          <img
                            src={owner.idImages.front}
                            alt="ID Front"
                            className="w-full h-40 object-contain rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                          />
                        </div>
                      )}
                      {owner.idImages.back && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Back</p>
                          <img
                            src={owner.idImages.back}
                            alt="ID Back"
                            className="w-full h-40 object-contain rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No ID documents on file</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <button
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Owner
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Owner
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
