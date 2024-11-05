import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import getReceptionAPI from '../../api/getReceptionAPI';

const ReceptionDetails = () => {
    const { receptionId } = useParams();
    const [receptionData, setReceptionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceptionDetails = async () => {
            try {
                const data = await getReceptionAPI(receptionId);
                setReceptionData(data.data); // Ensure this matches your API structure
            } catch (err) {
                setError('Failed to fetch reception details.');
            } finally {
                setLoading(false);
            }
        };

        fetchReceptionDetails();
    }, [receptionId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>응급실 접수 상세</h1>
            {receptionData && (
                <div>
                    <p><strong>접수 ID:</strong> {receptionData.id}</p>
                    <p><strong>환자 이름:</strong> {receptionData.patient.name}</p>
                    <p><strong>환자 나이:</strong> {receptionData.patient.age}</p>
                    <p><strong>병원 이름:</strong> {receptionData.hospital.name}</p>
                    <p><strong>응급실 상태:</strong> {receptionData.receptionStatus}</p>
                </div>
            )}
        </div>
    );
};

export default ReceptionDetails;
