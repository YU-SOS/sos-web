import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import { FaPaperPlane, FaClipboardList, FaRegStickyNote, FaSignOutAlt } from 'react-icons/fa';
import './HospitalDashboard.css';
import Reqeust from '../hospital/Reqeust'; // Ensure this path is correct
import Reception from '../hospital/Reception'; // Ensure this path is correct
import List from '../hospital/List'; // Ensure this path is correct

const HospitalDashboard = () => {
    const [activeComponent, setActiveComponent] = useState('Reqeust'); // Default to Reqeust view
    const navigate = useNavigate(); // Initialize navigation hook

    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // Remove token from localStorage
        alert('로그아웃 성공!'); // Show logout success alert
        navigate('/login'); // Redirect to login page
    };

    const renderMainContent = () => {
        switch (activeComponent) {
            case 'Reqeust':
                return <Reqeust />;
            case 'Reception':
                return <Reception />;
            case 'List':
                return <List />;
            default:
                return null;
        }
    };

    return (
        <div className="hospital-dashboard">
            <div className="hospital-sidebar">
            <div className="hospital-logo">SOS</div>
                <div className="hospital-image">
                    <img src="" alt="" className="hospital-image-placeholder" />
                </div>
                <div className="hospital-info">
                    <div className="hospital-name">영남대병원</div>
                    <div className="hospital-address">대구광역시 남구 현충로 170 테스트 주소</div>
                </div>


                <div className="hospital-menu">
                    <div 
                        className="hospital-menu-item" 
                        onClick={() => setActiveComponent('Reqeust')}
                    >
                        <FaPaperPlane className="hospital-menu-icon" />
                        <span>응급실 방문 요청</span>
                    </div>
                    <div 
                        className="hospital-menu-item" 
                        onClick={() => setActiveComponent('Reception')}
                    >
                        <FaRegStickyNote  className="hospital-menu-icon" />
                        <span>응급실 접수 목록</span>
                    </div>
                    <div 
                        className="hospital-menu-item" 
                        onClick={() => setActiveComponent('List')}
                    >
                        <FaClipboardList className="hospital-menu-icon" />
                        <span>응급실 목록 화면</span>
                    </div>
                </div>
                <div className="hospital-logout">
                    <button onClick={handleLogout} className="logout-button">
                        <FaSignOutAlt className="hospital-logout-icon" />
                        <span>로그아웃</span>
                    </button>
                </div>
            </div>
            <div className="hospital-main">
                {renderMainContent()} {/* Render the selected component here */}
            </div>
        </div>
    );
};

export default HospitalDashboard;
