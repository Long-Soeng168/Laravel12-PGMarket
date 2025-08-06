import { UserIconAnimated } from '@/components/animated-icons/User';
import { BottomMobileNav } from '@/components/BottomMobileNav';
import MySelectLanguageSwitch from '@/components/my-select-language-switch';
import ToggleModeSwitch from '@/components/toggle-mode-switch';
import { TopDesktopNav } from '@/components/TopDesktopNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useInitials } from '@/hooks/use-initials';
import useRole from '@/hooks/use-role';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { LogInIcon, Menu, Search, UserPlusIcon } from 'lucide-react';
import CartButton from './cart-button';
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
    const hasRole = useRole();
    const getInitials = useInitials();

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
                    <div className="mx-10 lg:mx-20 hidden max-w-full flex-1 md:block lg:justify-self-center">
                        <SearchInput onSearch={() => {}} />
                    </div>
                    <div className="text-muted-foreground flex items-center gap-4 max-xl:pr-4 text-base font-semibold">
                        <a href="/login" className="hover:text-primary flex items-center gap-1 transition-colors">
                            <LogInIcon size={18} />
                            <span className="underline-offset-4 hover:underline">Login</span>
                        </a>
                        <span className="text-border">|</span>
                        <a href="/register" className="hover:text-primary flex items-center gap-1 transition-colors">
                            <UserPlusIcon size={18} />
                            <span className="underline-offset-4 hover:underline">Register</span>
                        </a>
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
            <div className="bg-background sticky top-0 z-50 border-b border-white shadow-sm backdrop-blur-md">
                <div className="mx-auto flex max-w-screen-xl items-center justify-between py-2 lg:py-4">
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
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden flex-1 lg:flex">
                        <TopDesktopNav />
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
            </div>

            <BottomMobileNav />
        </>
    );
};

export default MyHeader;
