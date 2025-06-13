import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-contexts';
import { router } from '@inertiajs/react';
import { CheckIcon, ShoppingBagIcon, ShoppingCartIcon } from 'lucide-react';
import { useState } from 'react';

function AddToCart({ item }: { item: any }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(item);
        setAdded(true);

        // Reset after 2.5 seconds
        setTimeout(() => {
            setAdded(false);
        }, 2500);
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={handleAddToCart}
                size="lg"
                variant={added ? 'default' : 'outline'}
                className={added ? 'bg-green-500 text-white hover:bg-green-600' : ''}
            >
                {added ? <CheckIcon className="mr-2" /> : <ShoppingCartIcon className="mr-2" />}
                {added ? 'Added!' : 'Add To Cart'}
            </Button>

            <Button
                onClick={() => {
                    addToCart(item);
                    router.get('/shopping-cart');
                }}
                size="lg"
            >
                <ShoppingBagIcon className="mr-2" />
                Buy Now
            </Button>
        </div>
    );
}

export default AddToCart;
