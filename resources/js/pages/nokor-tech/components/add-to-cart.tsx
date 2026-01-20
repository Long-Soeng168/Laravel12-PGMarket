import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-contexts';
import useTranslation from '@/hooks/use-translation';
import { router } from '@inertiajs/react';
import { CheckIcon, InfoIcon, ShoppingBagIcon, ShoppingCartIcon } from 'lucide-react';
import { useState } from 'react';
import { DifferenceShopDialog } from '../cart/components/DifferenceShopDialog';

function AddToCart({ item }: { item: any }) {
    const { addToCart, cartItems } = useCart();
    const [added, setAdded] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    // console.log(cartItems);

    const handleAddToCart = () => {
        if (cartItems?.length > 0 && item?.shop_id != cartItems[0]?.shop_id) {
            setOpenDialog(true);
            // console.log('shop diff');
        } else {
            // console.log('Shop the same');
            addToCart(item);
            setAdded(true);

            // Reset after 2.5 seconds
            setTimeout(() => {
                setAdded(false);
            }, 2500);
        }
    };
    const handleBuyNow = () => {
        if (cartItems?.length > 0 && item?.shop_id != cartItems[0]?.shop_id) {
            setOpenDialog(true);
            // console.log('shop diff');
        } else {
            // console.log('Shop the same');
            addToCart(item);
            router.get('/shopping-cart');
        }
    };

    const { t } = useTranslation();

    const canBuy = item?.shop?.province_id && item?.weight_kg && item?.shop?.phone;

    return (
        <div>
            <div className="hidden">
                <p>Weight: {item?.weight_kg} kg</p>
                <p>Seller Name: {item?.shop?.name || '---'}</p>
                <p>Seller Province: {item?.shop?.province_id || '---'}</p>
                <p>Seller longitude: {item?.shop?.longitude || '---'}</p>
                <p>Seller latitude: {item?.shop?.latitude || '---'}</p>
                <p>Seller address: {item?.shop?.address || '---'}</p>
                <p>Seller phone: {item?.shop?.phone || '---'}</p>
                <p>service_type: {'same_day'}</p>
                <p>fee_payer: {'sender'}</p>
                <p>----</p>
            </div>
            {!canBuy && (
                <div className="my-4">
                    <div className="flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                        <InfoIcon className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                        <span>
                            {t('Purchase unavailable.')}
                            <a
                                href="/contact-us"
                                className="ml-1 font-semibold underline decoration-amber-500/30 underline-offset-2 hover:text-amber-900 dark:decoration-amber-400/40 dark:hover:text-amber-100"
                            >
                                {t('Contact Support')}
                            </a>
                        </span>
                    </div>
                </div>
            )}
            <div className="flex items-center gap-2">
                <DifferenceShopDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />

                <Button
                    onClick={handleAddToCart}
                    disabled={!canBuy}
                    size="lg"
                    variant={added ? 'default' : 'outline'}
                    className={added ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                >
                    {added ? <CheckIcon className="mr-2" /> : <ShoppingCartIcon className="mr-2" />}
                    {added ? t('Added!') : t('Add To Cart')}
                </Button>

                <Button disabled={!canBuy} onClick={handleBuyNow} size="lg">
                    <ShoppingBagIcon className="mr-2" />
                    {t('Buy Now')}
                </Button>
            </div>
        </div>
    );
}

export default AddToCart;
