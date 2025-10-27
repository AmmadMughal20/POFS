import { IBranch } from "./BranchSchema"
import { IBusiness } from "./BusinessSchema"
import { IUser } from "./UserSchema"

export interface IManager
{
    id: number
    User: IUser
    Branches?: IBranch[]
    businessId: string
    Business?: IBusiness
}