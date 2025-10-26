'use client'
import { RolesState } from '@/server/RoleFormHandlers'
import React, { useActionState, useTransition } from 'react'
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

    const [isPending, startTransition] = useTransition()
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
            <FormGroup>
                <TagInput suggestions={permissions} name='permissions' defaultTags={initialData.permissions ?? []} />
                {state.errors?.permissions && (
                    <p className="text-error">{state.errors.permissions[0]}</p>
                )}
            </FormGroup>

            {/* Error Message */}
            {!state.success && state.message ? (
                <div className="text-center mb-4">
                    <p className="text-error font-medium">{state.message}</p>

                    {/* Show any unknown field errors */}
                    {Object.entries(state.errors || {}).map(([key, value]) =>
                    {
                        if (['title'].includes(key)) return null;
                        return (
                            <p key={key} className="text-error text-sm">
                                {value?.[0]}
                            </p>
                        );
                    })}
                </div>
            ) : <></>}

            {/* Success Message */}
            {state.success ? (
                <div className="text-center mt-3">
                    <p className="text-success font-bold text-lg">
                        {state.message ??
                            (mode === 'add'
                                ? 'Role added successfully.'
                                : 'Role updated successfully.')}
                    </p>
                </div>
            ) : <></>}

            <FormGroup>
                <Button disabled={isPending}>
                    {isPending ? 'Processing...' : mode === 'add' ? 'Submit' : 'Update'}
                </Button>
            </FormGroup>
        </Form>
    )
}

export default RoleForm
