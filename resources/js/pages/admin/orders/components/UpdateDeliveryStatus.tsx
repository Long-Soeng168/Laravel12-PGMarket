import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import StatusBadge from '@/pages/nokor-tech/components/StatusBadge';
import { useForm, usePage } from '@inertiajs/react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { InfoIcon, LoaderIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const UpdateDeliveryStatus = () => {
    const { order_detail } = usePage().props as any;

    // 🔹 Syncing with your Controller: using 'shipping_status' as the key
    const { post, setData, processing, data } = useForm({
        shipping_status: order_detail?.shipping_status || '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Update internal form state if order_detail changes
    useEffect(() => {
        if (order_detail?.shipping_status) {
            setData('shipping_status', order_detail.shipping_status);
        }
    }, [order_detail]);

    const statuses = ['Booked', 'On Delivery', 'Finished'];

    const handleUpdateStatus = () => {
        // 🔹 URL updated to match the likely route for updateShippingStatus
        post(`/orders/${order_detail.id}/shipping-status`, {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.flash as any;
                if (flash?.success) toast.success(flash.success);
                if (flash?.error) toast.error(flash.error);
                setIsDialogOpen(false);
            },
            onError: (errors) => {
                toast.error('Validation Error', {
                    description: Object.values(errors).join(', '),
                });
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <div className="inline-block cursor-pointer transition-all duration-300 hover:scale-105">
                    {/* Displaying current status from the database */}
                    <StatusBadge status={order_detail?.shipping_status} />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl font-semibold tracking-tight">Update Delivery Status</DialogTitle>
                    {order_detail?.apollo_parcel_code && (
                        <DialogDescription className="relative flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-sm text-blue-800 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-300">
                            <InfoIcon className="size-4 shrink-0" />
                            <span>
                                Using System Delivery? Status is automatically synced with the
                                <strong className="font-semibold text-blue-900 dark:text-blue-100"> Apollo Delivery System</strong>.
                            </span>
                        </DialogDescription>
                    )}
                </DialogHeader>

                <RadioGroup
                    value={data.shipping_status}
                    onValueChange={(value) => setData('shipping_status', value)}
                    className="mt-4 flex flex-wrap gap-4"
                >
                    {statuses.map((status) => (
                        <div key={status} className="hover:bg-accent flex items-center space-x-2 rounded p-2 transition-colors">
                            <RadioGroupItem value={status} id={`status-${status}`} />
                            <Label htmlFor={`status-${status}`} className="flex-1 cursor-pointer">
                                <StatusBadge status={status} />
                            </Label>
                        </div>
                    ))}
                </RadioGroup>

                <div className="mt-6 flex justify-end gap-3">
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleUpdateStatus} disabled={processing} className="min-w-[120px]">
                        {processing ? (
                            <>
                                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateDeliveryStatus;
