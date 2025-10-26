import { PaymentType } from "./Base"
import { IBranch } from "./BranchSchema"
import { IBusiness } from "./BusinessSchema"
import { IUser } from "./UserSchema"

export interface IExpense
{
    id: number
    title: string
    description?: string
    amount: number
    date: Date
    category?: string
    paymentType: PaymentType
    branchId: string
    Branch?: IBranch
    businessId: string
    Business?: IBusiness
    createdBy: number
    User?: IUser
    createdAt?: Date
    updatedAt?: Date
}