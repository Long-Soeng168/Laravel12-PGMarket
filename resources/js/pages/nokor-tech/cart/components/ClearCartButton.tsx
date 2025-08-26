import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-contexts';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

const ClearCartButton = () => {
    const { clearCart } = useCart();
    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const handleClearCart = () => {
        clearCart();
        setIsOpenDialog(false);
    };

    return (
        <AlertDialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-destructive hover:bg-destructive text-destructive hover:border-destructive hover:text-primary-foreground"
                >
                    <Trash2 />
                    Clear Cart
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                    <AlertDialogDescription>This action will remove all items from your cart. You cannot undo this action.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        className="bg-destructive dark:text-foreground text-destructive-foreground hover:bg-destructive/80"
                        onClick={handleClearCart}
                    >
                        Clear Cart
                    </AlertDialogAction>
                    <AlertDialogCancel className="border-foreground">Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ClearCartButton;
