import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Stepper,
    StepperContent,
    StepperIndicator,
    StepperItem,
    StepperNav,
    StepperPanel,
    StepperTitle,
    StepperTrigger,
} from '@/components/ui/stepper';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState } from 'react';

const Show = () => {
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Orders'), href: '/user-orders' },
        { title: t('..'), href: '/user-orders/' },
    ];

    const steps = [{ title: 'Order Created' }, { title: 'Payment' }, { title: 'Shipped' }, { title: 'Completed' }];

    const [currentStep, setCurrentStep] = useState(2);

    const getBadge = (stepIndex: number) => {
        if (stepIndex + 1 < currentStep) return { label: 'Completed', color: 'bg-green-500 text-white dark:bg-green-600' };
        if (stepIndex + 1 === currentStep) return { label: 'In Progress', color: 'bg-yellow-500 text-white dark:bg-yellow-600' };
        return { label: 'Pending', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Stepper value={currentStep} className="space-y-8 lg:p-6">
                <StepperNav className="mb-15 gap-3.5">
                    {steps.map((step, index) => {
                        const badge = getBadge(index);
                        return (
                            <StepperItem key={index} step={index + 1} className="relative flex-1">
                                <StepperTrigger className="flex grow flex-col items-start gap-3.5">
                                    <StepperIndicator
                                        className={`h-1 w-full rounded-full ${index + 1 <= currentStep ? '!bg-primary' : '!bg-border'}`}
                                    />
                                    <div className="flex flex-col items-start gap-1">
                                        <div className="text-muted-foreground text-[10px] font-semibold">Step {index + 1}</div>
                                        <StepperTitle className="text-start font-semibold">{step.title}</StepperTitle>
                                        <Badge className={`${badge.color} mt-1`}>{badge.label}</Badge>
                                    </div>
                                </StepperTrigger>
                            </StepperItem>
                        );
                    })}
                </StepperNav>

                <StepperPanel className="text-sm">
                    {steps.map((step, index) => (
                        <StepperContent key={index} value={index + 1} className="flex items-center justify-center">
                            Step {step.title} content
                        </StepperContent>
                    ))}
                </StepperPanel>

                <div className="flex items-center justify-between gap-2.5">
                    <Button variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)} disabled={currentStep === 1}>
                        Previous
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentStep((prev) => prev + 1)} disabled={currentStep === steps.length}>
                        Next
                    </Button>
                </div>
            </Stepper>
        </AppLayout>
    );
};

export default Show;
