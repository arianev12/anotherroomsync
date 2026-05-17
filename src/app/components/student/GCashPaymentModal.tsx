import { useState } from "react";
import { X, Upload, CheckCircle, QrCode, AlertCircle, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GCashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerName: string;
  ownerGCashQR: string | null;
  ownerGCashNumber: string | null;
  ownerGCashName: string | null;
  amount: number;
  dueDate: string;
  dormitory: string;
  roomNumber: string;
}

export function GCashPaymentModal({
  isOpen,
  onClose,
  ownerName,
  ownerGCashQR,
  ownerGCashNumber,
  ownerGCashName,
  amount,
  dueDate,
  dormitory,
  roomNumber
}: GCashPaymentModalProps) {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!receipt || !referenceNumber.trim()) {
      alert("Please upload receipt and enter reference number");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setReceipt(null);
        setReceiptPreview(null);
        setReferenceNumber("");
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  // Check if owner has GCash setup
  const hasGCashSetup = ownerGCashQR && ownerGCashNumber;

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
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">GCash Payment</h2>
                <p className="text-teal-100 text-sm mt-0.5">{dormitory} - Room {roomNumber}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!hasGCashSetup ? (
              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
                <p className="text-amber-900 dark:text-amber-300 font-semibold mb-2">GCash Not Available</p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  The owner has not set up GCash payment yet. Please use other payment methods or contact the owner directly.
                </p>
              </div>
            ) : submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl p-8 text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">Payment Submitted!</h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Your payment proof has been sent to the owner for verification.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Payment Details */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Payment Details</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Amount Due</span>
                    <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">₱{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Due Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* GCash QR Code */}
                <div className="bg-white dark:bg-gray-900 border-2 border-teal-200 dark:border-teal-700 rounded-xl p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Scan to Pay</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Use GCash app to scan this QR code</p>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <img
                        src={ownerGCashQR!}
                        alt="GCash QR Code"
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                  </div>

                  <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-teal-700 dark:text-teal-300 font-medium">GCash Name</span>
                      <span className="font-semibold text-teal-900 dark:text-teal-200">{ownerGCashName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-teal-700 dark:text-teal-300 font-medium">GCash Number</span>
                      <span className="font-mono font-semibold text-teal-900 dark:text-teal-200">{ownerGCashNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Upload Receipt */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Upload Payment Receipt</h3>

                  {receiptPreview ? (
                    <div className="relative">
                      <img
                        src={receiptPreview}
                        alt="Receipt Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        onClick={() => {
                          setReceipt(null);
                          setReceiptPreview(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                        {receipt?.name}
                      </div>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center justify-center py-8 px-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Click to upload receipt</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 10MB</p>
                      </div>
                    </label>
                  )}
                </div>

                {/* Reference Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    GCash Reference Number
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Enter 13-digit reference number"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-300 font-medium mb-2">📝 Payment Instructions</p>
                  <ol className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
                    <li>Scan the QR code using your GCash app</li>
                    <li>Enter the exact amount shown above (₱{amount.toLocaleString()})</li>
                    <li>Complete the payment in GCash</li>
                    <li>Take a screenshot of the payment confirmation</li>
                    <li>Upload the screenshot and enter the reference number</li>
                  </ol>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {hasGCashSetup && !submitted && (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex gap-3 flex-shrink-0">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!receipt || !referenceNumber.trim() || isSubmitting}
                className="flex-1 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Submit Payment
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
