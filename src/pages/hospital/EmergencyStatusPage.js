import React, { useState, useEffect } from 'react';
import { updateEmergencyStatus, getEmergencyReceptionList } from '../../api/hospitalAPI';

const EmergencyStatusPage = () => {
    const [emergencyStatus, setEmergencyStatus] = useState('AVAILABLE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEmergencyStatusChange = async (newStatus) => {
        setLoading(true);
        setError(null);
        try {
            await updateEmergencyStatus(newStatus);
            setEmergencyStatus(newStatus);
            alert(`응급실 상태가 ${newStatus === 'AVAILABLE' ? '이용 가능' : '이용 불가'}로 변경되었습니다.`);
        } catch (err) {
            setError('응급실 상태 변경 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>응급실 상태 관리</h2>
            <div className="status-buttons">
                <button
                    className={emergencyStatus === 'AVAILABLE' ? 'active' : ''}
                    onClick={() => handleEmergencyStatusChange('AVAILABLE')}
                >
                    이용 가능
                </button>
                <button
                    className={emergencyStatus === 'FULL' ? 'active' : ''}
                    onClick={() => handleEmergencyStatusChange('FULL')}
                >
                    이용 불가
                </button>
            </div>
            {loading && <p>변경 중...</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default EmergencyStatusPage;
