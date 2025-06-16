import { UserIconAnimated } from '@/components/animated-icons/User';
import MySelectLanguageSwitch from '@/components/my-select-language-switch';
import ToggleModeSwitch from '@/components/toggle-mode-switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useInitials } from '@/hooks/use-initials';
import useRole from '@/hooks/use-role';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Search } from 'lucide-react';
import CartButton from './cart-button';
import { MyCategoriesNav } from './my-categories-nav';
import { MySearchProducts } from './my-search-products';

const MyHeader = () => {
    const { application_info, post_counts, item_categories } = usePage().props;
    const { t } = useTranslation();
    const navItems1 = [{ label: t('Products'), href: '/products' }];

    const navItems2 = [
        { label: t('Home'), href: '/' },
        { label: t('Shops'), href: '/shops' },
        { label: t('Privacy'), href: '/privacy' },
        { label: t('About'), href: '/about-us' },
        { label: t('Contact'), href: '/contact-us' },
    ];
    const { auth } = usePage().props;
    const hasRole = useRole();
    const getInitials = useInitials();

    const renderNavLink = ({ label, href }) => {
        const isActive = window.location.pathname === href;

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

    return (
        <>
            {/* Top Bar */}
            <nav className="bg-true-primary text-white">
                <div className="mx-auto flex min-h-10 max-w-screen-xl flex-wrap items-center justify-between py-2 pl-4 lg:pl-0 text-sm">
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
                                <p className="text-xl font-bold font-siemreap-regular">{application_info.name_kh}</p>
                                <p className="text-xl font-bold">{application_info.name}</p>
                            </div>
                        </Link>
                    )}
                    <div className="hidden md:block lg:justify-self-center">
                        <ul className="flex flex-col gap-1 text-white">
                            <li className="flex">
                                <span className="mr-2 font-semibold">Phone:</span>
                                <a className="hover:underline" href={`tel:${application_info?.phone}`}>
                                    {application_info?.phone}
                                </a>
                            </li>
                            <li className="flex">
                                <span className="mr-2 font-semibold">Email:</span>
                                <a className="hover:underline" href={`mailto:${application_info?.email}`}>
                                    {application_info?.email}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="flex items-center gap-4 px-4 font-semibold">
                        <Link prefetch href="/download-app" className="rainbow-button flex items-center gap-2 pr-4 pl-2 text-sm lg:text-lg">
                            <img src="/assets/icons/phone-car.png" alt="Download App" className="aspect-square w-10 object-contain py-1 lg:w-12" />
                            Download App
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Header */}
            <div className="bg-background/50 sticky top-0 z-50 border-b border-white/20 backdrop-blur-md">
                <header>
                    <div className="mx-auto flex max-w-screen-xl items-center justify-between py-2 lg:py-4">
                        {/* Mobile Menu */}
                        <div className="flex items-center">
                            <Sheet>
                                <SheetTrigger>
                                    <Menu className="text-primary mx-4 size-8 lg:hidden" />
                                </SheetTrigger>
                                <SheetContent side="left" className="w-64 bg-gray-100 p-6 shadow-md">
                                    <SheetHeader>
                                        <SheetTitle className="text-2xl font-bold text-gray-700">Menu</SheetTitle>
                                    </SheetHeader>
                                    <ul className="flex flex-col gap-6 font-semibold text-gray-600">
                                        <hr />
                                        {navItems1.map(renderNavLink)}
                                        {navItems2.map(renderNavLink)}
                                    </ul>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden flex-1 lg:flex">
                            <ul className="flex items-center gap-2 font-semibold">
                                {item_categories?.length > 0 && (
                                    <li>
                                        <MyCategoriesNav />
                                    </li>
                                )}
                                {navItems1.map(renderNavLink)}
                                <li className="border-primary/5 bg-primary/50 h-6 border" />
                                {navItems2.map(renderNavLink)}
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-4 px-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button size="icon" variant="ghost" className="text-primary">
                                        <Search className="size-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="top" className="w-full p-6 shadow-md">
                                    <SheetHeader>
                                        <SheetTitle>Search Products</SheetTitle>
                                    </SheetHeader>
                                    <MySearchProducts className="border-primary mx-auto max-w-full" />
                                </SheetContent>
                            </Sheet>
                            <Link prefetch href="/shopping-cart">
                                <CartButton />
                            </Link>
                            {auth?.user ? (
                                <Link prefetch href={hasRole('User') || hasRole('Garage') || hasRole('Shop') ? '/user-dashboard' : '/dashboard'}>
                                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                        <AvatarImage src={`/assets/images/users/thumb/${auth?.user?.image}`} alt={auth?.user?.name} />

                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth?.user?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                            ) : (
                                <Link prefetch href="/login">
                                    <Button size="icon" variant="outline" className="text-primary">
                                        {/* <User2Icon /> */}
                                        <UserIconAnimated stroke="#0471c1" />
                                    </Button>
                                </Link>
                            )}
                            <MySelectLanguageSwitch />
                            <ToggleModeSwitch />
                        </div>
                    </div>
                </header>
            </div>
        </>
    );
};

export default MyHeader;
