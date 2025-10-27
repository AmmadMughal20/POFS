'use client'
import { useState, useTransition } from 'react'
import { IBranch } from '@/schemas/BranchSchema'
import { createManagerAction, ManagerState } from '@/server/ManagerFormHandlers'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Card from '@/components/ui/Card/Card'
import Label from '@/components/ui/Label/Label'

interface ChangeBranchManagerProps
{
    selectedBranch: IBranch
    existingManagers?: { id: number; name: string; email: string }[]
    existingSalesmen?: { id: number; name: string; email: string }[]
}

const ChangeBranchManagerPopup = ({
    selectedBranch,
    existingManagers = [],
    existingSalesmen = [],
}: ChangeBranchManagerProps) =>
{
    const [selectedUserId, setSelectedUserId] = useState<number | 'new' | undefined>()
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNo: '',
        roleId: '0',
    })
    const [message, setMessage] = useState<string | null>(null)

    const handleSubmit = () =>
    {
        startTransition(async () =>
        {
            const form = new FormData()

            form.append('branchId', selectedBranch.id.toString())
            form.append('businessId', selectedBranch.businessId.toString())

            if (selectedUserId && selectedUserId !== 'new')
            {
                // Just assign existing user
                form.append('userId', selectedUserId.toString())
            } else
            {
                // Add new user & manager
                form.append('name', formData.name)
                form.append('email', formData.email)
                form.append('phoneNo', formData.phoneNo)
                form.append('roleId', formData.roleId)
            }

            const res = await createManagerAction({} as ManagerState, form)
            setMessage(res.message || null)
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const showNewForm =
        isAddingNew || selectedUserId === 'new' || (!existingManagers.length && !existingSalesmen.length)

    return (
        <Card>
            <div className="p-5 w-full max-w-lg">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-center">
                    Change Branch Manager
                </h3>

                {!showNewForm ? (
                    <div>
                        <Label htmlFor='existingManagerType'>Select from existing managers or salesmen</Label>
                        <select
                            onChange={(e) => setSelectedUserId(e.target.value === 'new' ? 'new' : Number(e.target.value))}
                            className="mt-2 w-full border rounded-md p-2"
                            defaultValue=""
                        >
                            <option value="">Select user</option>
                            {existingManagers.length > 0 && (
                                <optgroup label="Managers">
                                    {existingManagers.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} ({m.email})
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                            {existingSalesmen.length > 0 && (
                                <optgroup label="Salesmen">
                                    {existingSalesmen.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} ({s.email})
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                            <option value="new">➕ Add New Manager</option>
                        </select>
                    </div>
                ) : (
                    <div className="space-y-3 mt-4">
                        <Label htmlFor='name'>Name</Label>
                        <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter name" />

                        <Label htmlFor='email'>Email</Label>
                        <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email" />

                        <Label htmlFor='phoneNo'>Phone No</Label>
                        <Input
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                        />

                        <Label htmlFor='roleId'>Role ID</Label>
                        <Input
                            name="roleId"
                            value={formData.roleId}
                            onChange={handleInputChange}
                            placeholder="Role ID for manager"
                        />
                    </div>
                )}

                {message && <p className="mt-4 text-sm text-center text-gray-600">{message}</p>}

                <div className="mt-6 flex justify-end gap-2">
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default ChangeBranchManagerPopup
