import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Label } from '@/components/ui/label';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils'; // Make sure you have this utility for conditional class names
import { Link } from '@inertiajs/react';
import React from 'react';

interface MyCategoryListProps {
    items: any[]; // Ensure items is an array
}

const MyCategoryList: React.FC<MyCategoryListProps> = ({ items }) => {
    const { t, currentLocale } = useTranslation();

    // State for Carousel API and current slide
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!api) {
            return;
        }
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        const handleSelect = () => {
            setCurrent(api.selectedScrollSnap() + 1);
        };

        api.on('select', handleSelect);

        // Cleanup function to remove the event listener
        return () => {
            api.off('select', handleSelect);
        };
    }, [api]);

    // Function to group items into pairs for two rows
    const groupItemsInPairs = (array: any[]) => {
        const result = [];
        // Change the increment to `i += 3` to group items in threes
        for (let i = 0; i < array.length; i += 3) {
            result.push(array.slice(i, i + 3));
        }
        return result;
    };

    const groupedItems = groupItemsInPairs(items);

    return (
        <Carousel setApi={setApi}>
            {/* Pass setApi to the Carousel component */}
            {/* <Label className="px-2">{t('Categories')}</Label> */}
            <CarouselContent className="p-2">
                {groupedItems?.map((pair, index) => (
                    <CarouselItem key={index} className="basis-1/3 md:basis-1/4 xl:basis-1/6">
                        {/* This div will act as the container for your rows within one carousel slide */}
                        <div className="flex h-full flex-col justify-start gap-4">
                            {pair.map((item, i) => (
                                <Link
                                    prefetch
                                    href={`/products?category_code=${item?.code}`}
                                    key={item?.id}
                                    className="hover:border-primary bg-background border-background flex cursor-pointer flex-col items-center justify-start gap-2 rounded border px-1 py-2 transition-all duration-300 hover:border-solid"
                                >
                                    {item?.image && (
                                        <img
                                            src={`/assets/images/item_categories/thumb/${item?.image}`}
                                            alt={`Category ${item?.name}`}
                                            className="size-18 object-contain"
                                        />
                                    )}
                                    <p className="text-base font-semibold text-center text-gray-600 dark:text-white">
                                        {currentLocale == 'kh' ? item?.name_kh : item?.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            {/* Carousel navigation and pagination */}
            <div className="relative mt-4 flex items-center justify-between gap-2">
                {/* Pagination Dots */}
                <div className="space-x-1">
                    {Array.from({ length: count }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={cn('h-3.5 w-3.5 rounded-full border-2', {
                                'border-primary bg-primary': current === index + 1, // Added bg-primary for filled active dot
                            })}
                        />
                    ))}
                </div>

                <div className="space-x-2">
                    <CarouselPrevious className="static translate-0" />
                    <CarouselNext className="static translate-0" />
                </div>
            </div>
        </Carousel>
    );
};

export default MyCategoryList;
