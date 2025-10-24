'use client'
import React, { startTransition, useActionState } from 'react'
import Form from '../../ui/Form/Form'
import FormGroup from '../../ui/FormGroup/FormGroup'
import Input from '../../ui/Input/Input'
import Label from '../../ui/Label/Label'
import Button from '../../ui/Button/Button'
import { UsersState } from '@/server/UserFormHandlers'
import RadioGroup from '../../ui/RadioGroup/RadioGroup'
import RadioInput from '../../ui/RadioInput/RadioInput'
import { IUser } from '@/schemas/UserSchema'
import { IRole } from '@/schemas/RoleSchema'
import { UserStatus } from '@prisma/client'

interface UserFormProps
{
    mode?: 'add' | 'edit';
    initialData?: Partial<IUser>;
    onSubmitAction: (prevState: UsersState, formData: FormData) => Promise<UsersState>;
    roles: IRole[]
}

const UserForm: React.FC<UserFormProps> = ({
    mode = 'add',
    initialData = {},
    onSubmitAction,
    roles
}) =>
{

    const initialState = { errors: {} }

    const [state, formAction] = useActionState(
        async (prevState: UsersState, formData: FormData) =>
        {
            return await onSubmitAction(prevState, formData);
        },
        initialState
    );

    return (
        <Form title={mode === 'add' ? 'Add User' : 'Edit User'} onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault(); // prevent page reload

            const formData = new FormData(e.currentTarget);
            startTransition(() =>
            {
                formAction(formData); // call your useActionState handler
            })
        }}>
            {/* User ID */}

            {mode === "edit" ?
                <FormGroup>
                    <Label htmlFor='userId'>User Id</Label>
                    <Input
                        name='userId'
                        placeholder='Enter unique user Id e.g. GR-32'
                        readOnly={mode === 'edit'}
                        defaultValue={state?.values?.id ?? initialData.id ?? ''}
                    />
                    {state.errors?.id && (
                        <p className="text-error">{state.errors.id[0]}</p>
                    )}
                </FormGroup> : <></>
            }

            {/* Name */}
            <FormGroup>
                <Label htmlFor='name'>Name</Label>
                <Input
                    name='name'
                    placeholder='Enter name e.g. John Doe'
                    defaultValue={state?.values?.name as string ?? initialData.name ?? ''}
                />
                {state.errors?.name && (
                    <p className="text-error">{state.errors.name[0]}</p>
                )}
            </FormGroup>

            {/* Phone */}
            <FormGroup>
                <Label htmlFor='email'>Email</Label>
                <Input
                    name='email'
                    placeholder='Enter Email e.g. 03214561237'
                    defaultValue={state?.values?.email ?? initialData.email ?? ''}
                />
                {state.errors?.email && (
                    <p className="text-error">{state.errors.email[0]}</p>
                )}
            </FormGroup>

            {/* Phone */}
            <FormGroup>
                <Label htmlFor='phoneNo'>Phone</Label>
                <Input
                    name='phoneNo'
                    placeholder='Enter Phone e.g. 03214561237'
                    defaultValue={state?.values?.phoneNo ?? initialData.phoneNo ?? ''}
                />
                {state.errors?.phoneNo && (
                    <p className="text-error">{state.errors.phoneNo[0]}</p>
                )}
            </FormGroup>

            {/* Role */}
            <FormGroup>
                <RadioGroup name='roleId' title='Role' direction='horizontal'>
                    {
                        roles.map((item) => (
                            item.id ?
                                <RadioInput key={item.id} name='roleId' title={item.title} value={item.id} defaultChecked={initialData.roleId == item.id} /> : <></>
                        ))
                    }
                </RadioGroup>

                {state.errors?.roleId ? (
                    <p className="text-error">{state.errors.roleId[0]}</p>
                ) : null}
            </FormGroup>

            {mode === "edit" ?
                <FormGroup>
                    <RadioGroup name='status' title='Status' direction='horizontal'>
                        <RadioInput key={UserStatus.ACTIVE} name='status' title={'Active'} value={UserStatus.ACTIVE} defaultChecked={initialData.status == UserStatus.ACTIVE} />
                        <RadioInput key={UserStatus.DISABLED} name='status' title={'Disable'} value={UserStatus.DISABLED} defaultChecked={initialData.status == UserStatus.DISABLED} />
                    </RadioGroup>
                    {state.errors?.status && (
                        <p className="text-error">{state.errors.status[0]}</p>
                    )}
                </FormGroup> : <></>
            }

            {/* Success message */}
            {state.success ? (
                <div className='text-center'>
                    <p className='text-success font-bold text-lg'>
                        {mode === "add" ? "User Added Successfully" : "User Updated Successfully"}
                    </p>
                </div>
            ) : <></>}
            {
                state.success == false && state.message ? (
                    <div className='text-center'>
                        <p className='text-error font-bold text-lg'>
                            {state.message}
                        </p>
                    </div>
                ) : <></>
            }

            <FormGroup>
                <Button>{mode === 'add' ? 'Submit' : 'Update'}</Button>
            </FormGroup>
        </Form>
    )
}

export default UserForm
