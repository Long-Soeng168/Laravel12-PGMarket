import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

const MyProductListHeader = ({ title, image, link = '#' }: { title: string; image?: string; link?: string }) => {
    return (
        <div className="border-primary mx-2 mb-2 flex items-center justify-between border-b pt-6">
            <div className="bg-primary flex items-center gap-2 rounded-md rounded-bl-none p-1">
                {image && (
                    <span className="rounded-sm rounded-bl-none bg-white p-1">
                        <img className="size-8 object-contain" src={image} alt="" />
                    </span>
                )}

                <p className="text-primary-foreground px-2 text-lg font-bold">{title}</p>
            </div>
            <Link href={link}>
                <p className="text-md text-primary flex items-center gap-2 underline-offset-2 transition-all duration-300 hover:translate-x-2 hover:underline">
                    See More <ChevronRight size={24} />
                </p>
            </Link>
        </div>
    );
};

export default MyProductListHeader;
