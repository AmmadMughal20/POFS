import { IBaseEntity } from "./Base"
import { IUser } from "./UserSchema"

export interface IActivityLog extends IBaseEntity
{
    id: number
    userId: number
    User?: IUser
    action: string
    details?: string
}