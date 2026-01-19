import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressWithValue } from '@/components/ui/progress-with-value';
import useTranslation from '@/hooks/use-translation';
import { useForm, usePage } from '@inertiajs/react';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

export default function UpdateUserAddress() {
    const { t } = useTranslation();
    const { provinces, auth } = usePage<any>().props;

    const { data, setData, post, processing, progress, errors } = useForm({
        name: auth?.user?.name ?? '',
        phone: auth?.user?.phone ?? '',
        address: auth?.user?.address ?? '',
        province_id: auth?.user?.province_id ?? '',
    });

    const submit = () => {
        post('/update_user_info_for_delivery', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t('Updated successfully'));
            },
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button type="button" className="bg-background hover:bg-muted w-full rounded-lg border px-4 py-3 text-left transition">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm">
                            <span className="font-medium">{auth?.user?.name}</span> ({auth?.user?.phone || t('Add phone number')})
                        </span>

                        <span className="text-muted-foreground line-clamp-2 text-xs">{auth?.user?.address || t('Add delivery address')}</span>

                        <span className="text-primary mt-1 text-xs font-medium">{t('Edit delivery info')}</span>
                    </div>
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Update Info</AlertDialogTitle>
                    <AlertDialogDescription />
                </AlertDialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit();
                    }}
                    className="space-y-6 pt-6"
                >
                    {/* Name */}
                    <div>
                        <Label>{t('Name')}</Label>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <Label>{t('Phone')}</Label>
                        <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <Label>{t('Address')}</Label>
                        <Input value={data.address} onChange={(e) => setData('address', e.target.value)} />
                        {errors.address && <p className="text-red-500">{errors.address}</p>}
                    </div>

                    {/* Province – NORMAL SELECT */}
                    <div>
                        <Label>{t('Province')}</Label>
                        <select
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                            value={data.province_id ?? ''}
                            onChange={(e) => setData('province_id', e.target.value ? Number(e.target.value) : '')}
                        >
                            <option value="">{t('Select province')}</option>
                            {provinces.map((province: any) => (
                                <option key={province.id} value={province.id}>
                                    {province.khmer_name} ({province.name})
                                </option>
                            ))}
                        </select>
                        {errors.province_id && <p className="text-red-500">{errors.province_id}</p>}
                    </div>

                    {progress && <ProgressWithValue value={progress.percentage} />}

                    <div className="flex items-center justify-end gap-2">
                        <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                        <Button disabled={processing} type="submit">
                            {processing && <Loader className="mr-2 animate-spin" />}
                            {processing ? t('Updating') : t('Update')}
                        </Button>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
