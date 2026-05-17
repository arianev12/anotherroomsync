import { UserPlus, Eye } from "lucide-react";
import { useState } from "react";
import { owners as initialOwners } from "../../data/mockData";
import { AddOwnerModal } from "../../components/admin/AddOwnerModal";
import { ViewOwnerModal } from "../../components/admin/ViewOwnerModal";
import { EditOwnerModal } from "../../components/admin/EditOwnerModal";
import { DeleteConfirmationModal } from "../../components/admin/DeleteConfirmationModal";
import { Toast } from "../../components/admin/Toast";

export function ManageOwners() {
  const [owners, setOwners] = useState(initialOwners);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  const [toast, setToast] = useState({ message: "", type: "success" as "success" | "error" | "info", isVisible: false });

  const handleAddOwner = (newOwner: any) => {
    setOwners([...owners, newOwner]);
    setToast({ message: "Owner added successfully!", type: "success", isVisible: true });
  };

  const handleEditOwner = (updatedOwner: any) => {
    setOwners(owners.map(owner => owner.id === updatedOwner.id ? updatedOwner : owner));
    setToast({ message: "Owner updated successfully!", type: "success", isVisible: true });
  };

  const handleDeleteOwner = () => {
    if (selectedOwner) {
      setOwners(owners.filter(owner => owner.id !== selectedOwner.id));
      setToast({ message: "Owner deleted successfully!", type: "success", isVisible: true });
    }
  };

  const handleDeleteClick = (owner: any) => {
    setSelectedOwner(owner);
    setIsDeleteModalOpen(true);
  };

  const handleViewOwner = (owner: any) => {
    setSelectedOwner(owner);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (owner: any) => {
    setSelectedOwner(owner);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Manage Dormitory Owners</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage all dormitory owners</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] dark:bg-[#14b8a6] dark:hover:bg-[#0d9488]"
        >
          <UserPlus className="w-4 h-4" />
          Add Owner
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px]">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                  Dormitories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px]">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {owners.map((owner) => (
                <tr key={owner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#ccfbf1] dark:bg-[#0f766e]/30 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-[#0f766e] dark:text-[#5eead4]">
                          {owner.name.charAt(0)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{owner.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{owner.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{owner.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{owner.dormitories}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {owner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewOwner(owner)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#0d9488] dark:text-[#14b8a6] hover:bg-[#ccfbf1] dark:hover:bg-[#0f766e]/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddOwnerModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddOwner}
      />

      <ViewOwnerModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        owner={selectedOwner}
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          setIsViewModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />

      <EditOwnerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        owner={selectedOwner}
        onSubmit={handleEditOwner}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteOwner}
        title="Delete Owner"
        message="Are you sure you want to delete this owner? This action cannot be undone."
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}