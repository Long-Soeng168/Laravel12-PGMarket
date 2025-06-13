import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-contexts';
import { ShoppingCart } from 'lucide-react';

const CartButton = () => {
    const { cartItems } = useCart();
    return (
        <>
            <Button size="icon" variant="ghost" className="text-primary relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems?.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                        {cartItems.length}
                    </span>
                )}
            </Button>
        </>
    );
};

export default CartButton;
