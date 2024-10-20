import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './HospitalDashboard.css';  // 스타일을 위한 CSS 파일

const HospitalDashboard = () => {
    return (
        <div className="dashboard-layout">
            {/* 사이드바 */}
            <aside className="sidebar">
                <div className="profile-section">
                    <img src="https://via.placeholder.com/100" alt="Profile" className="profile-image" />
                    <h3>병원 이름</h3>
                </div>

                <div className="sidebar-menu">
                    <Link to="info" className="menu-item">병원 정보 관리</Link>
                    <Link to="emergency-status" className="menu-item">응급실 상태 관리</Link>
                    <Link to="emergency-reception" className="menu-item">응급실 신청 목록</Link>
                </div>

                <div className="logout-section">
                    <button className="logout-button">로그아웃</button>
                </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="dashboard-main">
                <Outlet />  {/* 서브 라우팅된 페이지들이 여기 렌더링됨 */}
            </main>
        </div>
    );
};

export default HospitalDashboard;
