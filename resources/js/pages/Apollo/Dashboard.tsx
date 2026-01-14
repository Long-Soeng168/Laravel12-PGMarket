import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

export default function Dashboard({ provinces, bookings, shop, auth }) {
    const [senderProvince, setSenderProvince] = useState(shop?.province_id || '12');
    const [receiverProvince, setReceiverProvince] = useState(auth?.user?.province_id || '12');
    const [weight, setWeight] = useState(1);
    const [serviceType, setServiceType] = useState('same_day');
    const [fee, setFee] = useState(null);
    const [loading, setLoading] = useState(false);

    const estimateFee = async () => {
        if (!senderProvince || !receiverProvince) return alert('Select sender and receiver provinces!');
        setLoading(true);
        try {
            const res = await axios.post('/apollo/estimate', {
                sender_province_id: senderProvince,
                receiver_province_id: receiverProvince,
                weight,
                service_type: serviceType,
            });
            setFee(res.data.delivery_fee_usd);
        } catch (e) {
            alert('Failed to estimate fee.');
        } finally {
            setLoading(false);
        }
    };

    const createBooking = async () => {
        if (!fee) return alert('Estimate fee first!');
        setLoading(true);

        try {
            const res = await axios.post('/apollo/booking', {
                sender_province_id: senderProvince,
                receiver_province_id: receiverProvince,
                weight,
                service_type: serviceType,
                delivery_fee: fee,
            });

            if (res.data.success) {
                alert(`Booking created: ${res.data.booking_code}`);

                // Refresh Inertia page to fetch updated bookings
                router.reload({ only: ['bookings'] }); // only reload bookings data
            } else {
                alert(`Failed: ${res.data.message}`);
            }
        } catch (e: any) {
            alert('Failed to create booking.');
            console.error(e.response?.data || e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Apollo PG Market</h1>

            {/* CREATE DELIVERY */}
            <div className="space-y-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Shop Info</h2>
                <div>
                    <p>sender_name: {shop?.name}</p>
                    <p>sender_province_id: {shop?.province_id}</p>
                    <p>sender_latitude: {shop?.latitude}</p>
                    <p>sender_longitude: {shop?.longitude}</p>
                    <p>sender_address: {shop?.address}</p>
                    <p>sender_phone: {shop?.phone}</p>
                    <p>service_type: same_day</p>
                    <p>delivery_fee": 3.5, // from api Estimate Delivery Fee</p>
                </div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Receiver Info</h2>
                <div>
                    <p>"client_reference": "00002748", // PGMarket Order ID</p>
                    <p>"fee_payer": "sender"</p>
                    <p>parcel_uom_qty: 1</p>
                    <p>parcel_weight: 77</p>
                    <p>receiver_address: {auth?.user?.address}</p>
                    <p>receiver_name: {auth?.user?.name}</p>
                    <p>receiver_province_id: {auth?.user?.province_id || '---'}</p>
                    <p>receiver_latitude: {auth?.user?.latitude || '---'}</p>
                    <p>receiver_longitude: {auth?.user?.longitude || '---'} </p>
                </div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Create Delivery</h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <select
                        value={senderProvince}
                        onChange={(e) => setSenderProvince(e.target.value)}
                        className="rounded border px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
                    >
                        <option value="">Sender Province</option>
                        {provinces.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={receiverProvince}
                        onChange={(e) => setReceiverProvince(e.target.value)}
                        className="rounded border px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
                    >
                        <option value="">Receiver Province</option>
                        {provinces.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                        type="number"
                        min="1"
                        placeholder="Weight (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="rounded border px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
                    />

                    <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="rounded border px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
                    >
                        <option value="same_day">Same Day</option>
                        <option value="next_day">Next Day</option>
                        <option value="express">Express</option>
                    </select>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={estimateFee}
                        disabled={loading}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Estimating...' : 'Estimate Fee'}
                    </button>

                    {fee && <span className="text-lg font-bold text-green-600">Estimated Fee: ${fee}</span>}

                    <button
                        onClick={createBooking}
                        disabled={!fee}
                        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        Create Booking
                    </button>
                </div>
            </div>

            {/* BOOKINGS LIST */}
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Bookings</h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {bookings.map((b) => (
                        <a
                            key={b.code}
                            href={`/apollo/booking/${b.code}`}
                            className="block flex items-center justify-between rounded-lg bg-white p-4 shadow transition hover:shadow-lg dark:bg-gray-800"
                        >
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{b.code}</p>
                                <p className="text-gray-500 dark:text-gray-300">{b.status}</p>
                            </div>
                            <div>
                                <span
                                    className={`rounded px-2 py-1 text-sm ${
                                        b.status === 'Finished'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                    }`}
                                >
                                    {b.status}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
