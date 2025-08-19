import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function ScrollToTopButton() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const onScroll = () => setShow(window.scrollY > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <Button
            onClick={scrollToTop}
            size="icon"
            className={`fixed right-6 bottom-48 z-50 border p-3 transition-opacity sm:bottom-32 ${show ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
            <ArrowUp />
        </Button>
    );
}
