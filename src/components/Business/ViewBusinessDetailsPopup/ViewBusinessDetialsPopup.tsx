'use client';
import React from 'react';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import { IBusiness } from '@/schemas/BusinessSchema';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

type ViewBusinessDetailsPopupProps = {
    selectedBusiness: IBusiness;
    onClose: () => void;
    onAddCategory: () => void;
    onAddSupplier: () => void;
};

const ViewBusinessDetailsPopup: React.FC<ViewBusinessDetailsPopupProps> = ({
    selectedBusiness,
    onClose,
    onAddCategory,
    onAddSupplier
}) =>
{
    return (
        <>
            {/* Header */}
            <div className="p-5 border-b flex items-center justify-between">
                <h4 className="text-xl font-semibold text-gray-800">
                    Business Details
                </h4>
            </div>

            {/* Content */}
            <div className="p-6  space-y-6">
                {/* Header Info */}
                <div className="flex items-center gap-4">
                    {selectedBusiness.logoUrl && (
                        <img
                            src={selectedBusiness.logoUrl}
                            alt="Business Logo"
                            className="w-16 h-16 rounded-full object-cover border"
                        />
                    )}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {selectedBusiness.name}
                        </h2>
                        <p className="text-sm text-gray-500">{selectedBusiness.type}</p>
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                    {selectedBusiness.status === 'ACTIVE' ? (
                        <CheckCircle className="text-green-500 w-5 h-5" />
                    ) : (
                        <XCircle className="text-red-500 w-5 h-5" />
                    )}
                    <span
                        className={`text-sm font-medium ${selectedBusiness.status === 'ACTIVE'
                            ? 'text-green-600'
                            : 'text-red-600'
                            }`}
                    >
                        {selectedBusiness.status}
                    </span>
                    {selectedBusiness.isVerified && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Verified
                        </span>
                    )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
                    <Detail label="Business ID" value={selectedBusiness.id} />
                    <Detail label="Owner Name" value={selectedBusiness.owner?.name} />
                    <Detail label="Email" value={selectedBusiness.email} />
                    <Detail label="Phone" value={selectedBusiness.phone} />
                    <Detail label="Website" value={selectedBusiness.website} />
                    <Detail label="Established Year" value={selectedBusiness.establishedYear} />
                    <Detail label="City" value={selectedBusiness.city} />
                    <Detail label="Province" value={selectedBusiness.province} />
                    <Detail label="Country" value={selectedBusiness.country} />
                    <Detail label="Address" value={selectedBusiness.address} />
                    <Detail label="Created By" value={selectedBusiness.createdByUser?.name} />
                    <Detail label="Updated By" value={selectedBusiness.updatedByUser?.name} />
                    <Detail
                        label="Created At"
                        value={
                            selectedBusiness.createdAt
                                ? new Date(selectedBusiness.createdAt).toLocaleDateString()
                                : '-'
                        }
                    />
                    <Detail
                        label="Updated At"
                        value={
                            selectedBusiness.updatedAt
                                ? new Date(selectedBusiness.updatedAt).toLocaleDateString()
                                : '-'
                        }
                    />
                </div>

                {/* Description */}
                {selectedBusiness.description && (
                    <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">
                            Description
                        </h5>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {selectedBusiness.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-center gap-2">
                <Link href={`/businesses/branches/${selectedBusiness.id}`}>
                    <Button>
                        View Branches
                    </Button>
                </Link>
                <Button onClick={onAddCategory}>
                    Add Category
                </Button>
                <Button onClick={onAddSupplier}>
                    Add Supplier
                </Button>
            </div>

        </>

    );
};

const Detail = ({ label, value }: { label: string; value?: string | number | null }) => (
    <>
        <div className="font-medium text-gray-600">{label}:</div>
        <div className="text-gray-900">{value ?? '-'}</div>
    </>
);

export default ViewBusinessDetailsPopup;
