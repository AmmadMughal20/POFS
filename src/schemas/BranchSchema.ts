import z from 'zod'

import citiesList from '@/data/pakistan-cities-250.json';
import areaCodeList from '@/data/areanames.json';

const citiesToCompare = citiesList.map(city => (city.name))
const areasToCompare = areaCodeList.map(area => (area.name))
type City = (typeof citiesToCompare)[number]
type Area = (typeof areasToCompare)[number]

export interface Branch
{
    id: string
    phoneNo: string
    address: string
    area: Area,
    city: City,
    openingTime: Date
    closingTime: Date
    status: 'ACTIVE' | 'DISABLED'
    branchManager?: number | null

}

export const BranchSchema = z.object({
    id: z.string().min(1, 'Branch Id is required'),
    phoneNo: z.string().regex(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/, "Enter Pakistani mobile no."),
    address: z.string().min(1, 'Address is required'),
    area: z.literal(areasToCompare, 'Enter proper area name'),
    city: z.literal(citiesToCompare, 'Enter Pakistani city name'),
    openingTime: z
        .date(),

    closingTime: z
        .date(),

});