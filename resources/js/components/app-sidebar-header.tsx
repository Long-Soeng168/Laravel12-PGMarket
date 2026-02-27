import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, BellOff, HouseIcon, StoreIcon } from 'lucide-react';
import { MyTooltipButton } from './my-tooltip-button';
import SwitchLanguageAdmin from './switch-language-admin';
import { Button } from './ui/button';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { can_switch_language, auth } = usePage().props;

    return (
        <header className="border-sidebar-border/50 sticky top-0 z-10 flex h-auto shrink-0 items-center gap-2 rounded-tl-lg rounded-tr-lg border-b bg-white/5 p-4 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full flex-wrap items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="flex-1 flex-wrap">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                {/* <span className='mr-1'>
                    <ToggleModeSwitch />
                </span> */}
                <div className="flex flex-wrap justify-end w-full md:w-auto items-center gap-2">
                    {auth?.shop?.id && (
                        <MyTooltipButton title="View Shop Profile" size="icon" variant="ghost" className="hover:bg-foreground/5">
                            <Link href={'/shops/' + auth?.shop?.id} prefetch>
                                <StoreIcon />
                            </Link>
                        </MyTooltipButton>
                    )}
                    {auth?.user?.telegram_chat_id ? (
                        <Link href={`/telegram-notify-disable`}>
                            <Button
                                variant="secondary"
                                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 h-9 gap-2 rounded border px-4 transition-all"
                                // onClick={handleDisableNotify} // Add your logic here
                            >
                                <BellOff className="h-4 w-4" />
                                <span className="text-sm font-medium">Disable Notifications</span>
                            </Button>
                        </Link>
                    ) : (
                        <Button asChild className="bg-primary h-9 gap-2 rounded px-4 shadow-sm transition-opacity hover:opacity-90">
                            <a href={`https://t.me/pg_market_telegram_bot?start=${auth?.user?.id}`} target="_blank" rel="noopener noreferrer">
                                <Bell className="h-4 w-4" />
                                <span className="text-sm font-medium">Enable Telegram Alerts</span>
                            </a>
                        </Button>
                    )}
                    <Link href={'/'} prefetch>
                        <Button
                            variant="secondary"
                            className="hover:border-primary h-9 gap-2 rounded border px-4 transition-all"
                            // onClick={handleDisableNotify} // Add your logic here
                        >
                            <HouseIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">Home</span>
                        </Button>
                    </Link>
                    {can_switch_language == true && <SwitchLanguageAdmin />}
                </div>
            </div>
        </header>
    );
}
