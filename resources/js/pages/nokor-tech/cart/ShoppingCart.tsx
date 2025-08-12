import NokorTechLayout from '../layouts/nokor-tech-layout';
import CartItemList from './components/CartItemList';

export default function ShoppingCart() {
    return (
        <NokorTechLayout>
            <CartItemList />
            <div className="h-20" />
        </NokorTechLayout>
    );
}
