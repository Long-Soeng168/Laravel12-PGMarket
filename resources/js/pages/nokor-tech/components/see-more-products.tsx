import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export function SeeMoreProducts({ text = 'See More Products' }: { text?: string }) {
    return (
        <Link href={`/products`} prefetch className="group relative flex cursor-pointer items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-foreground bg-background px-16 py-3 text-base font-semibold text-foreground transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] hover:border-transparent hover:text-white active:scale-[0.95]">
            {/* Left arrow (arr-2) */}
            <ArrowRight className="absolute left-[-25%] z-[9] h-4 w-4 fill-none stroke-foreground transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4 group-hover:stroke-white" />

            {/* Text */}
            <span className="relative z-[1] -translate-x-3 transition-all duration-[800ms] ease-out group-hover:translate-x-3">{text}</span>

            {/* Circle */}
            <span className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[#111111] dark:bg-true-primary opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[220px] group-hover:w-[440px] group-hover:opacity-100"></span>

            {/* Right arrow (arr-1) */}
            <ArrowRight className="absolute right-4 z-[9] h-4 w-4 fill-none stroke-foreground transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%] group-hover:stroke-white" />
        </Link>
    );
}
