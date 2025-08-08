import { BottomMobileNav } from '@/components/BottomMobileNav';
import MySelectLanguageSwitch from '@/components/my-select-language-switch';
import ToggleModeSwitch from '@/components/toggle-mode-switch';
import { TopDesktopNav } from '@/components/TopDesktopNav';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import CartButton from './cart-button';
import { HomeUserButton } from './home-user-button';
import { MySearchProducts } from './my-search-products';
import SearchInput from './SearchInput';

const MyHeader = () => {
    const { application_info } = usePage().props;

    const { t, currentLocale } = useTranslation();

    const navItems2 = [
        { label: t('Home'), href: '/' },
        { label: t('Products'), href: '/products' },
        { label: t('Shops'), href: '/shops' },
        // { label: t('Privacy'), href: '/privacy' },
        // { label: t('About'), href: '/about-us' },
        // { label: t('Contact'), href: '/contact-us' },
    ];
    const { auth } = usePage().props;

    const renderNavLink = ({ label, href }) => {
        const isActive = typeof window !== 'undefined' ? window.location.pathname === href : false;

        return (
            <Link
                prefetch
                href={href}
                className={`group relative mx-2 cursor-pointer ${isActive ? 'text-primary font-bold' : ''} hover:text-primary`}
            >
                {label}
                <span
                    className={`bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full ${isActive ? 'w-full' : ''}`}
                ></span>
            </Link>
        );
    };

    const stickyRef = useRef(null);
    const [isStuck, setIsStuck] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsStuck(!entry.isIntersecting);
            },
            {
                threshold: 1.0,
            },
        );

        if (stickyRef.current) observer.observe(stickyRef.current);

        return () => {
            if (stickyRef.current) observer.unobserve(stickyRef.current);
        };
    }, []);

    return (
        <>
            {/* Top Bar */}
            <nav className="bg-background text-foreground">
                <div className="mx-auto flex min-h-10 max-w-screen-xl flex-wrap items-center justify-between py-2 pl-4 text-sm lg:pl-0">
                    {application_info?.image && (
                        <Link prefetch href="/" className="flex items-center gap-2">
                            <img
                                width={65}
                                height={65}
                                src={`/assets/images/application_info/thumb/${application_info.image}`}
                                alt={`${application_info.name}'s logo`}
                                className="rounded-md"
                            />
                            <div>
                                <p className="text-xl font-bold">{application_info.name_kh}</p>
                                <p className="text-xl font-bold">{application_info.name}</p>
                            </div>
                        </Link>
                    )}
                    <div className="flex max-w-full flex-1 items-center justify-end lg:justify-self-center">
                        <div className="mx-10 hidden flex-1 md:block lg:mx-20">
                            <SearchInput onSearch={() => {}} />
                        </div>
                        <div className="mx-2 text-purple-600 md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button
                                        className={`mr-1 ml-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:scale-115`}
                                    >
                                        <Search className="size-6" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="top" className="w-full p-6 shadow-md">
                                    <SheetHeader>
                                        <SheetTitle>Search Products</SheetTitle>
                                    </SheetHeader>
                                    <MySearchProducts className="border-primary mx-auto max-w-full" />
                                </SheetContent>
                            </Sheet>
                        </div>
                        <div className="max-md:hidden">
                            <HomeUserButton />
                        </div>
                    </div>

                    {/* <div className="flex items-center gap-4 px-4 font-semibold">
                        <Link prefetch href="/download-app" className="rainbow-button flex items-center gap-2 pr-4 pl-2 text-sm lg:text-lg">
                            <img src="/assets/icons/phone-car.png" alt="Download App" className="aspect-square w-10 object-contain py-1 lg:w-12" />
                            {t('Download App')}
                        </Link>
                    </div> */}
                </div>
            </nav>

            {/* Main Header */}
            <div ref={stickyRef} className="h-1" />
            <div className="bg-background sticky top-0 z-50 border-b border-white shadow-sm backdrop-blur-md">
                <div className="mx-auto flex max-w-screen-xl items-center justify-between py-3 lg:py-4">
                    {/* Mobile Menu */}
                    <div className="flex items-center">
                        <Sheet>
                            <SheetTrigger>
                                <Menu className="text-primary mx-4 size-8 lg:hidden" />
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 bg-gray-100 p-6 shadow-md">
                                <SheetHeader>
                                    <SheetTitle className="text-2xl font-bold text-gray-700">{t('Menu')}</SheetTitle>
                                </SheetHeader>
                                <ul className="flex flex-col gap-6 font-semibold text-gray-600">
                                    <hr />
                                    {navItems2.map(renderNavLink)}
                                </ul>
                                <Separator className="mt-8" />
                                <div className="flex gap-4 min-md:hidden">
                                    <MySelectLanguageSwitch />
                                    <ToggleModeSwitch />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden flex-1 lg:flex">
                        <TopDesktopNav />
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-4">
                        <div className={cn(!isStuck && 'hidden', 'text-purple-600')}>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button
                                        className={`mr-1 ml-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:scale-115`}
                                    >
                                        <Search className="size-6" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="top" className="w-full p-6 shadow-md">
                                    <SheetHeader>
                                        <SheetTitle>Search Products</SheetTitle>
                                    </SheetHeader>
                                    <MySearchProducts className="border-primary mx-auto max-w-full" />
                                </SheetContent>
                            </Sheet>
                        </div>

                        <Link prefetch href="/shopping-cart">
                            <CartButton />
                        </Link>
                        <div className="min-md:hidden">
                            <HomeUserButton />
                        </div>
                        <div className="mr-2 flex gap-4 max-md:hidden">
                            <MySelectLanguageSwitch />
                            <ToggleModeSwitch />
                        </div>
                    </div>
                </div>
            </div>

            <BottomMobileNav />
        </>
    );
};

export default MyHeader;
