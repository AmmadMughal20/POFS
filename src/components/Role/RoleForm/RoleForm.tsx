'use client'
import { RolesState } from '@/server/RoleFormHandlers'
import React, { startTransition, useActionState } from 'react'
import Button from '../../ui/Button/Button'
import Form from '../../ui/Form/Form'
import FormGroup from '../../ui/FormGroup/FormGroup'
import Input from '../../ui/Input/Input'
import Label from '../../ui/Label/Label'
import TagInput, { Tag } from '@/components/ui/TagInput/TagInput'
import { IPermission } from '@/schemas/PermissionSchema'

interface RoleFormProps
{
    mode?: 'add' | 'edit';
    initialData?: Partial<{
        id?: number
        title: string;
        permissions?: Tag[]
    }>;
    onSubmitAction: (prevState: RolesState, formData: FormData) => Promise<RolesState>;
    allPerms: IPermission[]
}

const RoleForm: React.FC<RoleFormProps> = ({
    mode = 'add',
    initialData = {},
    onSubmitAction,
    allPerms
}) =>
{

    const initialState = { errors: {} }

    const [state, formAction] = useActionState(
        async (prevState: RolesState, formData: FormData) =>
        {
            return await onSubmitAction(prevState, formData);
        },
        initialState
    );
    const permissions = allPerms.map((perm) => ({
        id: perm.id,
        title: perm.title
    }))


    return (
        <Form title={mode === 'add' ? 'Add Role' : 'Edit Role'} onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault(); // prevent page reload

            const formData = new FormData(e.currentTarget);
            startTransition(() =>
            {
                formAction(formData); // call your useActionState handler
            })
        }}>

            {/* ID */}
            {mode === "edit" ?
                <FormGroup>
                    <Label htmlFor='id'>Id</Label>
                    <Input
                        name='id'
                        readOnly={mode === "edit"}
                        defaultValue={initialData.id}
                    />
                    {state.errors?.id && (
                        <p className="text-error">{state.errors.id[0]}</p>
                    )}
                </FormGroup> : <></>
            }

            {/* Title */}
            <FormGroup>
                <Label htmlFor='title'>Title</Label>
                <Input
                    name='title'
                    placeholder='Enter title e.g. Manager'
                    defaultValue={state?.values?.title ?? initialData.title ?? ''}
                />
                {state.errors?.title && (
                    <p className="text-error">{state.errors.title[0]}</p>
                )}
            </FormGroup>
            {/* <FormGroup> */}
            <TagInput suggestions={permissions} name='permissions' defaultTags={initialData.permissions ?? []} />
            {/* </FormGroup> */}

            {/* Success message */}
            {state.success ? (
                <div className='text-center'>
                    <p className='text-success font-bold text-lg'>
                        {mode === "add" ? "Role Added Successfully" : "Role Updated Successfully"}
                    </p>
                </div>
            ) : <></>}

            <FormGroup>
                <Button>{mode === 'add' ? 'Submit' : 'Update'}</Button>
            </FormGroup>
        </Form>
    )
}

export default RoleForm
