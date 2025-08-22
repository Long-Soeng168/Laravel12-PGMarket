// resources/js/components/PWAInstallPrompt.tsx
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            // stop auto-prompt
            e.preventDefault();
            setDeferredPrompt(e);
            setVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('✅ User accepted install');
        } else {
            console.log('❌ User dismissed install');
        }
        setDeferredPrompt(null);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="flex w-auto flex-col border-t">
            <span className="text-sm font-medium text-white my-2">Install this app for quick access</span>
            <span>
                <Button className="text-primary w-auto bg-white hover:bg-gray-100" variant="secondary" onClick={handleInstall}>
                    <img className="size-6" src="/assets/icons/app-download-icon.png" />
                    Install
                </Button>
            </span>
        </div>
    );
}
