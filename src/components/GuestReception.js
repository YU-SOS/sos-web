import React, { useEffect, useState } from 'react';
import { getGuestReceptionDetails } from '../api/hospitalAPI';

const GuestReception = ({ receptionId }) => {
    const [guestDetails, setGuestDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGuestDetails = async () => {
            try {
                const data = await getGuestReceptionDetails(receptionId);
                setGuestDetails(data); // Ensure this matches your API structure
            } catch (err) {
                setError("Failed to fetch guest details.");
            }
        };

        fetchGuestDetails();
    }, [receptionId]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!guestDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Guest Reception Details</h2>
            <p>Hospital Name: {guestDetails.data.hospital.name}</p>
            <p>Hospital Address: {guestDetails.data.hospital.address}</p>
            <img src={guestDetails.data.hospital.imageUrl} alt="Hospital" />
        </div>
    );
};

export default GuestReception;
