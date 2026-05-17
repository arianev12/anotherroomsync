import { X, Upload, Eye, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface AddOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (owner: any) => void;
}

export function AddOwnerModal({ isOpen, onClose, onSubmit }: AddOwnerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    idType: "Government ID",
    idNumber: "",
  });

  const [idImages, setIdImages] = useState({
    front: null as string | null,
    back: null as string | null,
  });

  const [idPreview, setIdPreview] = useState({
    front: null as string | null,
    back: null as string | null,
  });

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setIdImages(prev => ({ ...prev, [side]: result }));
        setIdPreview(prev => ({ ...prev, [side]: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (side: 'front' | 'back') => {
    setIdImages(prev => ({ ...prev, [side]: null }));
    setIdPreview(prev => ({ ...prev, [side]: null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      idType: formData.idType,
      idNumber: formData.idNumber,
      idImages: idImages,
      verificationStatus: idImages.front && idImages.back ? 'Verified' : 'No ID Uploaded',
      dormitories: 0,
      status: "Active",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      idType: "Government ID",
      idNumber: "",
    });
    setIdImages({ front: null, back: null });
    setIdPreview({ front: null, back: null });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Add New Owner</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="owner@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="+63 912 345 6789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID Type *
              </label>
              <select
                required
                value={formData.idType}
                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option>Government ID</option>
                <option>Driver's License</option>
                <option>Passport</option>
                <option>SSS ID</option>
                <option>UMID</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Number *
            </label>
            <input
              type="text"
              required
              value={formData.idNumber}
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Enter ID number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address *
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Enter complete address"
            />
          </div>

          {/* ID Verification Upload */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ID Verification</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Upload clear photos of the owner's valid ID (front and back)</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Front ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID Front Side *
                </label>
                {!idPreview.front ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#0d9488] dark:hover:border-[#14b8a6] transition-colors bg-gray-50 dark:bg-gray-900">
                    <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'front')}
                      required
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-48 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={idPreview.front}
                      alt="ID Front"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('front')}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Back ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID Back Side *
                </label>
                {!idPreview.back ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#0d9488] dark:hover:border-[#14b8a6] transition-colors bg-gray-50 dark:bg-gray-900">
                    <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'back')}
                      required
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-48 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={idPreview.back}
                      alt="ID Back"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('back')}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> Please verify that the uploaded ID is legitimate and matches the owner's information before creating the account. The account will be marked as "Verified" upon creation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] dark:bg-[#14b8a6] dark:hover:bg-[#0d9488] transition-colors"
            >
              Add Owner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
