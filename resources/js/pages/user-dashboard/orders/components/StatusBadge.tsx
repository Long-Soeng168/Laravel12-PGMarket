import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, PackageCheck, RefreshCcw, ShieldCheck, Truck, XCircle } from 'lucide-react';
import { JSX } from 'react';

const statusColors: Record<string, string> = {
    // 🔹 Payment statuses
    APPROVED: 'bg-green-400 text-white dark:bg-green-500',
    'PRE-AUTH': 'bg-blue-400 text-white dark:bg-blue-500',
    PENDING: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    DECLINED: 'bg-red-400 text-white dark:bg-red-500',
    REFUNDED: 'bg-yellow-400 text-white dark:bg-yellow-500',
    CANCELLED: 'bg-gray-400 text-white dark:bg-gray-500',

    // 🔹 Order statuses
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    paid: 'bg-blue-400 text-white dark:bg-blue-500',
    shipped: 'bg-purple-400 text-white dark:bg-purple-500',
    completed: 'bg-green-400 text-white dark:bg-green-500',
    cancelled: 'bg-red-400 text-white dark:bg-red-500',
    refunded: 'bg-yellow-400 text-white dark:bg-yellow-500',
};

const statusIcons: Record<string, JSX.Element> = {
    // 🔹 Payment statuses
    APPROVED: <CheckCircle className="mr-1 size-4" />,
    'PRE-AUTH': <ShieldCheck className="mr-1 size-4" />,
    PENDING: <Clock className="mr-1 size-4" />,
    DECLINED: <XCircle className="mr-1 size-4" />,
    REFUNDED: <RefreshCcw className="mr-1 size-4" />,
    CANCELLED: <XCircle className="mr-1 size-4" />,

    // 🔹 Order statuses
    pending: <Clock className="mr-1 size-4" />,
    paid: <CheckCircle className="mr-1 size-4" />,
    shipped: <Truck className="mr-1 size-4" />,
    completed: <PackageCheck className="mr-1 size-4" />,
    cancelled: <XCircle className="mr-1 size-4" />,
    refunded: <RefreshCcw className="mr-1 size-4" />,
};

const StatusBadge = ({ status }: { status: string }) => {
    return (
        <Badge className={statusColors[status] || 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}>
            {statusIcons[status]}
            {status}
        </Badge>
    );
};

export default StatusBadge;
