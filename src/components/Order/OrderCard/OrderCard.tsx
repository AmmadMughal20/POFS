'use client';
import React from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { IOrder } from '@/schemas/OrderSchema';
import { CheckCircle, XCircle, Pencil } from 'lucide-react';
import Image from 'next/image';

const OrderCard: React.FC<IOrder> = ({
    id,
    // name,
    // type,
    // ownerId,
    // status,
    // description,
    // email,
    // phone,
    // website,
    // address,
    // city,
    // province,
    // country,
    // logoUrl,
    // coverImageUrl,
    // establishedYear,
    // isVerified,
    createdBy,
    createdAt,
    updatedBy,
    updatedAt,
}) =>
{
    return (
        <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition bg-white border border-gray-100">

        </Card>
    );
};

export default OrderCard;
