import React, { useState } from 'react';
import './AdminDashboard.css';
import { getRegistrationList, getRegistrationDetails, approveRegistration } from '../../api/adminAPI';
import {useNavigate} from "react-router-dom"; // API 함수 import

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);  // 초기값을 빈 배열로 설정
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);  // 선택된 항목의 세부정보 저장
    const [showDetail, setShowDetail] = useState(false);  // 모달 보이기/숨기기 상태
    const [selectedType, setSelectedType] = useState('');  // 선택된 타입 저장 (병원 또는 구급차)
    const [statusMessage, setStatusMessage] = useState('');  // 승인/거절 메시지 상태

    const fetchData = async (type) => {
        setLoading(true);
        setError(null);
        setSelectedType(type);
        try {
            const response = await getRegistrationList(type);

            const fetchedData = (type === 'hospital')
                ? (response.data.data.hospitalList || [])
                : (response.data.data.ambulanceList || []);

            setRequests(fetchedData);
        } catch (err) {
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDetails = async (id) => {
        setLoading(true);
        setError(null);

        const role = selectedType === 'hospital' ? 'HOS_GUEST' : 'AMB_GUEST';

        try {
            const response = await getRegistrationDetails(id, role);
            setSelectedRequest(response.data.data);
            setShowDetail(true);
        } catch (err) {
            setError('세부 정보를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id, isApproved) => {
        setLoading(true);
        setError(null);

        const role = selectedType === 'hospital' ? 'HOS_GUEST' : 'AMB_GUEST';

        try {
            const response = await approveRegistration(id, role, isApproved);
            setStatusMessage(isApproved ? '승인되었습니다.' : '거절되었습니다.');
            setShowDetail(false);
            await fetchData(selectedType);
        } catch (err) {
            setError('승인/거절 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        alert('로그아웃 성공!');
        navigate('/login/admin');
    };

    return (
        <div className="dashboard-container">
            <div className="logout-section">
                <button onClick={handleLogout} className="logout-button">로그아웃</button>
            </div>

            <main className="main-content">
                <header className="dashboard-header">
                    <h1>관리자 대시보드</h1>
                </header>

                <section className="button-section">
                    <button onClick={() => fetchData('hospital')} className="data-button">병원 회원가입 신청 목록 불러오기</button>
                    <button onClick={() => fetchData('ambulance')} className="data-button">구급차 회원가입 신청 목록 불러오기</button>
                </section>

                <section className="dashboard-data">
                    {loading && <p>로딩 중...</p>}
                    {error && <p>{error}</p>}
                    {requests.length > 0 ? (
                        <div className="cards-container">
                            {requests.map((request) => (
                                <div
                                    className="card"
                                    key={request.id}
                                    onClick={() => fetchDetails(request.id)}  // 클릭 시 세부 정보 가져오기
                                >
                                    <h3>{request.name}</h3>
                                    <p><strong>ID:</strong> {request.id}</p>
                                    <p><strong>주소:</strong> {request.address}</p>
                                    <p><strong>전화번호:</strong> {request.telephoneNumber || '정보 없음'}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && <p>데이터가 없습니다.</p>
                    )}
                </section>

                {showDetail && selectedRequest && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>세부 정보</h3>

                            {selectedType === 'hospital' ? (
                                <>
                                    <p><strong>ID:</strong> <span>{selectedRequest.id}</span></p>
                                    <p><strong>병원ID:</strong> <span>{selectedRequest.hospitalId}</span></p>
                                    <p><strong>병원명:</strong> <span>{selectedRequest.name}</span></p>
                                    <p><strong>주소:</strong> <span>{selectedRequest.address}</span></p>
                                    <p><strong>위치:</strong> <span>{selectedRequest.location?.longitude}, {selectedRequest.location?.latitude}</span></p>
                                    <p><strong>전화번호:</strong> <span>{selectedRequest.telephoneNumber}</span></p>
                                </>
                            ) : (
                                <>
                                    <p><strong>ID:</strong> <span>{selectedRequest.id}</span></p>
                                    <p><strong>앰뷸런스ID:</strong> <span>{selectedRequest.ambulanceId}</span></p>
                                    <p><strong>이름:</strong> <span>{selectedRequest.name}</span></p>
                                    <p><strong>주소:</strong> <span>{selectedRequest.address}</span></p>
                                    <p><strong>위치:</strong> <span>{selectedRequest.location?.longitude}, {selectedRequest.location?.latitude}</span></p>
                                    <p><strong>전화번호:</strong> <span>{selectedRequest.telephoneNumber}</span></p>
                                </>
                            )}

                            {selectedRequest.imageUrl ? (
                                <div className="image-container">
                                    <p><strong>대표사진:</strong></p>
                                    <img
                                        src={selectedRequest.imageUrl}
                                        alt="대표사진"
                                        className="modal-image"
                                    />
                                </div>
                            ) : (
                                <p>대표사진이 없습니다.</p>
                            )}
                            <button onClick={() => handleApproval(selectedRequest.id, true)} className="approve-button">승인</button>
                            <button onClick={() => handleApproval(selectedRequest.id, false)} className="reject-button">거절</button>
                            <button onClick={() => setShowDetail(false)} className="close-button">닫기</button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default AdminDashboard;
