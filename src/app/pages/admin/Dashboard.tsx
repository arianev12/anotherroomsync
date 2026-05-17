import { Building2, Users, UserCheck, Home, Key, Eye, TrendingUp, DollarSign, AlertCircle, CheckCircle2, Clock, Activity, ArrowUpRight, ArrowDownRight, Sparkles, Shield, BarChart3 } from "lucide-react";
import { useState } from "react";
import { ViewDormitoryModal } from "../../components/admin/ViewDormitoryModal";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";
import { useDormitories, useOwners } from "../../../hooks/useApi";

export function AdminDashboard() {
  const { dormitories } = useDormitories(true);
  const { owners } = useOwners();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDormitory, setSelectedDormitory] = useState<any>(null);

  const totalDormitories = dormitories.length;
  const totalOwners = owners.length;
  const totalTenants = dormitories.reduce((sum, d) => sum + d.occupied, 0);
  const availableRooms = dormitories.reduce((sum, d) => sum + d.available, 0);
  const occupiedRooms = dormitories.reduce((sum, d) => sum + d.occupied, 0);
  const totalCapacity = dormitories.reduce((sum, d) => sum + d.capacity, 0);
  const occupancyRate = ((occupiedRooms / totalCapacity) * 100).toFixed(1);
  const totalRevenue = dormitories.reduce((sum, d) => sum + (d.occupied * d.price), 0);

  const handleViewDormitory = (dormitory: any) => {
    setSelectedDormitory(dormitory);
    setIsViewModalOpen(true);
  };

  // Monthly revenue data
  const monthlyRevenueData = [
    { month: "Jan", revenue: 85000, tenants: 45 },
    { month: "Feb", revenue: 92000, tenants: 48 },
    { month: "Mar", revenue: 98000, tenants: 52 },
    { month: "Apr", revenue: 105000, tenants: 55 },
    { month: "May", revenue: 112000, tenants: 58 },
    { month: "Jun", revenue: totalRevenue, tenants: totalTenants }
  ];

  // Occupancy trend data
  const occupancyTrendData = [
    { month: "Jan", rate: 65 },
    { month: "Feb", rate: 68 },
    { month: "Mar", rate: 72 },
    { month: "Apr", rate: 75 },
    { month: "May", rate: 78 },
    { month: "Jun", rate: parseFloat(occupancyRate) }
  ];

  // Dorm distribution by price
  const priceDistributionData = [
    { range: "₱2,000-2,500", count: dormitories.filter(d => d.price >= 2000 && d.price < 2500).length, fill: "#14b8a6" },
    { range: "₱2,500-3,000", count: dormitories.filter(d => d.price >= 2500 && d.price < 3000).length, fill: "#0d9488" },
    { range: "₱3,000-3,500", count: dormitories.filter(d => d.price >= 3000 && d.price < 3500).length, fill: "#0f766e" },
    { range: "₱3,500+", count: dormitories.filter(d => d.price >= 3500).length, fill: "#134e4a" }
  ];

  // Dorm status distribution
  const statusData = [
    { name: "Active", value: dormitories.filter(d => d.status === "Active").length, fill: "#14b8a6" },
    { name: "Inactive", value: dormitories.filter(d => d.status !== "Active").length, fill: "#94a3b8" }
  ];

  const stats = [
    {
      label: "Total Revenue",
      value: `₱${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-[#14b8a6] to-[#0d9488]",
      trend: "+12.5%",
      trendUp: true,
      description: "This month"
    },
    {
      label: "Occupancy Rate",
      value: `${occupancyRate}%`,
      icon: Activity,
      gradient: "from-[#0d9488] to-[#0f766e]",
      trend: "+3.2%",
      trendUp: true,
      description: `${occupiedRooms}/${totalCapacity} beds`
    },
    {
      label: "Total Dormitories",
      value: totalDormitories,
      icon: Building2,
      gradient: "from-[#14b8a6] to-[#0d9488]",
      trend: "+2 new",
      trendUp: true,
      description: "All verified"
    },
    {
      label: "Active Tenants",
      value: totalTenants,
      icon: UserCheck,
      gradient: "from-[#0d9488] to-[#0f766e]",
      trend: "+8 this week",
      trendUp: true,
      description: "BatStateU students"
    },
  ];

  const quickStats = [
    { label: "Available Rooms", value: availableRooms, icon: Home, color: "text-[#14b8a6]" },
    { label: "Dormitory Owners", value: totalOwners, icon: Users, color: "text-[#0d9488]" },
    { label: "Pending Approvals", value: 3, icon: Clock, color: "text-orange-500" },
    { label: "Active Listings", value: dormitories.filter(d => d.status === "Active").length, icon: CheckCircle2, color: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0f766e] flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0d9488] to-[#134e4a] bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Complete overview of RoomSync platform operations
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#14b8a6]/10 to-[#0d9488]/10 dark:from-[#14b8a6]/20 dark:to-[#0d9488]/20 rounded-xl border border-[#14b8a6]/20 dark:border-[#14b8a6]/30">
            <Sparkles className="w-4 h-4 text-[#14b8a6]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">All Systems Operational</span>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden shadow-lg hover:shadow-xl transition-all">
                {/* Gradient Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {stat.trendUp ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className={stat.trendUp ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trends</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly revenue growth</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Occupancy Rate */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Occupancy Trend</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">6-month occupancy rate</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0d9488] to-[#0f766e] flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line type="monotone" dataKey="rate" stroke="#0d9488" strokeWidth={3} dot={{ fill: '#0d9488', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Price Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Price Distribution</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dorms by price range</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="range" stroke="#6b7280" style={{ fontSize: '11px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {priceDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dormitory Status</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active vs inactive listings</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0d9488] to-[#0f766e] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dormitory Listings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#14b8a6]/5 to-[#0d9488]/5">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-[#14b8a6]" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dormitory Listings</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dorm Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Owner Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Occupancy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dormitories.map((dorm) => {
                const occupancyPercent = ((dorm.occupied / dorm.capacity) * 100).toFixed(0);
                return (
                  <tr key={dorm.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{dorm.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">{dorm.owner}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">{dorm.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden w-20">
                          <div
                            className="h-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] rounded-full"
                            style={{ width: `${occupancyPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{occupancyPercent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dorm.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {dorm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDormitory(dorm)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#0f766e] text-white rounded-lg text-sm transition-all shadow-md hover:shadow-lg"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <ViewDormitoryModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        dormitory={selectedDormitory}
      />
    </div>
  );
}