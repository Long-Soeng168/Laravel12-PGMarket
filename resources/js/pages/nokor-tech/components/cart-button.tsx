import { useCart } from '@/contexts/cart-contexts';
import { ShoppingCart } from 'lucide-react';

const CartButton = () => {
    const { cartItems } = useCart();
    return (
        <>
            <button className="hover:bg-secondary relative bg-accent hover:border-primary border-accent flex cursor-pointer items-center justify-start gap-2 rounded-md border px-2 py-2">
                <ShoppingCart className="h-5 w-5" />
                {cartItems?.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                        {cartItems.length}
                    </span>
                )}
            </button>
        </>
    );
};

export default CartButton;
