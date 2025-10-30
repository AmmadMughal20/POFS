'use client'

import Page from '@/components/ui/Page/Page'
import { getBranch } from '@/server/BranchFormHandlers'
import { useParams } from 'next/navigation'
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

export default function BranchDashboard()
{
    const { branchId } = useParams() as { branchId?: string }
    const { data: branch } = useSWR(branchId ? ['branch', branchId] : null, () => swrFetcher(getBranch, branchId!))

    const stats = [
        { title: 'Total Sales', value: 'PKR 254,000', change: '+12.4%' },
        { title: 'Total Purchases', value: 'PKR 112,000', change: '+4.1%' },
        { title: 'Expenses', value: 'PKR 38,000', change: '-2.3%' },
        { title: 'Profit', value: 'PKR 104,000', change: '+9.7%' },
        { title: 'Stock Units', value: '847', change: '+3.2%' },
    ]

    const topProducts = [
        { name: 'iPhone 15 Pro', qty: 32, amount: 112000 },
        { name: 'Samsung A54', qty: 27, amount: 87000 },
        { name: 'AirPods Pro 2', qty: 21, amount: 54000 },
        { name: 'Mi Powerbank', qty: 45, amount: 31000 },
        { name: 'Apple Watch SE', qty: 15, amount: 42000 },
    ]

    const lowStock = [
        { name: 'iPhone 14 Case', stock: 4 },
        { name: 'Vivo Charger', stock: 3 },
        { name: 'Data Cable Type-C', stock: 2 },
    ]

    const recentOrders = [
        { id: '#1021', customer: 'Ali Khan', total: 'PKR 12,500', date: '27 Oct 2025', status: 'COMPLETED' },
        { id: '#1020', customer: 'Sara Ahmed', total: 'PKR 8,200', date: '27 Oct 2025', status: 'PENDING' },
        { id: '#1019', customer: 'Umar Javed', total: 'PKR 15,700', date: '26 Oct 2025', status: 'COMPLETED' },
    ]

    const loading = !branch

    if (loading)
    {
        return (<Page className="min-h-screen p-6 space-y-8">
            {/* Header Skeleton */}
            <div className="bg-white rounded-xl p-5 shadow flex justify-between items-center border border-gray-100">
                <div>
                    <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-48 bg-gray-200 rounded"></div>
                </div>
                <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>
            </div>

            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white border border-gray-100 rounded-xl p-4 shadow"
                    >
                        <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 w-16 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>

            {/* Top Products Skeleton */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <div className="h-5 w-48 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex justify-between">
                            <div className="h-4 w-40 bg-gray-200 rounded"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Low Stock Alerts Skeleton */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
                <ul className="divide-y divide-gray-100">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <li key={i} className="flex justify-between py-2">
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-4 w-10 bg-gray-200 rounded"></div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent Orders Skeleton */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <div className="h-5 w-48 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex justify-between py-2">
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            <div className="h-4 w-28 bg-gray-200 rounded"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </Page>)
    }

    return (
        <Page className="p-6 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-xl p-5 shadow flex justify-between items-center border border-gray-100">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{branch.area}</h3>
                    <p className="text-gray-600">{branch.area} • {branch.status}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Open {branch.openingTime.toString().slice(16, 21)} — Close {branch.closingTime.toString().slice(16, 21)}
                    </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Add Expense
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow hover:shadow-md transition">
                        <p className="text-gray-500 text-sm">{s.title}</p>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{s.value}</p>
                        <p className={`text-sm mt-1 ${s.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {s.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <h5 className="text-lg font-semibold text-gray-800 mb-3">Top-Selling Products</h5>
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-gray-700 bg-gray-100">
                        <tr>
                            <th className="p-3">Product</th>
                            <th className="p-3 text-right">Qty Sold</th>
                            <th className="p-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topProducts.map((p, i) => (
                            <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition">
                                <td className="p-3 font-medium">{p.name}</td>
                                <td className="p-3 text-right">{p.qty}</td>
                                <td className="p-3 text-right font-semibold">PKR {p.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <h5 className="text-lg font-semibold text-gray-800 mb-3">Low Stock Alerts</h5>
                <ul className="divide-y divide-gray-200">
                    {lowStock.map((p, i) => (
                        <li key={i} className="flex justify-between py-2">
                            <span>{p.name}</span>
                            <span className="text-red-600 font-medium">{p.stock} left</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <h5 className="text-lg font-semibold text-gray-800 mb-3">Recent Orders</h5>
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-gray-700 bg-gray-100">
                        <tr>
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3 text-right">Total</th>
                            <th className="p-3 text-right">Date</th>
                            <th className="p-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((o, i) => (
                            <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition">
                                <td className="p-3 font-medium">{o.id}</td>
                                <td className="p-3">{o.customer}</td>
                                <td className="p-3 text-right">{o.total}</td>
                                <td className="p-3 text-right">{o.date}</td>
                                <td className={`p-3 text-right font-medium ${o.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                    {o.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Page>
    )
}
