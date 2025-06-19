import { useCart } from '@/contexts/cart-contexts';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const PayPalPayment = () => {
    const { cartItems } = useCart();
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);

    const [amount, setAmount] = useState(subtotal.toFixed(2));
    const { auth } = usePage().props;

    // Load PayPal SDK script dynamically
    useEffect(() => {
        const script = document.createElement('script');
        script.src =
            'https://www.paypal.com/sdk/js?client-id=AaMd6DJgL7L5WBdugs3t5Iv1XYI7oUrH_bSdd7zpfnyZQCXjwEBiHPiVY90gpWvUvH4-76-jBNff45Mq&currency=USD&intent=capture';
        script.addEventListener('load', () => initPayPalButton());
        document.body.appendChild(script);
    }, [amount]);

    const initPayPalButton = () => {
        if (!window.paypal) return;

        window.paypal
            .Buttons({
                createOrder: () => {
                    return fetch(`/api/create/${amount}`).then((res) => {
                        if (!res.ok) throw new Error('Failed to create PayPal order');
                        return res.text(); // Should be orderID
                    });
                },

                onApprove: () => {
                    const orderItems = cartItems.map((item) => {
                        const itemPrice = parseFloat(item.price);
                        const itemDiscount = parseFloat(item.discount || 0);
                        const discountAmount = item.discount_type === 'percentage' ? (itemPrice * itemDiscount) / 100 : itemDiscount;
                        const total = (itemPrice - discountAmount) * item.cartQuantity;

                        return {
                            item_id: item.id,
                            price: itemPrice,
                            discount: itemDiscount,
                            discount_type: item.discount_type,
                            quantity: item.cartQuantity,
                            total,
                        };
                    });

                    const orderPayload = {
                        total: orderItems.reduce((sum, item) => sum + item.total, 0),
                        items: orderItems,
                        name: auth?.user?.name || 'Guest',
                        phone: auth?.user?.phone || '0000',
                        note: 'N/A',
                    };

                    return fetch('/api/complete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(orderPayload),
                    })
                        .then((res) => {
                            if (!res.ok) throw new Error('Failed to complete order');
                            return res.json();
                        })
                        .then(() => {
                            window.location.href = '/checkout_success';
                        })
                        .catch((err) => {
                            console.error(err);
                            alert('Something went wrong: ' + err.message);
                        });
                },

                onCancel: (data) => console.log('Payment cancelled:', data),
                onError: (err) => console.error('PayPal error:', err),
            })
            .render('#payment_options');
    };

    return (
        <div className="lg:w-8/12">
            <div className="mx-auto max-w-full text-center">
                <div className="mb-6 flex items-center gap-2">
                    <span className="text-lg font-medium">$</span>
                    <input
                        type="number"
                        className="w-40 rounded-md border px-3 py-2 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={amount}
                        disabled
                        min="1"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div id="payment_options" className="flex justify-center"></div>
            </div>
        </div>
    );
};

export default PayPalPayment;
