import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import React from 'react';
import MyProductCard from './ui/my-product-card';

interface MyProductListProps {
    items: any;
}

const MyProductList: React.FC<MyProductListProps> = ({ items }) => {
    return (
        <div>
            <Carousel>
                <CarouselContent className='p-2'>
                    {items?.map((item) => (
                        <CarouselItem key={item.id} className="basis-1/2 md:basis-1/3 xl:basis-1/6">
                            <MyProductCard product={item} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="flex items-center justify-end gap-2 p-2">
                    <CarouselPrevious />
                    <CarouselNext />
                </div>
            </Carousel>
        </div>
    );
};

export default MyProductList;
