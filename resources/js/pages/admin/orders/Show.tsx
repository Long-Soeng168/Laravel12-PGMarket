import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

const Show = () => {
    const { order, orderItems } = usePage().props;
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Orders'),
            href: '/admin/orders',
        },
        {
            title: t('View'),
            href: '#',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-full space-y-6 p-4">
                <Card className="overflow-hidden rounded-md shadow-none">
                    <CardContent className="py-6">
                        <h2 className="text-2xl tracking-tight">
                            Order by:{' '}
                            <strong>
                                {order.name} ({order.phone})
                            </strong>
                        </h2>
                        <p className="text-muted-foreground text-lg mt-2">
                            Total: <span className="text-destructive">${order.total}</span>
                        </p>
                    </CardContent>
                </Card>

                <h3 className="text-lg font-medium tracking-tight">Items</h3>

                <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {orderItems.map((orderItem, index) => (
                        <Card key={index} className="gap-0 overflow-hidden rounded-md p-0 shadow-none">
                            <CardHeader className="p-0">
                                <div className="bg-muted aspect-square w-full overflow-hidden border-b">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={`/assets/images/items/thumb/${orderItem.item?.images && orderItem.item?.images[0]?.image}`}
                                        alt=""
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="flex h-full flex-col justify-between p-4">
                                <div>
                                    <h4 className="line-clamp-2 font-semibold tracking-tight">{orderItem.item.name}</h4>

                                    <p className="text-muted-foreground mt-2">Price: ${orderItem.price}</p>
                                    <span className="text-muted-foreground font-medium">Quantity: {orderItem.quantity}</span>
                                    <p>
                                        Total: <span className="text-destructive">${orderItem.total}</span>
                                    </p>
                                </div>

                                <Link href={`/products/${orderItem.item_id}`}>
                                    <Button className="mt-6 shadow-none" size="sm" variant="outline">
                                        View Item <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
};

export default Show;
