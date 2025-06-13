import MyNoData from '@/components/my-no-data';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-contexts';
import { Link } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import ClearCartButton from './ClearCartButton';

const formatCurrency = (value) => `$${parseFloat(value).toFixed(2)}`;

const CartItemList = () => {
    const { cartItems, handleQuantityChange, removeFromCart } = useCart();
    return (
        <div className="lg:w-8/12">
            <div className="overflow-x-auto">
                <div>
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="text-left text-sm font-semibold">
                                <th className="border-b-2 py-4 text-center">Item</th>
                                <th className="border-b-2 py-4 text-center">Price</th>
                                <th className="border-b-2 py-4 text-center">Qty</th>
                                <th className="border-b-2 py-4 text-center">Subtotal</th>
                                <th className="border-b-2 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems?.map((product) => (
                                <tr key={`product-${product?.id}`} className="hover:bg-muted">
                                    <td className="flex items-center p-4">
                                        {product?.images?.length > 0 && (
                                            <img
                                                src={`/assets/images/items/thumb/${product?.images[0]?.image}`}
                                                alt=""
                                                className="mr-2 aspect-square w-20 rounded object-cover"
                                            />
                                        )}

                                        <p className="line-clamp-2 w-60 lg:w-96">{product?.name}</p>
                                    </td>
                                    <td className="p-4">{formatCurrency(product?.price)}</td>
                                    <td className="p-4 text-center text-lg">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* <Button onClick={() => handleQuantityChange(product?.id, -1)} variant="outline" size="icon">
                                                <Minus />
                                            </Button> */}
                                            {product?.cartQuantity}
                                            {/* <Button onClick={() => handleQuantityChange(product?.id, +1)} variant="outline" size="icon">
                                                <Plus />
                                            </Button> */}
                                        </div>
                                    </td>
                                    <td className="p-4">{formatCurrency(product?.price * product?.cartQuantity)}</td>
                                    <td className="space-x-2 p-4 text-center">
                                        <Button onClick={() => removeFromCart(product)} variant="destructive" size="icon">
                                            <Trash2 size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {cartItems?.length > 0 ? (
                <div className="mt-6 flex justify-between">
                    <ClearCartButton />
                    <div className="space-x-4">
                        <Link href="/checkout" prefetch>
                            <Button>Checkout</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <MyNoData />
            )}
        </div>
    );
};

export default CartItemList;
