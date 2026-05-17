import { Building2, Home, Key, Users, Wrench } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { dormitories, tenantRequests, maintenanceRequests } from "../../data/mockData";
import { GlassmorphismCard } from "../../components/GlassmorphismCard";

export function OwnerDashboard() {
  // Mock data for owner (first 2 dormitories)
  const myDorms = dormitories.slice(0, 2);
  const totalRooms = myDorms.reduce((sum, d) => sum + d.capacity, 0);
  const availableRooms = myDorms.reduce((sum, d) => sum + d.available, 0);
  const occupiedRooms = myDorms.reduce((sum, d) => sum + d.occupied, 0);
  const pendingRequests = tenantRequests.filter(r => r.status === 'Pending').length;
  const pendingMaintenance = maintenanceRequests.filter(r => r.status === 'Pending').length;

  const chartData = myDorms.map((d, index) => ({
    id: `dorm-${d.id}`,
    name: d.name,
    Available: d.available,
    Occupied: d.occupied,
  }));

  const stats = [
    { label: "Total Rooms", value: totalRooms, icon: Building2, color: "bg-[#ccfbf1] text-[#0f766e] dark:bg-[#0f766e]/30 dark:text-[#5eead4]" },
    { label: "Available Rooms", value: availableRooms, icon: Home, color: "bg-[#ccfbf1] text-[#0f766e] dark:bg-[#0f766e]/30 dark:text-[#5eead4]" },
    { label: "Occupied Rooms", value: occupiedRooms, icon: Key, color: "bg-[#ccfbf1] text-[#0f766e] dark:bg-[#0f766e]/30 dark:text-[#5eead4]" },
    { label: "Pending Tenant Requests", value: pendingRequests, icon: Users, color: "bg-[#ccfbf1] text-[#0f766e] dark:bg-[#0f766e]/30 dark:text-[#5eead4]" },
    { label: "Maintenance Requests", value: pendingMaintenance, icon: Wrench, color: "bg-[#ccfbf1] text-[#0f766e] dark:bg-[#0f766e]/30 dark:text-[#5eead4]" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm dark:text-gray-400 mt-1 text-[#a4acb1]">Welcome back! Here's your dormitory overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassmorphismCard key={stat.label} className="p-6">
              <div className="flex flex-col gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                </div>
              </div>
            </GlassmorphismCard>
          );
        })}
      </div>

      {/* Chart */}
      <GlassmorphismCard className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Occupancy</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" key="grid" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
              key="xaxis"
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
              key="yaxis"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem'
              }}
              key="tooltip"
              cursor={{ fill: 'rgba(13, 148, 136, 0.1)' }}
            />
            <Bar 
              dataKey="Available" 
              fill="#0d9488" 
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
              key="available"
            />
            <Bar 
              dataKey="Occupied" 
              fill="#14b8a6" 
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
              key="occupied"
            />
          </BarChart>
        </ResponsiveContainer>
      </GlassmorphismCard>

      {/* Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassmorphismCard className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Tenant Requests</h2>
          <div className="space-y-3">
            {tenantRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{request.studentName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{request.dormitory}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${request.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-[#ccfbf1] text-[#0f766e] dark:bg-[#0f766e]/30 dark:text-[#5eead4]'}`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Maintenance</h2>
          <div className="space-y-3">
            {maintenanceRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{request.issueType}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Room {request.roomNumber}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  request.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                  request.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-[#ccfbf1] text-[#0f766e] dark:bg-[#0f766e]/30 dark:text-[#5eead4]'
                }`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  );
}