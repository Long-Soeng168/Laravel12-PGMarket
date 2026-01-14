import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useRef, useState } from 'react';

const defaultContainerStyle = {
    width: '100%',
    height: '400px',
};

const defaultCenter = {
    lat: 11.5564,
    lng: 104.9282,
};

function LocationPicker({ value, onChange, label = 'Search & Select Location', height = '400px' }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyCc_v9QSM5uPBP08pJ3OMA_a2_BtqHXNMM',
        libraries: ['places'],
    });

    const autocompleteRef = useRef(null);
    const [internalLocation, setInternalLocation] = useState(value?.coordinates || null);
    const [formattedAddress, setFormattedAddress] = useState(value?.formatted_address || '');

    const updateLocation = (coordinates, formatted_address) => {
        setInternalLocation(coordinates);
        setFormattedAddress(formatted_address || '');
        if (onChange) onChange({ coordinates, formatted_address });
    };

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            updateLocation(
                {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                },
                place.formatted_address || '',
            );
        }
    };

    const handleMapClick = useCallback((e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                updateLocation({ lat, lng }, results[0].formatted_address || '');
                console.log(results[0]);
            }
        });
    }, []);

    const handleMarkerDragEnd = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                updateLocation({ lat, lng }, results[0].formatted_address || '');
            }
        });
    };

    if (!isLoaded) return <p>Loading map...</p>;

    return (
        <div className="space-y-4">
            <label className="mb-2 block font-semibold">{label}</label>

            <div>
                <Autocomplete onLoad={(autoC) => (autocompleteRef.current = autoC)} onPlaceChanged={handlePlaceChanged}>
                    <input
                        type="text"
                        placeholder="Search location..."
                        className="border-primary mb-0 w-full rounded-none border border-b-0 p-2 focus:rounded-none"
                    />
                </Autocomplete>

                <div className="border-primary border">
                    <GoogleMap
                        mapContainerStyle={{ ...defaultContainerStyle, height }}
                        center={internalLocation || defaultCenter}
                        zoom={13}
                        onClick={handleMapClick}
                    >
                        {internalLocation && <Marker position={internalLocation} draggable={true} onDragEnd={handleMarkerDragEnd} />}
                    </GoogleMap>
                </div>
            </div>

            {formattedAddress && (
                <p className="text-foreground mt-2">
                    <strong>Location Picked : </strong>
                    {formattedAddress}
                </p>
            )}
        </div>
    );
}

export default LocationPicker;
