import NokorTechLayout from '../layouts/nokor-tech-layout';
import { CancelDialog } from './components/CancelDialog';
import CartItemList from './components/CartItemList';

export default function ShoppingCart() {
    return (
        <NokorTechLayout>
            <CancelDialog />
            <CartItemList />
            <div className="h-20" />
        </NokorTechLayout>
    );
}
