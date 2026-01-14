export default function BookingDetail({ booking }) {
    return (
        <div>
            <pre className="rounded bg-gray-100 p-4 dark:bg-gray-800 dark:text-gray-100">{JSON.stringify(booking, null, 2)}</pre>

            <h1 className="font-bold">{booking.parcel_code}</h1>

            <p>Status: {booking.parcel_status_title}</p>
            <p>Sender: {booking.sender_name}</p>
            <p>Receiver: {booking.receiver_name}</p>
            <p>Fee: ${booking.delivery_fee}</p>

            <h2>Tracking</h2>
            <ul>
                {booking.trackings.map((t, i) => (
                    <li key={i}>
                        {t.date} - {t.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}
