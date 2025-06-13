import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/contexts/cart-contexts';
import useTranslation from '@/hooks/use-translation';
import { type ReactNode } from 'react';
import MyFooter from '../components/my-footer';
import MyHeader from '../components/my-header';

interface NokorTechLayoutProps {
    children: ReactNode;
}

const NokorTechLayout = ({ children }: NokorTechLayoutProps) => {
    const { currentLocale } = useTranslation();
    return (
        <>
            <CartProvider>
                <MyHeader />

                <div className={`${currentLocale == 'kh' ? 'font-siemreap-regular' : 'font-poppins-regular'} min-h-[50vh]`}>{children}</div>
                <Toaster />
                <MyFooter />
            </CartProvider>
        </>
    );
};

export default NokorTechLayout;
