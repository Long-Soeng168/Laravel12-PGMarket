import MyLoadingAnimationOne from '@/components/MyLoadingAnimationOne';
import { useCart } from '@/contexts/cart-contexts';
import { router, useForm, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CheckoutButton = () => {
    // console.log(usePage<any>().props);
    const { req_time, shipping, currency, paymentOption, tran_id } = usePage<any>().props;

    const [error, setError] = useState('');

    const { post, progress, processing, transform, errors } = useForm();

    const [isLoading, setIsLoading] = useState(false);

    const { cartItems, clearCart } = useCart();
    const cartItemsSubmit =
        cartItems?.map((item: any) => {
            const itemPrice = parseFloat(item.price);
            const discount_percent = parseFloat(item.discount_percent);
            const discountAmount = (itemPrice * discount_percent) / 100;

            const itemTotal = (itemPrice - (discount_percent ? discountAmount : 0)) * item.cartQuantity;

            return {
                item_id: item.id,
                item_name: item.name,
                price: itemPrice,
                discount_percent: discount_percent,
                quantity: item.cartQuantity,
                sub_total: itemTotal,
            };
        }) || [];
    const total_amount = +cartItemsSubmit.reduce((sum, item) => sum + item.sub_total, 0);

    const handleCheckout = () => {
        if (typeof window === 'undefined') return; // safety no-op on server

        const orderData = {
            shop_id: cartItems[0]?.shop_id || null,
            note: '',
            total_amount: +total_amount + shipping,
            payment_method: paymentOption,
            currency: currency,
            tran_id: tran_id,
            req_time: req_time,
            shipping_price: shipping,
            shipping_lat: 0.0,
            shipping_lng: 0.0,
            items: cartItemsSubmit,
        };

        transform(() => orderData);
        post(`/orders`, {
            preserveScroll: true,
            onSuccess: (page: any) => {
                if (page.props.flash?.success && page.props.flash?.order_id) {
                    clearCart();
                    router.visit(`/user-orders/${page.props.flash?.order_id}`, {
                        replace: true,
                    });
                }
            },
            onError: (e) => {
                toast.error('Error', {
                    description: 'Failed to create.' + JSON.stringify(e, null, 2),
                });
            },
            onFinish: () => {
                setIsLoading(false);
                console.log('Finally!');
            },
        });
    };

    return (
        <div className="container">
            <div className={'text-primary mb-4 text-lg leading-none font-bold'}>
                <p>Choose Payment Method</p>
                <p>Hash String:</p>
            </div>
            <>
                <button
                    id="checkout_button"
                    onClick={async () => {
                        await setIsLoading(true);
                        handleCheckout();
                    }}
                    disabled={isLoading}
                    className="bg-background flex w-full cursor-pointer items-center gap-[10px] rounded-[8px] border border-transparent p-[6px] text-start shadow-[0_1px_5px_rgb(0,0,0,0.1)] transition-all duration-300 hover:scale-105 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:p-[10px] dark:bg-white/20 dark:hover:bg-white/25"
                >
                    {/* <img className="size-[50px] rounded-[4px]" src="/assets/ABA_BANK.svg" alt="" /> */}
                    <div className="flex w-full items-center justify-between">
                        <div className="flex-1">Checkout</div>
                        <span className="bg-accent flex cursor-pointer items-center justify-center rounded-[4px] p-1 dark:bg-white/10">
                            <ChevronRight className="stroke-gray-600 dark:stroke-gray-200" />
                        </span>
                    </div>
                </button>
            </>
            {isLoading && <MyLoadingAnimationOne />}
        </div>
    );
};

export default CheckoutButton;
