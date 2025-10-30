'use client';

import React from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { IProduct } from '@/schemas/ProductSchema';
import { CheckCircle, XCircle, Pencil } from 'lucide-react';
import Image from 'next/image';

const ProductCard: React.FC<IProduct> = ({
    id,
    title,
    description,
    sku,
    rate,
    stocks,
    categoryId,
    Category,
    supplierId,
    Supplier,
    createdAt,
    updatedAt,
}) =>
{
    const totalStock = stocks ? stocks[0]?.stockUnits : 0;
    const inStock = totalStock > 0;
    return (
        <Card className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all bg-white group">
            {/* Image */}
            <div className="relative h-40 w-full bg-gray-100">
                {/*                 
                <Image
                    src={`/images/products/${id ?? 'placeholder'}.jpg`}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) =>
                    {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.png';
                    }}
                /> */}
                <div className="absolute top-2 right-2">
                    {inStock ? (
                        <CheckCircle className="text-green-500" size={22} />
                    ) : (
                        <XCircle className="text-red-500" size={22} />
                    )}
                </div>
            </div>

            {/* Details */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
                    <Button
                        className="rounded-full hover:bg-gray-100"
                        onClick={() => console.log('Edit product', id)}
                    >
                        <Pencil size={16} />
                    </Button>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{description}</p>

                <div className="text-sm text-gray-700 space-y-1">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">SKU:</span>
                        <span>{sku}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Rate:</span>
                        <span className="text-green-600 font-semibold">Rs. {rate.toFixed(2)}</span>
                    </div>
                    {Category && (
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Category:</span>
                            <span>{Category.name}</span>
                        </div>
                    )}
                    {Supplier && (
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Supplier:</span>
                            <span>{Supplier.name}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Stock:</span>
                        <span
                            className={`font-semibold ${inStock ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            {inStock ? totalStock : 'Out of Stock'}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;
