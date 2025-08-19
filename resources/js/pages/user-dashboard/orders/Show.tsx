import { Badge } from '@/components/ui/badge';
import { Stepper, StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';

// pick icons from lucide-react
import MyNoData from '@/components/my-no-data';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, Clock, CreditCard, Loader2, ShoppingCart, Truck } from 'lucide-react';
import OrderItemCard from './components/OrderItemCard';
import StatusBadge from '@/pages/nokor-tech/components/StatusBadge';

const Show = () => {
    const { order_detail } = usePage().props;
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Orders'), href: '/user-orders' },
        { title: order_detail?.order_number.split('-').slice(1).join('-'), href: '#' },
    ];

    // attach icons to each step
    const steps = [
        {
            title: 'Order Created',
            icon: ShoppingCart,
        },
        {
            title: 'Payment',
            icon: CreditCard,
        },
        {
            title: 'Shipped',
            sub_title: '(Shipped out)',
            icon: Truck,
        },
        {
            title: 'Completed',
            sub_title: '(Buyer received)',
            icon: CheckCircle2,
        },
    ];

    const [currentStep, setCurrentStep] = useState(2);

    useEffect(() => {
        if (order_detail?.status == 'paid') {
            setCurrentStep(3);
        }
        if (order_detail?.status == 'shipped') {
            setCurrentStep(4);
        }
        if (order_detail?.status == 'completed') {
            setCurrentStep(5);
        }

        if (order_detail?.status == 'refunded') {
            setCurrentStep(0);
        }
        if (order_detail?.status == 'cancelled') {
            setCurrentStep(0);
        }
    }, []);

    const getBadge = (stepIndex: number) => {
        if (stepIndex + 1 < currentStep) {
            return {
                label: 'Completed',
                color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                icon: CheckCircle2,
            };
        }
        if (stepIndex + 1 === currentStep) {
            return {
                label: 'In Progress',
                color: 'bg-yellow-500 text-white dark:bg-yellow-600',
                icon: Loader2,
            };
        }
        return {
            label: 'Pending',
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
            icon: Clock,
        };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Stepper value={currentStep} className="space-y-8 p-4 lg:p-6">
                <StepperNav className="mb-15 gap-4 gap-y-8 grid grid-cols-1 items-start lg:grid-cols-4 border-primary max-lg:pl-6 border-l-2 lg:border-none">
                    {steps.map((step, index) => {
                        const badge = getBadge(index);
                        const Icon = step.icon;
                        return (
                            <StepperItem key={index} step={index + 1} className="relative w-full">
                                <StepperTrigger className="flex grow flex-col items-start gap-3.5">
                                    <StepperIndicator
                                        className={`h-1 lg:w-full rounded-full ${index + 1 <= currentStep ? '!bg-primary' : '!bg-border'}`}
                                    />
                                    <div className="flex flex-col items-start gap-1">
                                        <div className="text-muted-foreground text-[10px] font-semibold">Step {index + 1}</div>
                                        <StepperTitle className="flex items-center gap-2 text-start font-semibold">
                                            <Icon size={16} className="text-muted-foreground" />
                                            {step.title}
                                            <span className="text-muted-foreground text-sm font-normal">{step.sub_title}</span>
                                        </StepperTitle>
                                        <Badge className={`${badge.color} mt-1 flex items-center gap-1`}>
                                            <badge.icon size={12} className="shrink-0" />
                                            {badge.label}
                                        </Badge>
                                    </div>
                                </StepperTrigger>
                            </StepperItem>
                        );
                    })}
                </StepperNav>
                <div>
                    <div className="flex items-center gap-2">
                        Order Status :{' '}
                        <span className="capitalize">
                            <StatusBadge status={order_detail?.status} />
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        Total Amount : <span className="text-xl font-bold capitalize">$ {order_detail?.total_amount}</span>
                    </div>
                </div>

                <StepperPanel className="text-sm">
                    <p className="mb-4 text-lg font-bold text-muted-foreground">Order Items</p>
                    {order_detail?.order_items?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-1 xl:grid-cols-2">
                            {order_detail?.order_items?.map((order_item) => <OrderItemCard key={order_item.id} order_item={order_item} />)}
                        </div>
                    ) : (
                        <MyNoData />
                    )}

                    {/* {steps.map((step, index) => (
                        <StepperContent key={index} value={index + 1} className="flex items-center justify-center">
                            Step {step.title} content
                        </StepperContent>
                    ))} */}
                </StepperPanel>

                {/* <div className="flex items-center justify-between gap-2.5">
                    <Button variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)} disabled={currentStep === 1}>
                        Previous
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentStep((prev) => prev + 1)} disabled={currentStep === steps.length + 1}>
                        Next
                    </Button>
                </div> */}
            </Stepper>
        </AppLayout>
    );
};

export default Show;
