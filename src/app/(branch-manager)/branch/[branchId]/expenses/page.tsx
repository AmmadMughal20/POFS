import ExpensesPageClient from '@/components/Expense/ExpenseClientComponent/ExpenseClientComponent';
import { getBranch } from '@/server/BranchFormHandlers';
import { getExpenses } from '@/server/ExpensesFormHandlers';
import { getUserSession } from '@/server/getUserSession';


interface ExpensePageProps
{
    params: Promise<{
        businessId: string;
        branchId: string;
    }>;
}

const page = async ({ params }: ExpensePageProps) =>
{
    const { branchId } = await params;
    const { items, total } = await getExpenses(0, 10, { id: "asc" }, { branchId });
    const branch = await getBranch(branchId)
    const businessId = branch?.businessId ?? ''

    const { permissions } = await getUserSession();

    return (<ExpensesPageClient initialExpenses={items} permissions={permissions} initialTotal={total} branchId={branchId} businessId={businessId} />)
}

export default page