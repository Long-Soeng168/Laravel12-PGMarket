import MyStepper from '@/components/my-stepper';

import React from 'react';
import NokorTechLayout from '../layouts/nokor-tech-layout';
import CartItemSummary from './components/CartItemSummary';
import PayPalPayment from './components/PayPalPayment';
const CheckoutPage: React.FC = () => {
    return (
        <NokorTechLayout>
            <div className="mx-auto my-10 max-w-screen-xl px-4">
                <MyStepper steps={['Cart', 'Checkout', 'Complete']} currentStep={1} />
                <div className="flex flex-col gap-12 px-2 lg:flex-row">
                    {/* Shipping Address */}
                    <PayPalPayment />

                    {/* Order Summary */}
                    <CartItemSummary />
                </div>
            </div>
        </NokorTechLayout>
    );
};

export default CheckoutPage;
