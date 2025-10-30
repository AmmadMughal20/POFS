'use client';

import React, { useActionState, useTransition, useState, useMemo, useEffect } from 'react';
import Form from '@/components/ui/Form/Form';
import FormGroup from '@/components/ui/FormGroup/FormGroup';
import Input from '@/components/ui/Input/Input';
import Label from '@/components/ui/Label/Label';
import Button from '@/components/ui/Button/Button';
import Select from '@/components/ui/Select/Select';
import Option from '@/components/ui/Option/Option';
import { OrdersState } from '@/server/OrderFormHandlers';
import { IOrder } from '@/schemas/OrderSchema';
import { IUser } from '@/schemas/UserSchema';
import { IProduct } from '@/schemas/ProductSchema';
import { ICategory } from '@/schemas/CategorySchema';


type OrderFormProps = {
    initialData?: Partial<IOrder>;
    branchId: string;
    businessId: string;
    mode: 'add' | 'edit';
    customers?: IUser[];
    products?: IProduct[];
    categories?: ICategory[];
    onSubmitAction: (prevState: OrdersState, formData: FormData) => Promise<OrdersState>;
    mutate: () => void
};

const OrderForm = ({
    branchId,
    businessId,
    mode,
    customers = [],
    products = [],
    categories = [],
    onSubmitAction,
    mutate
}: OrderFormProps) =>
{

    const initialState = { errors: {}, message: '', success: false, values: {} };
    const [isPending, startTransition] = useTransition();
    const [state, formAction] = useActionState(onSubmitAction, initialState);

    // Step Management
    const [step, setStep] = useState(1);

    // Cart State
    const [cartItems, setCartItems] = useState<{ product: IProduct; qty: number }[]>([]);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState<ICategory | ''>('');

    // Customer State
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | undefined>(undefined);
    const [customerData, setCustomerData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() =>
    {
        if (state.success)
        {
            // 🧹 Reset all form-related state
            setStep(1);
            setCartItems([]);
            setSearch('');
            setFilterCategory('');
            setIsNewCustomer(false);
            setSelectedCustomerId(undefined);
            setCustomerData({ name: '', email: '', phone: '' });
        }
        mutate()
    }, [state.success]);

    const totalAmount = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.product.rate * item.qty, 0),
        [cartItems]
    );

    const handleAddToCart = (product: IProduct) =>
    {
        setCartItems((prev) =>
        {
            const existing = prev.find((p) => p.product.id === product.id);
            if (existing)
            {
                return prev.map((p) =>
                    p.product.id === product.id ? { ...p, qty: p.qty + 1 } : p
                );
            }
            return [...prev, { product, qty: 1 }];
        });
    };

    const handleRemoveFromCart = (productId: number) =>
    {
        setCartItems((prev) => prev.filter((p) => p.product.id !== productId));
    };

    const handleQtyChange = (productId: number, qty: number) =>
    {
        setCartItems((prev) =>
            prev.map((p) => (p.product.id === productId ? { ...p, qty } : p))
        );
    };

    const filteredProducts = products.filter((p) =>
    {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory ? p.categoryId === filterCategory.id : true;
        return matchesSearch && matchesCategory;
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        const formData = new FormData();
        formData.append('branchId', branchId);
        formData.append('businessId', businessId);
        formData.append('totalAmount', Number(totalAmount).toString());
        formData.append('orderItems', JSON.stringify(cartItems.map(c => ({
            productId: c.product.id,
            qty: c.qty,
            amount: c.product.rate
        }))));

        if (isNewCustomer)
        {
            formData.append('customerName', customerData.name);
            formData.append('customerEmail', customerData.email);
            formData.append('customerPhone', customerData.phone);
        } else if (selectedCustomerId)
        {
            formData.append('customerId', selectedCustomerId.toString());
        }

        startTransition(() =>
        {
            formAction(formData);
        });
    };

    return (
        <Form title="Add New Order" onSubmit={handleSubmit}>
            {/* STEP 1: Select Products */}
            {step === 1 ? (
                <>
                    <div className="flex justify-between items-center mb-3">
                        <Input
                            placeholder="Search products..."
                            name='searchProduct'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-1/2"
                        />
                        <select
                            name="category"
                            onChange={(e) =>
                            {
                                const catId = e.target.value
                                const cat = categories.find((item) => (item.id === parseInt(catId)))
                                if (cat) setFilterCategory(cat)
                            }
                            }
                        >
                            <Option value="" title="All Categories" />
                            {categories.map(
                                (cat) =>
                                    cat && <Option key={cat.id} value={cat.id} title={cat.name} />
                            )}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="border p-3 rounded-lg flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-medium">{product.title}</p>
                                    <p className="text-sm text-gray-500">${product.rate}</p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => handleAddToCart(product)}
                                    className="text-sm"
                                >
                                    Add
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Cart Section */}
                    {cartItems.length > 0 && (
                        <div className="border-t pt-4">
                            <h3 className="font-semibold mb-2">Cart</h3>
                            {cartItems.map(({ product, qty }) => (
                                <div
                                    key={product.id}
                                    className="flex justify-between items-center mb-2"
                                >
                                    <span>{product.title}</span>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            type="number"
                                            name='product-qty'
                                            value={qty}
                                            onChange={(e) =>
                                            {
                                                if (product.id)
                                                    handleQtyChange(product.id, parseInt(e.target.value))
                                            }}
                                            className="w-16"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => { if (product.id) handleRemoveFromCart(product.id) }}
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-3 font-semibold">
                                Total: ${totalAmount.toFixed(2)}
                            </div>
                        </div>
                    )}

                    <FormGroup>
                        <Button
                            type="button"
                            disabled={cartItems.length === 0}
                            onClick={() => setStep(2)}
                        >
                            Next → Customer Details
                        </Button>
                    </FormGroup>
                </>
            ) : <></>}

            {/* STEP 2: Customer Details */}
            {step === 2 ? (
                <>
                    <FormGroup>
                        <Label htmlFor="branchId">Branch</Label>
                        <Input name="branchId" readOnly defaultValue={branchId} />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="customerId">Customer</Label>
                        <div className="flex items-center gap-3">
                            <Select
                                name="customerId"
                                disabled={isNewCustomer}
                            // onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
                            >
                                <Option value="" title="Select existing customer" />
                                {customers.map((c) => (
                                    <Option
                                        key={c.id}
                                        value={c.id}
                                        title={`${c.name}${c.email ? ` (${c.email})` : ''}`}
                                    />
                                ))}
                            </Select>

                            <label className="flex items-center gap-1 text-sm">
                                <input
                                    type="checkbox"
                                    checked={isNewCustomer}
                                    onChange={(e) => setIsNewCustomer(e.target.checked)}
                                />
                                Create new
                            </label>
                        </div>
                    </FormGroup>

                    {isNewCustomer && (
                        <>
                            <FormGroup>
                                <Label htmlFor="customerName">Name</Label>
                                <Input
                                    name="customerName"
                                    value={customerData.name}
                                    onChange={(e) =>
                                        setCustomerData({ ...customerData, name: e.target.value })
                                    }
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="customerEmail">Email</Label>
                                <Input
                                    type="email"
                                    name="customerEmail"
                                    value={customerData.email}
                                    onChange={(e) =>
                                        setCustomerData({ ...customerData, email: e.target.value })
                                    }
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="customerPhone">Phone</Label>
                                <Input
                                    type="tel"
                                    name="customerPhone"
                                    value={customerData.phone}
                                    onChange={(e) =>
                                        setCustomerData({ ...customerData, phone: e.target.value })
                                    }
                                />
                            </FormGroup>
                        </>
                    )}

                    <div className="flex justify-between">
                        <Button type="button" onClick={() => setStep(1)}>
                            ← Back
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setStep(3)}
                            disabled={!isNewCustomer && !selectedCustomerId}
                        >
                            Next → Review
                        </Button>
                    </div>
                </>
            ) : <></>}

            {/* STEP 3: Review & Confirm */}
            {step === 3 ? (
                <>
                    <h3 className="font-semibold mb-3">Review Your Order</h3>

                    <div className="mb-4">
                        <h4 className="font-medium">Products</h4>
                        {cartItems.map(({ product, qty }) => (
                            <p key={product.id}>
                                {product.title} × {qty} — ${(product.rate * qty).toFixed(2)}
                            </p>
                        ))}
                        <p className="mt-2 font-bold">Total: ${totalAmount.toFixed(2)}</p>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-medium">Customer</h4>
                        {isNewCustomer ? (
                            <p>
                                {customerData.name} ({customerData.email || 'No email'}){' '}
                                {customerData.phone && ` - ${customerData.phone}`}
                            </p>
                        ) : (
                            customers.find((c) => c.id === selectedCustomerId)?.name
                        )}
                    </div>

                    <div className="flex justify-between">
                        <Button type="button" onClick={() => setStep(2)}>
                            ← Back
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Processing...' : 'Confirm Order'}
                        </Button>
                    </div>
                </>
            ) : <></>}

            {/* Response Messages */}
            {state.message ? (
                <div
                    className={`text-center mt-4 ${state.success ? 'text-success' : 'text-error'
                        }`}
                >
                    {state.message}
                </div>
            ) : <></>}
        </Form>
    );
};

export default OrderForm;
