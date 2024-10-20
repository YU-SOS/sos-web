import React, { useState, useEffect } from 'react';
import { getEmergencyReceptionList } from '../../api/hospitalAPI';

const EmergencyReceptionPage = () => {
    const [receptionList, setReceptionList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceptionList = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getEmergencyReceptionList();
                setReceptionList(response.data);
            } catch (err) {
                setError('응급실 방문 신청 목록을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchReceptionList();
    }, []);

    return (
        <div>
            <h2>응급실 방문 신청 목록</h2>
            {loading ? (
                <p>로딩 중...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : receptionList.length > 0 ? (
                <ul>
                    {receptionList.map((reception, index) => (
                        <li key={index}>
                            <p>환자 이름: {reception.patientName}</p>
                            <p>접수 시간: {reception.receptionTime}</p>
                            <p>상태: {reception.status}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>신청 목록이 없습니다.</p>
            )}
        </div>
    );
};

export default EmergencyReceptionPage;
