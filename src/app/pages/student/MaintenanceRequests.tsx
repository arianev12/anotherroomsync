import { useState, useEffect } from "react";
import { Upload, X, Plus } from "lucide-react";
import { useStudent } from "../../contexts/StudentContext";

export function StudentMaintenanceRequests() {
  const { currentDorm } = useStudent();
  const maintenanceRequests: any[] = [];
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '',
    issueType: '',
    description: ''
  });

  // Auto-fill room number if student has a dorm
  useEffect(() => {
    if (currentDorm) {
      setFormData(prev => ({ ...prev, roomNumber: currentDorm.roomNumber }));
    }
  }, [currentDorm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setFormData({ roomNumber: '', issueType: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Maintenance Requests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submit and track maintenance issues</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* New Request Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Submit Maintenance Request</h2>
            <button 
              onClick={() => setShowForm(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  placeholder="e.g., 101"
                  disabled={!!currentDorm}
                  required
                />
                {currentDorm && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Auto-filled from your current dormitory
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issue Type
                </label>
                <select
                  value={formData.issueType}
                  onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select issue type</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Aircon">Air Conditioning</option>
                  <option value="Furniture">Furniture</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Describe the issue in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-teal-500 dark:hover:border-teal-500 transition-colors cursor-pointer bg-white dark:bg-gray-900">
                <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload photo</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Request History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Requests</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {maintenanceRequests.map((request) => (
            <div key={request.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{request.issueType}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      request.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{request.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>Room {request.roomNumber}</span>
                    <span>•</span>
                    <span>Submitted on {request.submittedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}