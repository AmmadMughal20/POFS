import { IBranch } from "./BranchSchema"
import { IBusiness } from "./BusinessSchema"
import { IUser } from "./UserSchema"

export interface ISalesMan
{
    id: number
    User: IUser
    branchId: string
    Branch?: IBranch
    businessId: string
    Business?: IBusiness
}