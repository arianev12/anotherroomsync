import { Plus, MapPin, Edit2, X, Home, Eye, Trash2, ShieldCheck, ShieldX, Clock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GlassmorphismCard } from "../../components/GlassmorphismCard";
import { TenantLedgerModal, TenantInfo } from "../../components/owner/TenantLedgerModal";
import { useDormitories } from "../../../hooks/useApi";

interface EditRoom {
  id: number;
  roomNumber: string;
  capacity: number;
  price: number;
  available: number;
  occupied: number;
}

export function MyDormitories() {
  const navigate = useNavigate();
  const { dormitories: myDorms } = useDormitories(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewTenantsModalOpen, setViewTenantsModalOpen] = useState(false);
  const [viewRoomsModalOpen, setViewRoomsModalOpen] = useState(false);
  const [selectedDorm, setSelectedDorm] = useState<any>(null);
  const [selectedTenantForLedger, setSelectedTenantForLedger] = useState<TenantInfo | null>(null);

  // Edit Dorm Form State
  const [editFormData, setEditFormData] = useState({
    name: "",
    location: "",
    price: 0,
    capacity: 0,
    available: 0,
    description: "",
    status: "Active",
  });

  const [editRooms, setEditRooms] = useState<EditRoom[]>([]);

  const mockTenants: TenantInfo[] = [];

  const handleEditClick = (dorm: any) => {
    setSelectedDorm(dorm);
    setEditFormData({
      name: dorm.name,
      location: dorm.location,
      price: dorm.price,
      capacity: dorm.capacity,
      available: dorm.available,
      description: dorm.description,
      status: dorm.status,
    });

    // Initialize rooms data
    if (dorm.rooms && dorm.rooms.length > 0) {
      setEditRooms(dorm.rooms.map((room: any) => ({ ...room })));
    } else {
      setEditRooms([{ id: 1, roomNumber: '', capacity: 0, price: 0, available: 0, occupied: 0 }]);
    }

    setEditModalOpen(true);
  };

  const addEditRoom = () => {
    const newRoom: EditRoom = {
      id: editRooms.length > 0 ? Math.max(...editRooms.map(r => r.id)) + 1 : 1,
      roomNumber: '',
      capacity: 0,
      price: 0,
      available: 0,
      occupied: 0
    };
    setEditRooms([...editRooms, newRoom]);
  };

  const removeEditRoom = (id: number) => {
    if (editRooms.length > 1) {
      setEditRooms(editRooms.filter(room => room.id !== id));
    }
  };

  const updateEditRoom = (id: number, field: keyof EditRoom, value: string | number) => {
    setEditRooms(editRooms.map(room =>
      room.id === id ? { ...room, [field]: typeof value === 'string' ? (field === 'roomNumber' ? value : Number(value)) : value } : room
    ));
  };

  const handleViewTenantsClick = (dorm: any) => {
    setSelectedDorm(dorm);
    setViewTenantsModalOpen(true);
  };

  const handleViewRoomsClick = (dorm: any) => {
    setSelectedDorm(dorm);
    setViewRoomsModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate update with rooms data
    console.log('Updated Dormitory:', editFormData);
    console.log('Updated Rooms:', editRooms);
    toast.success(`${editFormData.name} has been updated successfully!`);
    setEditModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedDorm(null);
  };

  const handleCloseTenantsModal = () => {
    setViewTenantsModalOpen(false);
    setSelectedDorm(null);
  };

  const handleCloseRoomsModal = () => {
    setViewRoomsModalOpen(false);
    setSelectedDorm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Dormitories</h1>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">Manage your dormitory properties</p>
        </div>
        <button 
          onClick={() => navigate('/owner/dormitories/add')}
          className="flex items-center gap-2 px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] dark:bg-[#14b8a6] dark:hover:bg-[#0d9488]"
        >
          <Plus className="w-4 h-4" />
          Add Dormitory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myDorms.map((dorm) => (
          <GlassmorphismCard key={dorm.id}>
            <img 
              src={dorm.images[0]} 
              alt={dorm.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{dorm.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{dorm.location}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  dorm.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {dorm.status}
                </span>
              </div>

              {/* Registration Status */}
              {(() => {
                const regStatus = (dorm as any).registrationStatus;
                const regNumber = (dorm as any).registrationNumber;
                return (
                  <div className={`mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg border ${
                    regStatus === 'Verified'
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                      : regStatus === 'Pending'
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    {regStatus === 'Verified' && <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
                    {regStatus === 'Pending' && <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />}
                    {regStatus === 'Rejected' && <ShieldX className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold ${
                        regStatus === 'Verified' ? 'text-emerald-700 dark:text-emerald-400'
                        : regStatus === 'Pending' ? 'text-amber-700 dark:text-amber-400'
                        : 'text-red-700 dark:text-red-400'
                      }`}>
                        Registration {regStatus}
                      </p>
                      <p className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate">{regNumber}</p>
                    </div>
                    {regStatus === 'Pending' && (
                      <span className="ml-auto text-xs text-amber-600 dark:text-amber-400 whitespace-nowrap">Under review</span>
                    )}
                    {regStatus === 'Rejected' && (
                      <span className="ml-auto text-xs text-red-600 dark:text-red-400 whitespace-nowrap">Contact admin</span>
                    )}
                  </div>
                );
              })()}

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">{dorm.description}</p>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">{dorm.capacity}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Rooms</div>
                </div>
                <div className="text-center p-3 bg-[#ccfbf1] dark:bg-[#0f766e]/30 rounded-lg">
                  <div className="text-2xl font-semibold text-[#0f766e] dark:text-[#5eead4]">{dorm.available}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available</div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                  <div className="text-2xl font-semibold text-orange-700 dark:text-orange-400">{dorm.occupied}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Occupied</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Monthly Rate</span>
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">₱{dorm.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => handleViewRoomsClick(dorm)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] dark:bg-[#14b8a6] dark:hover:bg-[#0d9488] text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View Rooms
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditClick(dorm)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-sm text-gray-900 dark:text-white"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => handleViewTenantsClick(dorm)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-sm text-gray-900 dark:text-white"
                  >
                    View Tenants
                  </button>
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        ))}
      </div>

      {/* Edit Dormitory Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Dormitory Details</h2>
              <button
                onClick={handleCloseEditModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dormitory Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Full">Full</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              {/* Room Details Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Room Details</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage individual room information</p>
                  </div>
                  <button
                    type="button"
                    onClick={addEditRoom}
                    className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Room
                  </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {editRooms.map((room, index) => (
                    <div key={room.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                          <Home className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Room #{index + 1}</h4>
                        {editRooms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEditRoom(room.id)}
                            className="ml-auto p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Remove Room"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Room No.
                          </label>
                          <input
                            type="text"
                            value={room.roomNumber}
                            onChange={(e) => updateEditRoom(room.id, 'roomNumber', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="101"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Capacity
                          </label>
                          <input
                            type="number"
                            value={room.capacity}
                            onChange={(e) => updateEditRoom(room.id, 'capacity', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="4"
                            min="1"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Price (₱)
                          </label>
                          <input
                            type="number"
                            value={room.price}
                            onChange={(e) => updateEditRoom(room.id, 'price', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="3000"
                            min="0"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Available
                          </label>
                          <input
                            type="number"
                            value={room.available}
                            onChange={(e) => updateEditRoom(room.id, 'available', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="2"
                            min="0"
                            max={room.capacity}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] dark:bg-[#14b8a6] dark:hover:bg-[#0d9488] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Tenants Modal */}
      {viewTenantsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tenants</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedDorm?.name}</p>
              </div>
              <button
                onClick={handleCloseTenantsModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Tenants</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{mockTenants.length}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Paid This Month</p>
                  <p className="text-2xl font-semibold text-green-700 dark:text-green-400 mt-1">
                    {mockTenants.filter(t => t.paymentStatus === "Paid").length}
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Unpaid</p>
                  <p className="text-2xl font-semibold text-amber-700 dark:text-amber-400 mt-1">
                    {mockTenants.filter(t => t.paymentStatus === "Unpaid").length}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {mockTenants.map((tenant) => (
                  <div key={tenant.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-teal-700 dark:text-teal-400">
                            {tenant.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{tenant.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{tenant.email}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tenant.course}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          tenant.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          {tenant.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Room Number</p>
                        <p className="font-medium text-gray-900 dark:text-white">{tenant.roomNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Move-in Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(tenant.moveInDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setSelectedTenantForLedger(tenant)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-lg text-sm transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        View Ledger
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Ledger Modal */}
      {selectedTenantForLedger && (
        <TenantLedgerModal
          tenant={selectedTenantForLedger}
          onClose={() => setSelectedTenantForLedger(null)}
        />
      )}

      {/* View Rooms Modal */}
      {viewRoomsModalOpen && selectedDorm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Room Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedDorm?.name}</p>
              </div>
              <button
                onClick={handleCloseRoomsModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              {selectedDorm.rooms && selectedDorm.rooms.length > 0 ? (
                <>
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Rooms</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{selectedDorm.rooms.length}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Capacity</p>
                      <p className="text-2xl font-semibold text-green-700 dark:text-green-400 mt-1">
                        {selectedDorm.rooms.reduce((sum: number, room: any) => sum + room.capacity, 0)} beds
                      </p>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Available Beds</p>
                      <p className="text-2xl font-semibold text-teal-700 dark:text-teal-400 mt-1">
                        {selectedDorm.rooms.reduce((sum: number, room: any) => sum + room.available, 0)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedDorm.rooms.map((room: any) => (
                      <div key={room.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                              <Home className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Room {room.roomNumber}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Capacity: {room.capacity} persons
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">₱{room.price.toLocaleString()}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">per month</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                              <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1">
                                {room.available} / {room.capacity} beds
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Occupied</p>
                              <p className="text-lg font-semibold text-orange-600 dark:text-orange-400 mt-1">
                                {room.occupied} / {room.capacity} beds
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-teal-600 dark:bg-teal-500 h-2.5 rounded-full transition-all"
                              style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                            {Math.round((room.occupied / room.capacity) * 100)}% Occupancy
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No rooms available for this dormitory</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
              <button
                onClick={handleCloseRoomsModal}
                className="w-full px-4 py-2.5 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] dark:bg-[#14b8a6] dark:hover:bg-[#0d9488] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}