import { MyTooltipButton } from '@/components/my-tooltip-button';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Loader2, ReceiptTextIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function TransactionDetailDialog({ detail, tranId }: { detail: string; tranId: string }) {
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState(detail);
    const { get } = useForm();
    const handleRecheck = () => {
        setLoading(true);

        get(`/aba/callback?tran_id=` + tranId, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                // backend should return JSON in props if you want to use it directly
                const response = (page.props?.response as any) ?? null;
                if (response) {
                    setTransaction(JSON.stringify(response, null, 2));
                    toast.success('Transaction rechecked successfully');
                } else {
                    toast.warning('Recheck completed but no data returned');
                }
            },
            onError: () => {
                toast.error('Something went wrong while rechecking');
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <MyTooltipButton title={'Transaction Detail'} side="bottom" variant="ghost">
                    <ReceiptTextIcon /> Transaction
                </MyTooltipButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader className="py-0">
                    <DialogTitle className="my-0 flex flex-wrap items-center justify-between py-0">
                        <p>Transaction Detail</p>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <pre className="rounded bg-gray-100 p-4 text-sm whitespace-pre-wrap">{transaction}</pre>

                <DialogFooter>
                    <Button onClick={handleRecheck} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Recheck Transaction
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
