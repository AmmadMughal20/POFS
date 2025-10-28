'use client'

import Button from '@/components/ui/Button/Button'
import Page from '@/components/ui/Page/Page'
import { getDashboardStats, getRecentBusinesses } from '@/server/SuperAdminDashboardHandlers'
import { BusinessStatus } from '@prisma/client'
import { Building2, DollarSign, Store, Users } from 'lucide-react'
import useSWR from 'swr'

const swrFetcher = async <
    Args extends unknown[],
    Return,
>(
    fn: (...args: Args) => Promise<Return>,
    ...args: Args
): Promise<Return> =>
{
    return fn(...args)
}
const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 19000 },
    { month: 'Mar', revenue: 15000 },
    { month: 'Apr', revenue: 21000 },
    { month: 'May', revenue: 24000 },
    { month: 'Jun', revenue: 28000 },
]

export default function SuperAdminDashboard()
{
    const { data: stats } = useSWR(['stats'], () => swrFetcher(getDashboardStats))
    const { data: recentBusinesses } = useSWR(['recentBusinesses'], () => swrFetcher(getRecentBusinesses))

    const loading = !stats || !recentBusinesses

    if (loading)
    {
        return (
            <Page className="min-h-screen p-6 space-y-8">
                {/* Header Placeholder */}
                <div className="flex justify-between items-center">
                    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
                </div>

                {/* KPI Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow p-5 border border-gray-100 animate-pulse">
                            <div className="flex items-center justify-between">
                                <div className="h-4 w-24 bg-gray-200 rounded" />
                                <div className="h-6 w-6 bg-gray-200 rounded-full" />
                            </div>
                            <div className="mt-3 h-7 w-32 bg-gray-200 rounded" />
                            <div className="mt-2 h-3 w-24 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>

                {/* Sales Chart Skeleton */}
                <div className="bg-white rounded-xl shadow border border-gray-100 p-5 animate-pulse">
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-5 w-40 bg-gray-200 rounded" />
                        <div className="flex gap-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-7 w-16 bg-gray-200 rounded-lg" />
                            ))}
                        </div>
                    </div>
                    <div className="h-72 bg-gray-100 rounded" />
                </div>

                {/* Branch Overview Skeleton */}
                <div className="bg-white rounded-xl shadow border border-gray-100 p-5 animate-pulse">
                    <div className="h-5 w-56 bg-gray-200 rounded mb-4" />
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-6 bg-gray-100 rounded" />
                        ))}
                    </div>
                </div>

                {/* Low Stock Skeleton */}
                <div className="bg-white rounded-xl shadow border border-gray-100 p-5 animate-pulse">
                    <div className="h-5 w-48 bg-gray-200 rounded mb-4" />
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-6 bg-gray-100 rounded" />
                        ))}
                    </div>
                </div>

                {/* Recent Orders Skeleton */}
                <div className="bg-white rounded-xl shadow border border-gray-100 p-5 animate-pulse">
                    <div className="h-5 w-48 bg-gray-200 rounded mb-4" />
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-6 bg-gray-100 rounded" />
                        ))}
                    </div>
                </div>
            </Page>
        )
    }


    return (
        <Page className="min-h-screen bg-gray-50 p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-3xl font-bold text-gray-800">SuperAdmin Dashboard</h3>
                <Button >
                    + Add New Business
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: 'Total Businesses',
                        value: `${stats.totalBusinesses.toLocaleString()}`,
                        note: stats.notes.business,
                        icon: <Building2 className="h-6 w-6 text-blue-500" />
                    },
                    {
                        title: 'Total Users',
                        value: stats.totalUsers,
                        note: stats.notes.users,
                        icon: <Users className="h-6 w-6 text-purple-500" />
                    },
                    {
                        title: 'Active Branches',
                        value: stats.totalActiveBranches,
                        note: stats.notes.branches,
                        icon: <Store className="h-6 w-6 text-green-500" />
                    },
                    {
                        title: 'Total Revenue',
                        value: `PKR ${stats.totalRevenue.toLocaleString()}`,
                        note: stats.notes.revenue,
                        icon: <DollarSign className="h-6 w-6 text-yellow-500" />
                    },
                ].map((card, i) => (
                    <div key={i} className="bg-white rounded-xl shadow p-5 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <h5 className="text-sm text-gray-600 font-medium">{card.title}</h5>
                            {card.icon}
                        </div>
                        <div className="mt-3 text-2xl font-semibold text-gray-800">{card.value}</div>
                        <p className="text-xs text-gray-500 mt-1">{card.note}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Chart */}
            {/* <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Revenue Overview
                    </h5>
                    <div className="flex gap-2">
                        {['1m', '3m', '6m', '1y'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 rounded-lg text-sm border ${timeRange === range
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div> */}

            {/* Recent Businesses */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Recently Registered Businesses</h5>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-gray-700 bg-gray-100">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">City</th>
                                <th className="p-3">Owner</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBusinesses.map((b, i) => (
                                <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition">
                                    <td className="p-3 font-medium">{b.name}</td>
                                    <td className="p-3">{b.type}</td>
                                    <td className="p-3">{b.city}</td>
                                    <td className="p-3">{b.owner}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${b.status === BusinessStatus.ACTIVE
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {b.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Page>
    )
}
