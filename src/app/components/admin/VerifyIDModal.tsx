import { X, CheckCircle, XCircle, Eye } from "lucide-react";
import { useState } from "react";

interface VerifyIDModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner: any;
  onVerify: (ownerId: number, status: 'Verified' | 'Rejected') => void;
}

export function VerifyIDModal({ isOpen, onClose, owner, onVerify }: VerifyIDModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen || !owner) return null;

  const hasIDImages = owner.idImages && (owner.idImages.front || owner.idImages.back);

  const handleVerify = (status: 'Verified' | 'Rejected') => {
    onVerify(owner.id, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review ID - {owner.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Review uploaded ID documents and change verification status if needed
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Owner Information */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Owner Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium text-gray-900 dark:text-white mt-1">{owner.name}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white mt-1">{owner.email}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white mt-1">{owner.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">ID Type</p>
                <p className="font-medium text-gray-900 dark:text-white mt-1">{owner.idType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">ID Number</p>
                <p className="font-medium text-gray-900 dark:text-white mt-1">{owner.idNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Current Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  owner.verificationStatus === 'Verified'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : owner.verificationStatus === 'Rejected'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    : owner.verificationStatus === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {owner.verificationStatus || 'No ID Uploaded'}
                </span>
              </div>
            </div>
          </div>

          {/* ID Images */}
          {hasIDImages ? (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Uploaded ID Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Front ID */}
                {owner.idImages.front && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ID Front Side
                    </label>
                    <div className="relative group">
                      <img
                        src={owner.idImages.front}
                        alt="ID Front"
                        className="w-full h-64 object-contain border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
                      />
                      <button
                        onClick={() => setSelectedImage(owner.idImages.front)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                      >
                        <Eye className="w-8 h-8 text-white" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Back ID */}
                {owner.idImages.back && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ID Back Side
                    </label>
                    <div className="relative group">
                      <img
                        src={owner.idImages.back}
                        alt="ID Back"
                        className="w-full h-64 object-contain border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
                      />
                      <button
                        onClick={() => setSelectedImage(owner.idImages.back)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                      >
                        <Eye className="w-8 h-8 text-white" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <XCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No ID documents uploaded</p>
            </div>
          )}

          {/* Action Buttons */}
          {hasIDImages && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleVerify('Rejected')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={owner.verificationStatus === 'Rejected'}
              >
                <XCircle className="w-5 h-5" />
                {owner.verificationStatus === 'Rejected' ? 'Already Rejected' : 'Mark as Rejected'}
              </button>
              <button
                onClick={() => handleVerify('Verified')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={owner.verificationStatus === 'Verified'}
              >
                <CheckCircle className="w-5 h-5" />
                {owner.verificationStatus === 'Verified' ? 'Already Verified' : 'Mark as Verified'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Image Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={selectedImage}
            alt="ID Preview"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
