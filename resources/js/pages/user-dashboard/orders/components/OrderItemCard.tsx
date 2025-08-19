import { Card, CardContent } from '@/components/ui/card';

export default function OrderItemCard({ order_item }: { order_item: any }) {
    return (
        <Card className="flex w-full max-w-full flex-row gap-0 overflow-hidden rounded-2xl p-0 shadow-sm transition-shadow hover:shadow-md">
            {/* Product Image */}
            <div className="bg-accent relative w-48 flex-shrink-0">
                <img src={`/assets/images/items/thumb/${order_item?.item?.images[0]?.image}`} alt="Product Image" className="h-full w-full object-cover" />
            </div>

            {/* Product Info */}
            <CardContent className="flex flex-1 flex-col justify-between gap-2 p-4">
                {/* Product Title */}
                <h3 className="text-foreground text-lg font-semibold line-clamp-2">{order_item?.item_name}</h3>

                {/* Order Details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="text-foreground text-end font-medium">{order_item?.quantity}</span>
                    <span className="text-muted-foreground">Unit Price</span>
                    <span className="text-foreground text-end font-medium">${order_item?.price}</span>
                    {order_item?.discount_percent > 0 && (
                        <>
                            <span className="text-muted-foreground">Discount</span>
                            <span className="text-foreground text-end font-medium">%{order_item?.discount_percent}</span>
                        </>
                    )}
                </div>

                {/* Subtotal */}
                <div className="mt-2 flex items-center justify-between text-lg font-semibold">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-primary text-xl font-bold">${order_item?.sub_total}</span>
                </div>
            </CardContent>
        </Card>
    );
}
