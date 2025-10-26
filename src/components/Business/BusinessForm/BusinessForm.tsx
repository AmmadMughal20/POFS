'use client'
import { IBusiness } from '@/schemas/BusinessSchema'
import { BusinessesState } from '@/server/BusinessFormHandlers'
import { BusinessStatus, BusinessType, Province } from '@prisma/client'
import React, { useActionState, useState, useTransition } from 'react'
import Button from '../../ui/Button/Button'
import Form from '../../ui/Form/Form'
import FormGroup from '../../ui/FormGroup/FormGroup'
import Input from '../../ui/Input/Input'
import Label from '../../ui/Label/Label'
import RadioGroup from '../../ui/RadioGroup/RadioGroup'
import RadioInput from '../../ui/RadioInput/RadioInput'

interface BusinessFormProps
{
    mode?: 'add' | 'edit';
    initialData?: Partial<IBusiness>;
    onSubmitAction: (prevState: BusinessesState, formData: FormData) => Promise<BusinessesState>;
}

const BusinessForm: React.FC<BusinessFormProps> = ({
    mode = 'add',
    initialData = {},
    onSubmitAction,
}) =>
{

    const ownersToSuggest = [{
        id: 39,
        name: 'Ali'
    }, {
        id: 2,
        name: 'Saad'
    }, {
        id: 3,
        name: 'Riaz'
    },]

    const typesToSuggest = Object.values(BusinessType);


    const [isPending, startTransition] = useTransition()

    const initialState = { errors: {} }

    const [state, formAction] = useActionState(
        async (prevState: BusinessesState, formData: FormData) =>
        {
            return await onSubmitAction(prevState, formData);
        },
        initialState
    );

    const [typeValue, setTypeValue] = useState(
        state?.values?.type ?? initialData.type ?? ''
    );

    const [typeSuggestions, setTypeSuggestions] = useState<string[]>([]);

    const handleChangeType = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const value = e.target.value;
        setTypeValue(value);

        if (value.trim() === '')
        {
            setTypeSuggestions([]);
            return;
        }

        const filtered = typesToSuggest
            .filter(type => type.toLowerCase().startsWith(value.toLowerCase()))
            .slice(0, 5);

        setTypeSuggestions(filtered);
    };

    const handleSelectType = (type: string) =>
    {
        setTypeValue(type);
        setTypeSuggestions([]);
    };

    const [ownerValue, setOwnerValue] = useState(
        state?.values?.ownerId ?? initialData.ownerId ?? ''
    );

    const [ownerSuggestions, setOwnerSuggestions] = useState<typeof ownersToSuggest>([]);

    const handleChangeOwner = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const value = e.target.value;

        setOwnerValue(value);

        if (value.trim() === '')
        {
            setOwnerSuggestions([]);
            return;
        }

        const filtered = ownersToSuggest
            .filter(user => user.name.toLowerCase().startsWith(value.toLowerCase()))
            .slice(0, 5);

        setOwnerSuggestions(filtered);
    };

    const handleSelectOwner = (user: { id: number, name: string }) =>
    {
        setOwnerValue(user.id);
        setOwnerSuggestions([]);
    };

    return (
        <Form title={mode === 'add' ? 'Add Business' : 'Edit Business'} onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault(); // prevent page reload

            const formData = new FormData(e.currentTarget);
            startTransition(() =>
            {
                formAction(formData); // call your useActionState handler
            })
        }}>

            <h5>Business Information</h5>
            <FormGroup>
                <Label htmlFor='id'>Business Id <span className='text-red-500'>*</span></Label>
                <Input
                    name='id'
                    placeholder='Enter unique business Id e.g. GR-32'
                    readOnly={mode === 'edit'}
                    defaultValue={state?.values?.id ?? initialData.id ?? ''}
                />
                {state.errors?.id && (
                    <p className="text-error">{state.errors.id[0]}</p>
                )}
            </FormGroup>

            <FormGroup>
                <Label htmlFor='name'>Name <span className='text-red-500'>*</span></Label>
                <Input
                    name='name'
                    placeholder='Enter Name e.g. Starlet Shoes'
                    defaultValue={state?.values?.name ?? initialData.name ?? ''}
                />
                {state.errors?.name && (
                    <p className="text-error">{state.errors.name[0]}</p>
                )}
            </FormGroup>

            <FormGroup>
                <Label htmlFor='type'>Type <span className='text-red-500'>*</span></Label>
                <Input
                    name='type'
                    placeholder='Enter Business Type e.g. Gulshan e Ravi'
                    value={typeValue}
                    onChange={handleChangeType}
                />
                {typeSuggestions.length > 0 && (
                    <ul className="absolute z-50 bg-white border border-gray-200 rounded-md mt-1 w-full shadow-sm max-h-48 overflow-auto">
                        {typeSuggestions.map((type, index) => (
                            <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelectType(type)}
                            >
                                {type}
                            </li>
                        ))}
                    </ul>
                )}
                {state.errors?.type ? (
                    <p className="text-error">{state.errors.type[0]}</p>
                ) : null}
            </FormGroup>

            <FormGroup>
                <Label htmlFor='description'>Description</Label>
                <Input
                    name='description'
                    placeholder='Enter description'
                    defaultValue={state?.values?.description ?? initialData.description ?? ''}
                />
                {state.errors?.description && (
                    <p className="text-error">{state.errors.description[0]}</p>
                )}
            </FormGroup>

            <FormGroup>
                <Label htmlFor='establishedYear'>Established In</Label>
                <Input
                    type='number'
                    name='establishedYear'
                    placeholder='Enter estb. year e.g. 2010'
                    defaultValue={state?.values?.establishedYear ?? initialData.establishedYear ?? ''}
                />
                {state.errors?.establishedYear && (
                    <p className="text-error">{state.errors.establishedYear[0]}</p>
                )}
            </FormGroup>

            <FormGroup>
                <Label htmlFor='ownerId'>Owner <span className='text-red-500'>*</span></Label>
                <Input
                    name='ownerId'
                    placeholder='Enter owner from users'
                    value={ownerValue}
                    onChange={handleChangeOwner}
                />
                {ownerSuggestions.length > 0 && (
                    <ul className="absolute z-50 bg-white border border-gray-200 rounded-md mt-1 w-full shadow-sm max-h-48 overflow-auto">
                        {ownerSuggestions.map((user, index) => (
                            <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelectOwner(user)}
                            >
                                {user.name}
                            </li>
                        ))}
                    </ul>
                )}
                {state.errors?.ownerId ? (
                    <p className="text-error">{state.errors.ownerId[0]}</p>
                ) : null}
            </FormGroup>

            {mode === "edit" ?
                <FormGroup>
                    <RadioGroup name='status' title='Status' direction='horizontal'>
                        <RadioInput key={BusinessStatus.ACTIVE} name='status' title={'Active'} value={BusinessStatus.ACTIVE} defaultChecked={initialData.status == BusinessStatus.ACTIVE} />
                        <RadioInput key={BusinessStatus.INACTIVE} name='status' title={'Disable'} value={BusinessStatus.INACTIVE} defaultChecked={initialData.status == BusinessStatus.INACTIVE} />
                        <RadioInput key={BusinessStatus.PENDING_VERIFICATION} name='status' title={'Pending Verification'} value={BusinessStatus.PENDING_VERIFICATION} defaultChecked={initialData.status == BusinessStatus.PENDING_VERIFICATION} />
                        <RadioInput key={BusinessStatus.SUSPENDED} name='status' title={'Suspended'} value={BusinessStatus.SUSPENDED} defaultChecked={initialData.status == BusinessStatus.SUSPENDED} />
                    </RadioGroup>
                    {state.errors?.status && (
                        <p className="text-error">{state.errors.status[0]}</p>
                    )}
                </FormGroup> : <></>
            }

            <h5>Contact</h5>

            <FormGroup>
                <Label htmlFor='phone'>Phone No.</Label>
                <Input
                    name='phone'
                    placeholder='Enter phone no. e.g. 03217894561'
                    defaultValue={state?.values?.phone ?? initialData.phone ?? ''}
                />
                {state.errors?.phone && (
                    <p className="text-error">{state.errors.phone[0]}</p>
                )}
            </FormGroup>

            <FormGroup>
                <Label htmlFor='email'>Email</Label>
                <Input
                    name='email'
                    placeholder='Enter email e.g. admin@starlet.com'
                    defaultValue={state?.values?.email ?? initialData.email ?? ''}
                />
                {state.errors?.email && (
                    <p className="text-error">{state.errors.email[0]}</p>
                )}
            </FormGroup>

            <FormGroup>
                <Label htmlFor='website'>Website</Label>
                <Input
                    name='website'
                    placeholder='Enter website e.g. www.starlet.com'
                    defaultValue={state?.values?.website ?? initialData.website ?? ''}
                />
                {state.errors?.website && (
                    <p className="text-error">{state.errors.website[0]}</p>
                )}
            </FormGroup>

            <h5>Location</h5>

            <FormGroup>
                <Label htmlFor='city'>City</Label>
                <Input
                    name='city'
                    placeholder='Enter city e.g. Lahore'
                    defaultValue={state?.values?.city ?? initialData.city ?? ''}
                />
                {state.errors?.city && (
                    <p className="text-error">{state.errors.city[0]}</p>
                )}
            </FormGroup>

            <FormGroup>
                <Label htmlFor='province'>Province</Label>
                <Input
                    name='province'
                    placeholder='Enter province e.g. KPK'
                    defaultValue={state?.values?.province ?? initialData.province ?? ''}
                />
                {state.errors?.province && (
                    <p className="text-error">{state.errors.province[0]}</p>
                )}
            </FormGroup>

            <FormGroup>
                <Label htmlFor='country'>Country</Label>
                <Input
                    name='country'
                    placeholder='Enter country e.g. Pakistan'
                    defaultValue={state?.values?.country ?? initialData.country ?? ''}
                />
                {state.errors?.country && (
                    <p className="text-error">{state.errors.country[0]}</p>
                )}
            </FormGroup>

            <FormGroup>
                <Label htmlFor='address'>Address</Label>
                <Input
                    name='address'
                    placeholder='Enter address e.g. H#12 Block C2'
                    defaultValue={state?.values?.address ?? initialData.address ?? ''}
                />
                {state.errors?.address && (
                    <p className="text-error">{state.errors.address[0]}</p>
                )}
            </FormGroup>



            {/* Error Message */}
            {!state.success && state.message ? (
                <div className="text-center mb-4">
                    <p className="text-error font-medium">{state.message}</p>

                    {/* Show any unknown field errors */}
                    {Object.entries(state.errors || {}).map(([key, value]) =>
                    {
                        if (['id', 'phone', 'area', 'address', 'city', 'openingTime', 'closingTime', 'status', 'province'].includes(key)) return null;
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
                                ? 'Business added successfully.'
                                : 'Business updated successfully.')}
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

export default BusinessForm
