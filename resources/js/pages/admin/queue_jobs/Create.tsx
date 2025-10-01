import MyLoadingAnimationOne from '@/components/MyLoadingAnimationOne';
import { Button } from '@/components/ui/button';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { formatToKhmerDateTime } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Link, router, usePoll } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import { useRef, useState } from 'react';

export default function Create({ job }: { job?: any }) {
    const [loading, setLoading] = useState(false);
    const minVisibleLoadingTime = 1200; // minimum duration in ms
    const loadingStartTime = useRef<number | null>(null);

    usePoll(5000, {
        onStart: () => {
            // Record the time when loading starts
            loadingStartTime.current = Date.now();
            setLoading(true);
        },
        onFinish: () => {
            if (loadingStartTime.current) {
                const elapsed = Date.now() - loadingStartTime.current;
                const remaining = minVisibleLoadingTime - elapsed;
                if (remaining > 0) {
                    // Keep loading visible for the remaining time
                    setTimeout(() => setLoading(false), remaining);
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        },
    });

    const startJob = () => {
        router.post('/queue_job/start');
    };
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Queue Jobs'),
            href: '/queue_jobs',
        },
        {
            title: job.id,
            href: `/queue_jobs/${job.id}`,
        },
    ];
    const hasPermission = usePermission();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4 p-6">
                <h1 className="text-xl font-bold">Queue Job Demo</h1>

                <div className="flex gap-2">
                    <Link href={`/queue_jobs`}>
                        <Button>
                            <ArrowLeftIcon /> Back to Queues Jobs
                        </Button>
                    </Link>
                    {loading && (
                        <span>
                            <MyLoadingAnimationOne />
                        </span>
                    )}
                </div>

                {job && (
                    <div className="relative space-y-2 rounded border p-4">
                        <p>
                            <strong>Job ID:</strong> {job.id}
                        </p>
                        <p>
                            <strong>Type:</strong> {job.job_type}
                        </p>
                        <p>
                            <strong>Status:</strong>
                            {job.status === 'pending' && <span className="text-yellow-600">⏳ Pending</span>}
                            {job.status === 'running' && <span className="text-blue-600">⚡ Running</span>}
                            {job.status === 'completed' && <span className="text-green-600">✅ Completed</span>}
                            {job.status === 'failed' && <span className="text-red-600">❌ Failed</span>}
                        </p>
                        <p>
                            <strong>Created At:</strong> {formatToKhmerDateTime(job.created_at)}
                        </p>
                        <p>
                            <strong>Delay:</strong> {job.delay_second} seconds
                        </p>
                        <p>
                            <strong>Run At:</strong> {formatToKhmerDateTime(job.run_at)}
                        </p>
                        <p>
                            <strong>Completed At:</strong> {formatToKhmerDateTime(job.completed_at)}
                        </p>
                        <p>
                            <strong>Note:</strong> {job.note ?? '-'}
                        </p>
                        <pre className="overflow-auto rounded bg-gray-100 p-2">{JSON.stringify(job.payload, null, 2)}</pre>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
