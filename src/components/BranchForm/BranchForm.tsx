'use client'
import React, { useActionState, useState } from 'react'
import Form from '../ui/Form/Form'
import FormGroup from '../ui/FormGroup/FormGroup'
import Input from '../ui/Input/Input'
import Label from '../ui/Label/Label'
import Button from '../ui/Button/Button'
import citiesList from "@/data/pakistan-cities-250.json"
import areasList from "@/data/areanames.json"
import { BranchesState } from '@/server/BranchFormHandlers'

interface BranchFormProps
{
    mode?: 'add' | 'edit';
    initialData?: Partial<{
        branchId: string;
        phoneNo: string;
        area: string;
        address: string;
        city: string;
        openingTime: string;
        closingTime: string;
    }>;
    onSubmitAction: (prevState: BranchesState, formData: FormData) => Promise<BranchesState>;
}

const BranchForm: React.FC<BranchFormProps> = ({
    mode = 'add',
    initialData = {},
    onSubmitAction,
}) =>
{

    const citiesToSuggest = citiesList.map(city => city.name)
    const areasToSuggest = areasList.map(area => area.name)

    const initialState = { errors: {} }

    const [state, formAction] = useActionState(
        async (prevState: BranchesState, formData: FormData) =>
        {
            return await onSubmitAction(prevState, formData);
        },
        initialState
    );

    // Controlled inputs for area and city
    const [cityValue, setCityValue] = useState(
        state?.values?.city ?? initialData.city ?? ''
    );
    const [areaValue, setAreaValue] = useState(
        state?.values?.area ?? initialData.area ?? ''
    );

    // Suggestions
    const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
    const [areaSuggestions, setAreaSuggestions] = useState<string[]>([]);

    // --- City Handlers ---
    const handleChangeCity = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const value = e.target.value;
        setCityValue(value);

        if (value.trim() === '')
        {
            setCitySuggestions([]);
            return;
        }

        const filtered = citiesToSuggest
            .filter(city => city.toLowerCase().startsWith(value.toLowerCase()))
            .slice(0, 5);

        setCitySuggestions(filtered);
    };

    const handleSelectCity = (city: string) =>
    {
        setCityValue(city);
        setCitySuggestions([]);
    };

    // --- Area Handlers ---
    const handleChangeArea = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const value = e.target.value;
        setAreaValue(value);

        if (value.trim() === '')
        {
            setAreaSuggestions([]);
            return;
        }

        const filtered = areasToSuggest
            .filter(area => area.toLowerCase().startsWith(value.toLowerCase()))
            .slice(0, 5);

        setAreaSuggestions(filtered);
    };

    const handleSelectArea = (area: string) =>
    {
        setAreaValue(area);
        setAreaSuggestions([]);
    };

    return (
        <Form title={mode === 'add' ? 'Add Branch' : 'Edit Branch'} onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault(); // prevent page reload

            const formData = new FormData(e.currentTarget);
            formAction(formData); // call your useActionState handler
        }}>
            {/* Branch ID */}
            <FormGroup>
                <Label htmlFor='branchId'>Branch Id</Label>
                <Input
                    name='branchId'
                    placeholder='Enter unique branch Id e.g. GR-32'
                    readOnly={mode === 'edit'}
                    defaultValue={state?.values?.id ?? initialData.branchId ?? ''}
                />
                {state.errors?.id && (
                    <p className="text-error">{state.errors.id[0]}</p>
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

            {/* Area */}
            <FormGroup>
                <Label htmlFor='area'>Area</Label>
                <Input
                    name='area'
                    placeholder='Enter Area e.g. Gulshan e Ravi'
                    value={areaValue}
                    onChange={handleChangeArea}
                />
                {areaSuggestions.length > 0 && (
                    <ul className="absolute z-50 bg-white border border-gray-200 rounded-md mt-1 w-full shadow-sm max-h-48 overflow-auto">
                        {areaSuggestions.map((area, index) => (
                            <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelectArea(area)}
                            >
                                {area}
                            </li>
                        ))}
                    </ul>
                )}
                {state.errors?.area ? (
                    <p className="text-error">{state.errors.area[0]}</p>
                ) : null}
            </FormGroup>

            {/* Address */}
            <FormGroup>
                <Label htmlFor='address'>Address</Label>
                <Input
                    name='address'
                    placeholder='Enter Address e.g. 41 Usman Street'
                    defaultValue={state?.values?.address ?? initialData.address ?? ''}
                />
                {state.errors?.address ? (
                    <p className="text-error">{state.errors.address[0]}</p>
                ) : null}
            </FormGroup>

            {/* City */}
            <FormGroup>
                <Label htmlFor='city'>City</Label>
                <Input
                    name='city'
                    placeholder='Enter City e.g. Lahore'
                    value={cityValue}
                    onChange={handleChangeCity}
                />
                {citySuggestions.length > 0 && (
                    <ul className="absolute z-50 bg-white border border-gray-200 rounded-md mt-1 w-full shadow-sm max-h-48 overflow-auto">
                        {citySuggestions.map((city, index) => (
                            <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelectCity(city)}
                            >
                                {city}
                            </li>
                        ))}
                    </ul>
                )}
                {state.errors?.city ? (
                    <p className="text-error">{state.errors.city[0]}</p>
                ) : null}
            </FormGroup>

            {/* Times */}
            <FormGroup>
                <Label htmlFor='openingTime'>Opening Time</Label>
                <Input
                    name='openingTime'
                    type="time"
                    defaultValue={state?.values?.openingTime ?? initialData.openingTime ?? ''}
                />
                {state.errors?.openingTime ? (
                    <p className="text-error">{state.errors.openingTime[0]}</p>
                ) : null}
            </FormGroup>

            <FormGroup>
                <Label htmlFor='closingTime'>Closing Time</Label>
                <Input
                    name='closingTime'
                    type="time"
                    defaultValue={state?.values?.closingTime ?? initialData.closingTime ?? ''}
                />
                {state.errors?.closingTime ? (
                    <p className="text-error">{state.errors.closingTime[0]}</p>
                ) : null}
            </FormGroup>

            {/* Success message */}
            {state.success ? (
                <div className='text-center'>
                    <p className='text-success font-bold text-lg'>
                        {mode === "add" ? "Branch Added Successfully" : "Branch Updated Successfully"}
                    </p>
                </div>
            ) : <></>}

            <FormGroup>
                <Button>{mode === 'add' ? 'Submit' : 'Update'}</Button>
            </FormGroup>
        </Form>
    )
}

export default BranchForm
