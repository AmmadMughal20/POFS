'use client';
import React from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { IBusiness } from '@/schemas/BusinessSchema';
import { CheckCircle, XCircle, Pencil } from 'lucide-react';
import Image from 'next/image';

const BusinessCard: React.FC<IBusiness> = ({
    name,
    type,
    ownerId,
    status,
    description,
    email,
    phone,
    website,
    address,
    city,
    province,
    country,
    logoUrl,
    coverImageUrl,
    establishedYear,
    isVerified,
    createdBy,
    createdAt,
    updatedBy,
    updatedAt,
}) =>
{
    return (
        <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition bg-white border border-gray-100">
            {/* Cover image */}
            {coverImageUrl ? (
                <div className="h-40 w-full overflow-hidden">
                    <Image
                        width={1000}
                        height={1000}
                        src={coverImageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : <></>}

            {/* Body */}
            <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {logoUrl && (
                            <Image
                                width={1000}
                                height={1000}
                                src={logoUrl}
                                alt={`${name} logo`}
                                className="w-12 h-12 rounded-full object-cover border"
                            />
                        )}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
                            <p className="text-sm text-gray-500">{type}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {status === 'ACTIVE' ? (
                            <CheckCircle className="text-green-500 w-5 h-5" />
                        ) : (
                            <XCircle className="text-red-500 w-5 h-5" />
                        )}
                        <span
                            className={`text-sm font-medium ${status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            {status.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Description */}
                {description && (
                    <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-gray-700">
                    {email && (
                        <p>
                            <span className="font-medium">Email:</span> {email}
                        </p>
                    )}
                    {phone && (
                        <p>
                            <span className="font-medium">Phone:</span> {phone}
                        </p>
                    )}
                    {website && (
                        <p>
                            <span className="font-medium">Website:</span>{' '}
                            <a
                                href={website.startsWith('http') ? website : `https://${website}`}
                                target="_blank"
                                className="text-blue-600 hover:underline"
                            >
                                {website}
                            </a>
                        </p>
                    )}
                    {establishedYear && (
                        <p>
                            <span className="font-medium">Established:</span>{' '}
                            {establishedYear}
                        </p>
                    )}
                </div>

                {/* Location */}
                <div className="text-sm text-gray-700 space-y-1">
                    {address && (
                        <p>
                            <span className="font-medium">Address:</span> {address}
                        </p>
                    )}
                    {(city || province || country) && (
                        <p>
                            <span className="font-medium">Location:</span>{' '}
                            {[city, province, country].filter(Boolean).join(', ')}
                        </p>
                    )}
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2 border-t pt-2">
                    {isVerified && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Verified
                        </span>
                    )}
                    <span>Owner ID: {ownerId}</span>
                    <span>Created By: {createdBy ?? '—'}</span>
                    <span>
                        Created At:{' '}
                        {createdAt ? new Date(createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        }) : "_"}
                    </span>
                    <span>Updated By: {updatedBy ?? '—'}</span>
                    <span>
                        Updated At:{' '}
                        {updatedAt ? new Date(updatedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        }) : "_"}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <Button variant="primary">
                        <Pencil size={18} />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default BusinessCard;
