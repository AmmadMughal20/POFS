'use server'

import { prisma } from "@/lib/prisma"
import { BranchStatus } from "@prisma/client"
import { startOfWeek, startOfMonth, startOfYear, addDays, addMonths, addYears, format } from 'date-fns'


function percentChange(current: number, previous: number): string
{
    if (previous === 0) return '+0%'
    const change = ((current - previous) / previous) * 100
    const symbol = change >= 0 ? '+' : ''
    return `${symbol}${change.toFixed(1)}%`
}

export async function getDashboardStats(businessId: string)
{
    const now = new Date()
    const startOfThisWeek = new Date()
    startOfThisWeek.setDate(now.getDate() - 7)
    const startOfLastWeek = new Date()
    startOfLastWeek.setDate(now.getDate() - 14)

    // 🧮 Parallel queries
    const [
        salesThisWeek,
        salesLastWeek,
        ordersThisWeek,
        ordersLastWeek,
        stockTotal,
        employeesTotal,
    ] = await Promise.all([
        prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { businessId, createdAt: { gte: startOfThisWeek } },
        }),
        prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
                businessId,
                createdAt: { gte: startOfLastWeek, lt: startOfThisWeek },
            },
        }),
        prisma.order.count({
            where: { businessId, createdAt: { gte: startOfThisWeek } },
        }),
        prisma.order.count({
            where: {
                businessId,
                createdAt: { gte: startOfLastWeek, lt: startOfThisWeek },
            },
        }),
        prisma.stock.aggregate({
            _sum: { stockUnits: true },
            where: { Branch: { businessId } },
        }),
        prisma.manager.count({ where: { businessId } }).then(async (m) => m + (await prisma.salesMan.count({ where: { businessId } }))),
    ])

    const totalSales = Number(salesThisWeek._sum.totalAmount ?? 0)
    const prevSales = Number(salesLastWeek._sum.totalAmount ?? 0)
    const totalOrders = ordersThisWeek
    const prevOrders = ordersLastWeek
    const totalStock = stockTotal._sum.stockUnits ?? 0
    const totalEmployees = employeesTotal

    return {
        sales: totalSales,
        orders: totalOrders,
        stock: totalStock,
        employees: totalEmployees,
        notes: {
            sales: `${percentChange(totalSales, prevSales)} vs last week`,
            orders: `${percentChange(totalOrders, prevOrders)} vs last week`,
            stock: '-23 low-stock items', // (optional: dynamic low-stock count)
            employees: '2 new this month', // (optional: can be made dynamic)
        },
    }
}

export async function getSalesOverview(businessId: string, range: 'week' | 'month' | 'year')
{
    const now = new Date()
    let startDate: Date
    let interval: 'day' | 'month'
    let labels: string[]

    if (range === 'week')
    {
        startDate = startOfWeek(now, { weekStartsOn: 1 })
        interval = 'day'
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    } else if (range === 'month')
    {
        startDate = startOfMonth(now)
        interval = 'day'
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
        labels = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`)
    } else
    {
        startDate = startOfYear(now)
        interval = 'month'
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }

    // Get all orders since startDate
    const orders = await prisma.order.findMany({
        where: {
            businessId,
            createdAt: { gte: startDate },
        },
        select: { totalAmount: true, createdAt: true },
    })

    // Initialize chart data
    const data = labels.map((label) => ({ label, sales: 0 }))

    for (const order of orders)
    {
        const date = new Date(order.createdAt)
        let index: number

        if (range === 'week')
        {
            index = (date.getDay() + 6) % 7 // Convert Sun=0 to index 6
        } else if (range === 'month')
        {
            index = date.getDate() - 1
        } else
        {
            index = date.getMonth()
        }

        if (index >= 0 && index < data.length)
        {
            data[index].sales += Number(order.totalAmount)
        }
    }

    return data
}

export async function getBranchPerformance(businessId: string)
{
    // Get all active branches for the business
    const branches = await prisma.branch.findMany({
        where: {
            businessId,
            isDeleted: false,
            status: BranchStatus.ACTIVE
        },
        select: {
            id: true,
            area: true,
            city: true,
        },
    })

    const results = await Promise.all(
        branches.map(async (branch) =>
        {
            // Sum of sales (Order.totalAmount)
            const sales = await prisma.order.aggregate({
                where: { branchId: branch.id, businessId },
                _sum: { totalAmount: true },
            })

            // Sum of purchases
            const purchases = await prisma.purchase.aggregate({
                where: { branchId: branch.id, businessId },
                _sum: { totalAmount: true },
            })

            // Sum of expenses
            const expenses = await prisma.expense.aggregate({
                where: { branchId: branch.id, businessId },
                _sum: { amount: true },
            })

            // Stock summary
            const stockData = await prisma.stock.findMany({
                where: { branchId: branch.id },
                select: { stockUnits: true, productId: true },
            })

            const stockUnits = stockData.reduce((sum, s) => sum + s.stockUnits, 0)
            const products = new Set(stockData.map((s) => s.productId)).size

            return {
                area: branch.area,
                city: branch.city,
                sales: Number(sales._sum.totalAmount || 0),
                purchases: Number(purchases._sum.totalAmount || 0),
                expenses: Number(expenses._sum.amount || 0),
                stockUnits,
                products,
            }
        })
    )

    return results
}

export async function getLowStockProducts(businessId: string)
{
    // Define what counts as “low stock”
    const LOW_STOCK_THRESHOLD = 10

    // Fetch products for this business with aggregated stock counts
    const lowStockProducts = await prisma.product.findMany({
        where: {
            businessId,
            isDeleted: false,
            stocks: {
                some: { stockUnits: { lte: LOW_STOCK_THRESHOLD } },
            },
        },
        select: {
            title: true,
            sku: true,
            Category: { select: { name: true } },
            stocks: {
                select: { stockUnits: true },
            },
        },
        orderBy: { title: 'asc' },
    })

    // Aggregate total stock across branches for each product
    return lowStockProducts.map((p) => ({
        title: p.title,
        sku: p.sku,
        category: p.Category?.name ?? 'Uncategorized',
        stock: p.stocks.reduce((sum, s) => sum + s.stockUnits, 0),
    }))
}

export async function getRecentOrders(businessId: string)
{
    const orders = await prisma.order.findMany({
        where: {
            businessId,
        },
        include: {
            Customer: {
                include: {
                    User: {
                        select: { name: true },
                    }
                }
            },
        },
        orderBy: { createdAt: 'desc' },
        take: 10, // show only recent 10 orders
    })

    return orders.map((order) => ({
        id: `#ORD-${order.id.toString().padStart(4, '0')}`,
        customer: order.Customer?.User.name || 'Walk-in Customer',
        date: format(new Date(order.createdAt), 'MMM dd, yyyy'),
        amount: `PKR ${order.totalAmount.toLocaleString()}`,
        status: order.status, // assuming status is enum: 'Pending' | 'Completed' | 'Cancelled'
    }))
}