import React, { useState, useEffect } from 'react';
import { getEmergencyList, respondToReceptionRequest } from '../../api/hospitalAPI';
import GuestReception from '../../components/GuestReception';

const HospitalDashboard = () => {
    const [emergencyList, setEmergencyList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [selectedReceptionId, setSelectedReceptionId] = useState(null);

    const availableCategories = ['내과', '정형외과', '소아과', '치과', '신경과'];

    const fetchEmergencyList = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getEmergencyList(categories, page);
            setEmergencyList(response.data.data);
        } catch (err) {
            setError('Failed to load emergency list.');
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async (receptionId, isApproved) => {
        try {
            const response = await respondToReceptionRequest(receptionId, isApproved);
            if (response.status === 200) {
                setError(null); // Clear previous errors
                fetchEmergencyList();
            }
        } catch (error) {
            setError('Error responding to reception request.');
        }
    };

    useEffect(() => {
        fetchEmergencyList();
    }, [categories, page]);

    return (
        <div className="hospital-dashboard-container">
            <h2>병원 대시보드</h2>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {emergencyList.length > 0 ? (
                <ul>
                    {emergencyList.map((emergency) => (
                        <li key={emergency.id}>
                            <p><strong>응급실 이름:</strong> {emergency.hospital.name}</p>
                            <p><strong>환자 이름:</strong> {emergency.patient.name}</p>
                            <p><strong>위치:</strong> {emergency.hospital.address}</p>
                            <button 
                                style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}
                                onClick={() => handleResponse(emergency.id, true)}
                            >
                                Accept
                            </button>
                            <button 
                                style={{ backgroundColor: 'red', color: 'white' }} 
                                onClick={() => handleResponse(emergency.id, false)}
                            >
                                Reject
                            </button>
                            <button 
                                style={{ marginLeft: '10px' }}
                                onClick={() => setSelectedReceptionId(emergency.id)}
                            >
                                View Details
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No emergency requests available.</p>
            )}

            {selectedReceptionId && (
                <GuestReception receptionId={selectedReceptionId} />
            )}
        </div>
    );
};

export default HospitalDashboard;
