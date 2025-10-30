'use client';

import { ISalesman } from '@/schemas/SalesmanSchema';
import { X } from 'lucide-react';

type ViewSalesmanProps = {
    selectedSalesman: ISalesman;
    onClose: () => void;
    permissions: string[];
};

const ViewSalesmanDetailsPopup = ({ selectedSalesman, onClose }: ViewSalesmanProps) =>
{
    return (
        <div className="bg-white rounded-xl shadow-xl max-w-3xl mx-auto border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
                <h5 className="text-xl font-semibold text-gray-800">Salesman Details</h5>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
                {/* Basic Info */}
                <section>
                    <h6 className="text-lg font-semibold text-gray-800 mb-3">
                        Salesman Information
                    </h6>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm text-gray-700">
                        <Info label="Salesman ID" value={selectedSalesman.id} />
                        <Info label="Name" value={selectedSalesman.User?.name ?? '-'} />
                        <Info label="Phone" value={selectedSalesman.User?.phoneNo ?? '-'} />
                        <Info label="Email" value={selectedSalesman.User?.email ?? '-'} />
                        <Info label="Business" value={selectedSalesman.Business?.name ?? '-'} />
                        <Info label="Branch" value={selectedSalesman.Branch?.area ?? '-'} />
                        <Info
                            label="Created At"
                            value={
                                selectedSalesman.User?.createdAt
                                    ? new Date(selectedSalesman.User.createdAt).toLocaleString()
                                    : '-'
                            }
                        />
                        <Info
                            label="Updated At"
                            value={
                                selectedSalesman.User?.updatedAt
                                    ? new Date(selectedSalesman.User.updatedAt).toLocaleString()
                                    : '-'
                            }
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

// ✅ Clean & consistent label/value layout
const Info = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex flex-col">
        <span className="text-gray-500 font-medium mb-0.5">{label}</span>
        <span className="text-gray-800 break-words">{value ?? '-'}</span>
    </div>
);

export default ViewSalesmanDetailsPopup;
