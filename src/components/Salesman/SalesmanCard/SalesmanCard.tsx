'use client';

import React from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { ISalesman } from '@/schemas/SalesmanSchema';
import { Phone, Mail, MapPin, Building2, Pencil } from 'lucide-react';
import Image from 'next/image';

interface SalesmanCardProps
{
    salesman: ISalesman;
    onEdit?: (salesman: ISalesman) => void;
    onView?: (salesman: ISalesman) => void;
}

const SalesmanCard: React.FC<SalesmanCardProps> = ({ salesman, onEdit, onView }) =>
{
    const { User, Branch, Business } = salesman;

    return (
        <Card className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all bg-white group">
            {/* Header Image */}
            <div className="relative h-36 w-full bg-gradient-to-r from-indigo-500 to-blue-500">
                <Image
                    src="/images/profile-bg.jpg"
                    alt="Salesman Background"
                    fill
                    className="object-cover opacity-80"
                />
            </div>

            {/* Content */}
            <div className="relative p-5 -mt-12">
                {/* Profile Avatar */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
                        <Image
                            src="/images/avatar-placeholder.png"
                            alt={User?.name || 'Salesman'}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{User?.name || 'Unnamed Salesman'}</h3>
                        <p className="text-sm text-gray-500">ID: {salesman.id ?? 'N/A'}</p>
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-500" />
                        <span>{User?.phoneNo || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-500" />
                        <span>{User?.email || 'N/A'}</span>
                    </div>
                    {Branch && (
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-500" />
                            <span>{Branch.area || Branch.id}</span>
                        </div>
                    )}
                    {Business && (
                        <div className="flex items-center gap-2">
                            <Building2 size={16} className="text-gray-500" />
                            <span>{Business.name}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-5">
                    {onView && (
                        <Button
                            onClick={() => onView(salesman)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                            View
                        </Button>
                    )}
                    {onEdit && (
                        <Button
                            onClick={() => onEdit(salesman)}
                            className="text-gray-700 border-gray-300 hover:bg-gray-100"
                        >
                            <Pencil size={14} className="mr-1" />
                            Edit
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default SalesmanCard;
