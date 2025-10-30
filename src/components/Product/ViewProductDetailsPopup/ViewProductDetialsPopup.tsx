'use client';

import { IProduct } from '@/schemas/ProductSchema';

type ViewProductProps = {
    selectedProduct: IProduct;
    onClose?: () => void;
    permissions: string[];
};

const ViewProductDetailsPopup = ({ selectedProduct, onClose, permissions }: ViewProductProps) =>
{
    const totalStock = selectedProduct.stocks?.reduce((sum, s) => sum + s.stockUnits, 0) || 0;

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-2 bg-gray-50 ">
                <h4 className="text-xl font-semibold text-gray-800">Product Details</h4>
            </div>

            {/* Body */}
            <div className="px-6 py-2 max-h-[75vh] overflow-y-auto space-y-4">
                {/* Product Info Section */}
                <section>
                    <h5 className="text-lg font-semibold text-gray-800 mb-3">Product Information</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-700">
                        <Info label="Product ID" value={selectedProduct.id} />
                        <Info label="Title" value={selectedProduct.title} />
                        <Info label="SKU" value={selectedProduct.sku} />
                        <Info label="Rate" value={`Rs. ${selectedProduct.rate.toFixed(2)}`} />
                        <Info label="Category" value={selectedProduct.Category?.name ?? '-'} />
                        <Info label="Business" value={selectedProduct.Business?.name ?? '-'} />
                        <Info label="Branch" value={selectedProduct.Branch?.area ?? '-'} />
                        <Info label="Supplier" value={selectedProduct.Supplier?.name ?? '-'} />
                        <Info label="Created At" value={selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleString() : '-'} />
                        <Info label="Updated At" value={selectedProduct.updatedAt ? new Date(selectedProduct.updatedAt).toLocaleString() : '-'} />
                    </div>

                    {/* Description */}
                    {selectedProduct.description && (
                        <div className="mt-4">
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                {selectedProduct.description}
                            </p>
                        </div>
                    )}
                </section>

                {/* Product Image */}
                <section>
                    <h5 className="text-lg font-semibold text-gray-800 mb-3">Product Image</h5>
                    <div className="relative w-48 h-48 border rounded-lg overflow-hidden">
                        {/* <Image
                                src={`/images/products/${selectedProduct.id ?? 'placeholder'}.jpg`}
                                alt={selectedProduct.title}
                                fill
                                className="object-cover"
                                onError={(e) =>
                                {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/placeholder.png';
                                }}
                            /> */}
                    </div>
                </section>

                {/* Stock Information */}
                <section>
                    <h5 className="text-lg font-semibold text-gray-800 mb-3">Stock Details</h5>
                    {selectedProduct.stocks && selectedProduct.stocks.length > 0 ? (
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="py-2 px-4 border-b">#</th>
                                        <th className="py-2 px-4 border-b">Branch</th>
                                        <th className="py-2 px-4 border-b text-right">Units</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProduct.stocks.map((s, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border-b">{index + 1}</td>
                                            <td className="py-2 px-4 border-b">{selectedProduct.Branch?.area ?? '-'}</td>
                                            <td className="py-2 px-4 border-b text-right">{s.stockUnits}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 font-semibold">
                                        <td colSpan={2} className="py-2 px-4 border-t text-right">
                                            Total:
                                        </td>
                                        <td className="py-2 px-4 border-t text-right">{totalStock}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No stock records found.</p>
                    )}
                </section>

                {/* Discounts Section */}
                {selectedProduct.discounts && selectedProduct.discounts.length > 0 && (
                    <section>
                        <h5 className="text-lg font-semibold text-gray-800 mb-3">Active Discounts</h5>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="py-2 px-4 border-b">#</th>
                                        <th className="py-2 px-4 border-b">Name</th>
                                        <th className="py-2 px-4 border-b">Type</th>
                                        <th className="py-2 px-4 border-b">Value</th>
                                        <th className="py-2 px-4 border-b">Start</th>
                                        <th className="py-2 px-4 border-b">End</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProduct.discounts.map((d, index) => (
                                        <tr key={d.id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border-b">{index + 1}</td>
                                            <td className="py-2 px-4 border-b">{d.name}</td>
                                            <td className="py-2 px-4 border-b capitalize">{d.type}</td>
                                            <td className="py-2 px-4 border-b">{d.value}</td>
                                            <td className="py-2 px-4 border-b">{new Date(d.startDate).toLocaleDateString()}</td>
                                            <td className="py-2 px-4 border-b">{new Date(d.endDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Purchase History */}
                {selectedProduct.Purchases && selectedProduct.Purchases.length > 0 && (
                    <section>
                        <h5 className="text-lg font-semibold text-gray-800 mb-3">Purchase History</h5>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="py-2 px-4 border-b">#</th>
                                        <th className="py-2 px-4 border-b">Quantity</th>
                                        <th className="py-2 px-4 border-b">Cost Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProduct.Purchases.map((p, index) => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border-b">{index + 1}</td>
                                            <td className="py-2 px-4 border-b">{p.quantity}</td>
                                            <td className="py-2 px-4 border-b">Rs. {p.costPrice.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

// Reusable info field component
const Info = ({ label, value }: { label: string; value?: string | number | null }) => (
    <>
        <div className="font-medium text-gray-500">{label}:</div>
        <div>{value ?? '-'}</div>
    </>
);

export default ViewProductDetailsPopup;
