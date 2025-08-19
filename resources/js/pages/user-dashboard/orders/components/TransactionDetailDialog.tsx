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
import { CreditCardIcon } from 'lucide-react';

export function TransactionDetailDialog({ detail }: { detail: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <MyTooltipButton title={'Transaction Detail'} side="bottom" variant="ghost">
                    <CreditCardIcon />
                </MyTooltipButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader className='py-0'>
                    <DialogTitle className='flex justify-between items-center flex-wrap my-0 py-0'>
                        <p>Transaction Detail</p>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <pre className="rounded bg-gray-100 p-4 text-sm whitespace-pre-wrap">
                    {(() => {
                        try {
                            const parsed = typeof detail === 'string' && detail.trim() !== '' ? JSON.parse(detail) : detail;
                            return JSON.stringify(parsed, null, 2);
                        } catch (e) {
                            // fallback: just show raw detail
                            return detail;
                        }
                    })()}
                </pre>

                <DialogFooter>
                    {!detail && <Button type="submit">Check Transaction</Button>}
                     
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
