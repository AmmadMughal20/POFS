import { IOrder } from "./OrderSchema"
import { IUser } from "./UserSchema"

export interface ICustomer
{
    id: number
    User: IUser
    address: string
    city: string
    area: string
    Orders?: IOrder[]
}