import React, { useState, useEffect } from 'react';
import { getEmergencyList } from '../../api/hospitalAPI'; // API 함수 import

const HospitalDashboard = () => {
    const [emergencyList, setEmergencyList] = useState([]);  // 응급실 목록 저장
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);  // 선택된 카테고리
    const [page, setPage] = useState(0);  // 페이지 번호

    const availableCategories = ['내과', '정형외과', '소아과', '치과', '신경과'];

    // 카테고리 선택 함수
    const handleCategoryChange = (event) => {
        const selectedCategories = Array.from(event.target.selectedOptions, (option) => option.value);
        setCategories(selectedCategories);
    };

    // 페이지 변경 함수
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // 응급실 목록 불러오기
    const fetchEmergencyList = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getEmergencyList(categories, page);
            setEmergencyList(response.data.data);  // 응급실 목록 저장
        } catch (err) {
            setError('응급실 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 카테고리나 페이지 변경 시 데이터 불러오기
    useEffect(() => {
        fetchEmergencyList();
    }, [categories, page]);

    return (
        <div className="hospital-dashboard-container">
            <h2>병원 대시보드</h2>

            {/* 카테고리 선택 */}
            <div className="category-selector">
                <label>카테고리 선택: </label>
                <select multiple={true} onChange={handleCategoryChange}>
                    {availableCategories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* 페이지네이션 */}
            <div className="pagination">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>이전</button>
                <span>Page {page}</span>
                <button onClick={() => handlePageChange(page + 1)}>다음</button>
            </div>

            {/* 응급실 목록 */}
            {loading && <p>로딩 중...</p>}
            {error && <p>{error}</p>}
            {emergencyList.length > 0 ? (
                <ul>
                    {emergencyList.map((emergency) => (
                        <li key={emergency.id}>
                            <p><strong>응급실 이름:</strong> {emergency.name}</p>
                            <p><strong>위치:</strong> {emergency.address}</p>
                            <p><strong>상태:</strong> {emergency.status}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>응급실 목록이 없습니다.</p>
            )}
        </div>
    );
};

export default HospitalDashboard;
