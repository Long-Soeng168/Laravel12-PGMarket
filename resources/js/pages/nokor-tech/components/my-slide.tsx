import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';

// interface SlideItem {
//     id: number;
//     title: string;
//     link: string | null;
//     image: string;
// }

interface MySlideProps {
    slides: any;
    path?: string;
}

const MySlide: React.FC<MySlideProps> = ({ slides, path }) => {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);
    return (
        <Carousel
            plugins={[
                Autoplay({
                    delay: 3000,
                }),
            ]}
            opts={{ align: 'start', loop: false }}
            setApi={setApi}
            className="relative px-2"
        >
            <CarouselContent>
                {slides.map((slide) => (
                    <CarouselItem key={slide.id}>
                        <div>
                            {slide.link ? (
                                <a href={slide.link}>
                                    <img
                                        src={`${path}${slide.image}`}
                                        alt={slide.title}
                                        className="h-auto max-h-[600px] w-full object-cover"
                                        // width={900}
                                        // height={500}
                                    />
                                </a>
                            ) : (
                                <img
                                    src={`${path}${slide.image}`}
                                    alt={slide.title}
                                    className="h-auto max-h-[600px] w-full object-cover"
                                    // width={900}
                                    // height={500}
                                />
                            )}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2 py-2">
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index} className={`size-3 rounded-full ${current === index + 1 ? 'bg-primary' : 'bg-white'}`}></div>
                ))}
            </div>

            <CarouselPrevious className="absolute top-1/2 -left-2 z-10 -translate-y-1/2 transform" />
            <CarouselNext className="absolute top-1/2 -right-2 z-10 -translate-y-1/2 transform" />
        </Carousel>
    );
};

export default MySlide;
