import z from 'zod'

import citiesList from '@/data/pakistan-cities-250.json';
import areaCodeList from '@/data/areanames.json';
import { IBusiness } from './BusinessSchema';
import { IManager } from './ManagerSchema';
import { ISalesMan } from './SaleManSchems';
import { IStock } from './StockSchema';
import { IProduct } from './ProductSchema';
import { BranchStatus, Province } from '@prisma/client';

const citiesToCompare = citiesList.map(city => (city.name))
const areasToCompare = areaCodeList.map(area => (area.name))

type City = (typeof citiesToCompare)[number]
type Area = (typeof areasToCompare)[number]

export interface IBranch
{
    id: string
    address: string
    phoneNo: string
    city: City
    area: Area
    status: BranchStatus
    openingTime: Date
    closingTime: Date
    branchManager?: number
    Manager?: IManager
    stocks?: IStock[]
    salesMen?: ISalesMan[]
    businessId: string
    Business?: IBusiness
    Products?: IProduct[]
    createdBy?: number | null
    updatedBy?: number | null
    province?: Province | null
}

const provinces = [
    Province.AJK,
    Province.BALOCHISTAN,
    Province.GILGIT_BALTISTAN,
    Province.ISLAMABAD,
    Province.KPK,
    Province.PUNJAB,
    Province.SINDH
]

export const AddBranchSchema = z.object({
    id: z.string('Branch Id is required'),
    address: z.string().min(1, 'Address is required'),
    phoneNo: z.string().regex(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/, "Enter Pakistani mobile no."),
    city: z.enum(citiesToCompare, 'Enter Pakistani city name'),
    area: z.enum(areasToCompare, 'Enter proper area name'),
    status: z.enum(BranchStatus, `Status should be "ACTIVE" or "DISABLED"`),
    openingTime: z.date('Opening time is required'),
    closingTime: z.date('Closing time is required'),
    province: z.enum(Province),
    businessId: z.string('Business Id is required'),
    createdBy: z.int('Created by is required')
});

export const EditBranchSchema = z.object({
    id: z.string('Branch Id is required'),
    address: z.string().min(1, 'Address is required'),
    phoneNo: z.string().regex(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/, "Enter Pakistani mobile no."),
    city: z.enum(citiesToCompare, 'Enter Pakistani city name'),
    area: z.enum(areasToCompare, 'Enter proper area name'),
    status: z.enum(BranchStatus, `Status should be "ACTIVE" or "DISABLED"`),
    openingTime: z.date('Opening time is required'),
    closingTime: z.date('Closing time is required'),
    province: z.enum(Province, 'Select province'),
    businessId: z.string('Business Id is required'),
    updatedBy: z.int('Updated by is required')
});