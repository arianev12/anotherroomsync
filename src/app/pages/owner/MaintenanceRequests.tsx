import { Clock, CheckCircle, AlertCircle, X } from "lucide-react";
import { GlassmorphismCard } from "../../components/GlassmorphismCard";
import { useState } from "react";
import { toast } from "sonner";

export function OwnerMaintenanceRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const pending = requests.filter(r => r.status === 'Pending');
  const inProgress = requests.filter(r => r.status === 'In Progress');
  const resolved = requests.filter(r => r.status === 'Resolved');

  const handleUpdateStatus = (request: any) => {
    setSelectedRequest(request);
    setIsUpdateModalOpen(true);
  };

  const updateRequestStatus = (newStatus: string) => {
    setRequests(requests.map(r =>
      r.id === selectedRequest.id ? { ...r, status: newStatus } : r
    ));
    toast.success(`Status updated to "${newStatus}"`);
    setIsUpdateModalOpen(false);
  };

  const RequestCard = ({ request }: { request: typeof requests[0] }) => (
    <GlassmorphismCard className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{request.issueType}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Room {request.roomNumber}</p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{request.submittedDate}</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{request.description}</p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">By {request.submittedBy}</span>
        <button
          onClick={() => handleUpdateStatus(request)}
          className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
        >
          Update Status
        </button>
      </div>
    </GlassmorphismCard>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Maintenance Requests</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track and manage maintenance issues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Pending</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">{pending.length} requests</p>
            </div>
          </div>
          <div className="space-y-3">
            {pending.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">In Progress</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">{inProgress.length} requests</p>
            </div>
          </div>
          <div className="space-y-3">
            {inProgress.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>

        {/* Resolved Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Resolved</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">{resolved.length} requests</p>
            </div>
          </div>
          <div className="space-y-3">
            {resolved.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {isUpdateModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update Status</h3>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                <strong>Room:</strong> {selectedRequest.roomNumber}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                <strong>Issue:</strong> {selectedRequest.issueType}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Current Status:</strong> {selectedRequest.status}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select new status:
              </p>
              <button
                onClick={() => updateRequestStatus('Pending')}
                disabled={selectedRequest.status === 'Pending'}
                className="w-full px-4 py-3 rounded-lg font-medium transition-colors text-left flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Clock className="w-5 h-5" />
                Pending
              </button>
              <button
                onClick={() => updateRequestStatus('In Progress')}
                disabled={selectedRequest.status === 'In Progress'}
                className="w-full px-4 py-3 rounded-lg font-medium transition-colors text-left flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AlertCircle className="w-5 h-5" />
                In Progress
              </button>
              <button
                onClick={() => updateRequestStatus('Resolved')}
                disabled={selectedRequest.status === 'Resolved'}
                className="w-full px-4 py-3 rounded-lg font-medium transition-colors text-left flex items-center gap-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                Resolved
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}