import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import React from 'react';

interface MyCategoryListProps {
    items: any[];
}

const MyCategoryList: React.FC<MyCategoryListProps> = ({ items }) => {
    const { t, currentLocale } = useTranslation();

    // Group every 3 items into one "slide"
    const groupItemsInPairs = (array: any[]) => {
        const result = [];
        for (let i = 0; i < array.length; i += 3) {
            result.push(array.slice(i, i + 3));
        }
        return result;
    };

    const groupedItems = groupItemsInPairs(items);

    return (
        <ScrollArea className="w-full overflow-x-auto px-2 whitespace-nowrap">
            <div className="flex w-max gap-4 py-2">
                {groupedItems?.map((group, index) => (
                    <div
                        key={index}
                        className={cn(
                            'flex min-w-[94px] flex-col gap-4',
                            'sm:min-w-[124px]',
                            'md:min-w-[144px]',
                            'lg:min-w-[164px]',
                        )}
                    >
                        {group.map((item) => (
                            <Link
                                prefetch
                                href={`/products?category_code=${item?.code}`}
                                key={item?.id}
                                className="hover:border-primary bg-background border-background flex cursor-pointer flex-col items-center justify-start gap-2 rounded border px-2 py-3 transition-all duration-300 hover:border-solid"
                            >
                                {item?.image && (
                                    <img
                                        src={`/assets/images/item_categories/thumb/${item?.image}`}
                                        alt={`Category ${item?.name}`}
                                        className="size-14 object-contain sm:size-16 md:size-16"
                                    />
                                )}
                                <p className="text-center text-xs font-semibold text-gray-600 sm:text-sm md:text-base dark:text-white">
                                    {currentLocale === 'kh' ? item?.name_kh : item?.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};

export default MyCategoryList;
