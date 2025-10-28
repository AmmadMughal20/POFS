'use client'

import Page from '@/components/ui/Page/Page'
import
{
    getBranchPerformance,
    getDashboardStats,
    getLowStockProducts,
    getRecentOrders,
    getSalesOverview
} from '@/server/AdminDashboardHandlers'
import { getBusiness } from '@/server/BusinessFormHandlers'
import { OrderStatus } from '@prisma/client'
import { DollarSign, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
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

type DashboardStats = {
    sales: number
    orders: number
    stock: number
    employees: number
    notes: {
        sales: string
        orders: string
        stock: string
        employees: string
    }
}

type BranchPerformance = {
    area: string
    sales: number
    purchases: number
    expenses: number
    stockUnits: number
    products: number
}

type LowStockProduct = {
    title: string
    sku: string
    category: string
    stock: number
}

type RecentOrder = {
    id: string
    customer: string
    date: string
    amount: string
    status: OrderStatus
}

type SalesOverview = { label: string; sales: number }[]

type TimeRange = "week" | "month" | "year"

export default function AdminDashboard()
{
    const { businessId } = useParams() as { businessId?: string } // ✅ read param from URL
    const [timeRange, setTimeRange] = useState<TimeRange>("week")
    const { data: business } = useSWR(businessId ? ['business', businessId] : null, () => swrFetcher(getBusiness, businessId!))
    const { data: salesData } = useSWR<SalesOverview>(
        businessId ? ['sales-overview', businessId, timeRange] : null,
        () => swrFetcher(getSalesOverview, businessId!, timeRange)
    )
    const { data: stats } = useSWR<DashboardStats>(businessId ? ['stats', businessId] : null, () => swrFetcher(getDashboardStats, businessId!))
    const { data: branches } = useSWR<BranchPerformance[]>(businessId ? ['branches', businessId] : null, () => swrFetcher(getBranchPerformance, businessId!))
    const { data: lowStock } = useSWR<LowStockProduct[]>(businessId ? ['low-stock', businessId] : null, () => swrFetcher(getLowStockProducts, businessId!))
    const { data: orders } = useSWR<RecentOrder[]>(businessId ? ['orders', businessId] : null, () => swrFetcher(getRecentOrders, businessId!))

    const loading = !business || !stats || !branches || !lowStock || !orders

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
        <Page className="min-h-screen p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-3xl font-bold text-gray-800">{business?.name}</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow text-sm">
                    + New Sale
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: 'Total Sales',
                        value: `PKR ${stats.sales.toLocaleString()}`,
                        note: stats.notes.sales,
                        icon: <DollarSign className="h-6 w-6 text-green-500" />,
                    },
                    {
                        title: 'Orders',
                        value: stats.orders,
                        note: stats.notes.orders,
                        icon: <ShoppingCart className="h-6 w-6 text-blue-500" />,
                    },
                    {
                        title: 'Products in Stock',
                        value: stats.stock,
                        note: stats.notes.stock,
                        icon: <Package className="h-6 w-6 text-yellow-500" />,
                    },
                    {
                        title: 'Employees',
                        value: stats.employees,
                        note: stats.notes.employees,
                        icon: <Users className="h-6 w-6 text-purple-500" />,
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

            {/* Sales Chart */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" /> Sales Overview
                    </h5>
                    <div className="flex gap-2">
                        {['week', 'month', 'year'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range as TimeRange)}
                                className={`px-3 py-1 rounded-lg text-sm border ${timeRange === range
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Branch Performance */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Branch Performance Overview</h5>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-gray-700 bg-gray-100">
                            <tr>
                                <th className="p-3">Area</th>
                                <th className="p-3 text-right">Sales</th>
                                <th className="p-3 text-right">Purchases</th>
                                <th className="p-3 text-right">Expenses</th>
                                <th className="p-3 text-right">Stock Units</th>
                                <th className="p-3 text-right">Products</th>
                                <th className="p-3 text-right">Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branches.map((b, i) =>
                            {
                                const profit = b.sales - (b.purchases + b.expenses)
                                const profitColor = profit >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                                return (
                                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition">
                                        <td className="p-3">{b.area}</td>
                                        <td className="p-3 text-right font-medium text-gray-800">PKR {b.sales.toLocaleString()}</td>
                                        <td className="p-3 text-right text-gray-700">PKR {b.purchases.toLocaleString()}</td>
                                        <td className="p-3 text-right text-gray-700">PKR {b.expenses.toLocaleString()}</td>
                                        <td className="p-3 text-right">{b.stockUnits.toLocaleString()}</td>
                                        <td className="p-3 text-right">{b.products}</td>
                                        <td className={`p-3 text-right font-semibold ${profitColor}`}>
                                            {profit >= 0 ? '+' : '-'}PKR {Math.abs(profit).toLocaleString()}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Low Stock */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alerts</h5>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-gray-700 bg-gray-100">
                            <tr>
                                <th className="p-3">Product</th>
                                <th className="p-3">SKU</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Available Units</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStock.map((p, i) => (
                                <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition">
                                    <td className="p-3 font-medium">{p.title}</td>
                                    <td className="p-3">{p.sku}</td>
                                    <td className="p-3">{p.category}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${p.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {p.stock} units
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h5>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-gray-700 bg-gray-100">
                            <tr>
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, i) => (
                                <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition">
                                    <td className="p-3 font-medium">{order.id}</td>
                                    <td className="p-3">{order.customer}</td>
                                    <td className="p-3">{order.date}</td>
                                    <td className="p-3">{order.amount}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${order.status === 'Completed' as OrderStatus
                                                ? 'bg-green-100 text-green-700'
                                                : order.status === 'Pending' as OrderStatus
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {order.status}
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
