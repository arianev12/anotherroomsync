import { Check, X, MessageCircle, Calendar, DollarSign, Send, Clock, Phone, Home } from "lucide-react";
import { tenantRequests, visitRequests } from "../../data/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { GlassmorphismCard } from "../../components/GlassmorphismCard";
import { motion } from "motion/react";

export function TenantRequests() {
  const [activeTab, setActiveTab] = useState<'rent' | 'visit'>('rent');
  const [rentRequests, setRentRequests] = useState(tenantRequests);
  const [visitRequestsState, setVisitRequestsState] = useState(visitRequests);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

  const handleApprove = (requestId: number) => {
    if (activeTab === 'rent') {
      setRentRequests(rentRequests.map(req =>
        req.id === requestId ? { ...req, status: "Approved" } : req
      ));
      const request = rentRequests.find(r => r.id === requestId);
      toast.success(`${request?.studentName}'s rent application has been approved!`);
    } else {
      setVisitRequestsState(visitRequestsState.map(req =>
        req.id === requestId ? { ...req, status: "Approved" } : req
      ));
      const request = visitRequestsState.find(r => r.id === requestId);
      toast.success(`${request?.studentName}'s visit request has been approved!`);
    }
  };

  const handleReject = (requestId: number) => {
    if (activeTab === 'rent') {
      setRentRequests(rentRequests.map(req =>
        req.id === requestId ? { ...req, status: "Rejected" } : req
      ));
      const request = rentRequests.find(r => r.id === requestId);
      toast.error(`${request?.studentName}'s rent application has been rejected.`);
    } else {
      setVisitRequestsState(visitRequestsState.map(req =>
        req.id === requestId ? { ...req, status: "Rejected" } : req
      ));
      const request = visitRequestsState.find(r => r.id === requestId);
      toast.error(`${request?.studentName}'s visit request has been rejected.`);
    }
  };

  const handleOpenMessage = (request: any) => {
    setSelectedRequest(request);
    setMessageModalOpen(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      toast.success(`Message sent to ${selectedRequest?.studentName}!`);
      setMessageText("");
      setMessageModalOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleCloseMessageModal = () => {
    setMessageModalOpen(false);
    setSelectedRequest(null);
    setMessageText("");
  };

  const currentRequests = activeTab === 'rent' ? rentRequests : visitRequestsState;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tenant & Visit Requests</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage incoming tenant applications and visit requests</p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 inline-flex">
        <button
          onClick={() => setActiveTab('rent')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'rent'
              ? 'bg-teal-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Rent Requests ({rentRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('visit')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'visit'
              ? 'bg-teal-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Visit Requests ({visitRequestsState.length})
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {currentRequests.map((request) => (
          <GlassmorphismCard key={request.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-teal-700">
                    {request.studentName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{request.studentName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{request.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{request.course}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {request.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activeTab === 'rent' ? 'Move-in Date' : 'Visit Date'}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activeTab === 'rent' ? (request as any).moveInDate : (request as any).visitDate}
                  </p>
                </div>
              </div>
              {activeTab === 'rent' ? (
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">₱{(request as any).budget.toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Visit Time</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{(request as any).visitTime}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Room</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Room {(request as any).roomNumber}</p>
                </div>
              </div>
            </div>

            {request.status === 'Pending' && (
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => handleApprove(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button 
                  onClick={() => handleReject(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
                <button 
                  onClick={() => handleOpenMessage(request)}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
              </div>
            )}
          </GlassmorphismCard>
        ))}
      </div>

      {/* Message Modal */}
      {messageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Send Message</h2>
              <p className="text-sm text-gray-500 mt-1">To: {selectedRequest?.studentName}</p>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  💡 This message will be sent to {selectedRequest?.email}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseMessageModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] dark:bg-[#14b8a6] dark:hover:bg-[#0d9488] transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}