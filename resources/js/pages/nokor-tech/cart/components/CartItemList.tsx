import MyNoData from '@/components/my-no-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/cart-contexts';
import { Minus, Plus, Trash2 } from 'lucide-react';
import ClearCartButton from './ClearCartButton';

const formatCurrency = (value) => `$${parseFloat(value).toFixed(2)}`;

const CartItemList = () => {
    const { cartItems, handleQuantityChange, removeFromCart } = useCart();
    return (
        <div className="max-lg:w-full lg:w-7/12">
            <div className="space-y-4">
                {cartItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden p-0">
                        <CardContent className="p-0">
                            <div className="flex h-full flex-col md:flex-row">
                                {/* Product Image */}
                                <div className="relative h-auto w-full md:w-32">
                                    <img src={item.image} alt={item.name} width={500} height={500} className="h-full w-full object-cover md:w-32" />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 p-6 pb-3">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-muted-foreground text-sm">
                                                {item.color} • {item.size}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => {}}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon" onClick={() => {}}>
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button variant="outline" size="icon" onClick={() => {}}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="text-right">
                                            <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                            {item.originalPrice && (
                                                <div className="text-muted-foreground text-sm line-through">
                                                    ${(item.originalPrice * item.quantity).toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* <div className="overflow-x-auto">
                <div>
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="text-left text-sm font-semibold">
                                <th className="border-b-2 py-4 text-center"></th>
                                <th className="border-b-2 py-4 text-center">Item</th>
                                <th className="border-b-2 py-4 text-center">Qty</th>
                                <th className="border-b-2 py-4 text-center">Subtotal</th>
                                <th className="border-b-2 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems?.map((product) => (
                                <tr key={`product-${product?.id}`} className="hover:bg-muted">
                                    <td className="items-center p-4">
                                            {product?.images?.length > 0 && (
                                                <img
                                                    src={`/assets/images/items/thumb/${product?.images[0]?.image}`}
                                                    alt=""
                                                    className="mr-2 aspect-square w-20 rounded object-cover"
                                                />
                                            )}
                                    </td>
                                    <td className="items-center p-4">
                                        <span>
                                            <p className="line-clamp-2 w-60 lg:w-96">{product?.name}</p>
                                            <p>{formatCurrency(product?.price)}</p>
                                        </span>
                                    </td>

                                    <td className="p-4 text-center text-lg">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button onClick={() => handleQuantityChange(product?.id, -1)} variant="outline" size="icon">
                                                <Minus />
                                            </Button>
                                            {product?.cartQuantity}
                                            <Button onClick={() => handleQuantityChange(product?.id, +1)} variant="outline" size="icon">
                                                <Plus />
                                            </Button>
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
            </div> */}

            {cartItems?.length > 0 ? (
                <div className="mt-6 flex justify-between">
                    <ClearCartButton />
                    <div className="space-x-4">
                        <a href="/checkout">
                            <Button>Checkout</Button>
                        </a>
                    </div>
                </div>
            ) : (
                <MyNoData />
            )}
        </div>
    );
};

export default CartItemList;
