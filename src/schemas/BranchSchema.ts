import z from 'zod'

import citiesList from '@/data/pakistan-cities-250.json';
import areaCodeList from '@/data/areanames.json';

const citiesToCompare = citiesList.map(city => (city.name))
const areasToCompare = areaCodeList.map(area => (area.name))
type City = (typeof citiesToCompare)[number]
type Area = (typeof areasToCompare)[number]

export type Branch = {
    id: string
    phoneNo: string
    address: string
    area: Area,
    city: City,
    openingTime: string
    closingTime: string
}

export const BranchSchema = z.object({
    id: z.string().min(1, 'Branch Id is required'),
    phoneNo: z.string().regex(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/, "Enter Pakistani mobile no."),
    address: z.string().min(1, 'Address is required'),
    area: z.literal(areasToCompare, 'Enter proper area name'),
    city: z.literal(citiesToCompare, 'Enter Pakistani city name'),
    openingTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Opening time must be in HH:mm format"),

    closingTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Closing time must be in HH:mm format"),

}).superRefine((data, ctx) =>
{
    const { openingTime, closingTime } = data;
    if (!openingTime || !closingTime) return;

    const [openH, openM] = openingTime.split(":").map(Number);
    const [closeH, closeM] = closingTime.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    if (closeMinutes <= openMinutes)
    {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["closingTime"],
            message: "Closing time must be after opening time",
        });
    }
});