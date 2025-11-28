import MyImageGallery from '@/components/my-image-gallery';
import MyNoData from '@/components/my-no-data';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useRole from '@/hooks/use-role';
import useTranslation from '@/hooks/use-translation';
import StatusBadge from '@/pages/nokor-tech/components/StatusBadge';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { ShopHoverCard } from './ShopHoverCard';

const MyTableData = () => {
    const { t } = useTranslation();

    const hasRole = useRole();

    const { tableData } = usePage().props;
    const queryParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname; // Get dynamic path

    const handleSort = (fieldName: string) => {
        if (fieldName === queryParams.get('sortBy')) {
            if (queryParams.get('sortDirection') === 'asc') {
                queryParams.set('sortDirection', 'desc');
            } else {
                queryParams.set('sortDirection', 'asc');
            }
        } else {
            queryParams.set('sortBy', fieldName);
            queryParams.set('sortDirection', 'asc');
        }
        router.get(currentPath + '?' + queryParams?.toString());
    };

    const [selectedImages, setSelectedImages] = useState([]);
    const [isOpenViewImages, setIsOpenViewImages] = useState(false);

    return (
        <>
            <ScrollArea className="w-full rounded-md border">
                <MyImageGallery
                    imagePath="/assets/images/items/"
                    selectedImages={selectedImages}
                    isOpenViewImages={isOpenViewImages}
                    setIsOpenViewImages={setIsOpenViewImages}
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead onClick={() => handleSort('id')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('ID')}
                                </span>
                            </TableHead>

                            <TableHead onClick={() => handleSort('payout_status')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Payout Status')}
                                </span>
                            </TableHead>
                            <TableHead>
                                <span className="flex cursor-pointer items-center">{t('Transaction ID')}</span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('order_id')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Order ID')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('shop_id')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Shop')}
                                </span>
                            </TableHead>

                            <TableHead onClick={() => handleSort('total_amount')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Total Amount')}
                                </span>
                            </TableHead>

                            <TableHead onClick={() => handleSort('website_receive_amount')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('App Fee')}
                                </span>
                            </TableHead>

                            <TableHead onClick={() => handleSort('shipping_receive_amount')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Shipping Fee')}
                                </span>
                            </TableHead>

                            <TableHead onClick={() => handleSort('shop_receive_amount')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Shop Receive Amount')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('shop_bank_account')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Shop Bank Account')}
                                </span>
                            </TableHead>
                            <TableHead onClick={() => handleSort('shipping_bank_account')}>
                                <span className="flex cursor-pointer items-center">
                                    <ArrowUpDown size={16} /> {t('Shipping Bank Account')}
                                </span>
                            </TableHead>

                            <TableHead>{t('Created at')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData?.data?.map((item: any, index: number) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium whitespace-nowrap capitalize">{item.id}</TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    <StatusBadge status={item.payout_status} />
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap">{item.tran_id}</TableCell>
                                <TableCell className="font-medium whitespace-nowrap">
                                    <Link href={`/admin/orders/${item.order_id}`}>
                                        <Badge variant="secondary" className="cursor-pointer underline-offset-2 hover:underline">
                                            {t('Order ID')}: {item.order_id}
                                        </Badge>
                                    </Link>
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    <ShopHoverCard shop={item?.shop} />
                                </TableCell>

                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    {item.currency == 'KHR' ? '៛ ' : '$ '} {item.total_amount}
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    {item.currency == 'KHR' ? '៛ ' : '$ '} {item.website_receive_amount}
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    {item.currency == 'KHR' ? '៛ ' : '$ '} {item.shipping_receive_amount}
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">
                                    {item.currency == 'KHR' ? '៛ ' : '$ '} {item.shop_receive_amount}
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">{item.shop_bank_account}</TableCell>
                                <TableCell className="font-medium whitespace-nowrap capitalize">{item.shipping_bank_account}</TableCell>

                                <TableCell>
                                    <p className='whitespace-nowrap'>
                                        {item.created_at
                                            ? new Date(item.created_at).toLocaleDateString('en-UK', {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                              })
                                            : '---'}
                                    </p>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {tableData?.data?.length < 1 && <MyNoData />}
        </>
    );
};

export default MyTableData;
