import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaClipboardList, FaRegStickyNote, FaSignOutAlt } from 'react-icons/fa';
import './HospitalDashboard.css';
import Reqeust from '../hospital/Reqeust'; 
import Reception from '../hospital/Reception';
import List from '../hospital/List';
import { getHospitalDetails } from '../../api/hospitalAPI'; // Import the API function
import base64 from "base-64";

const HospitalDashboard = () => {
    const [activeComponent, setActiveComponent] = useState('Reqeust'); // Default to Reqeust view
    const [hospitalSub, setHospitalSub] = useState(null); // Store the decoded 'sub' value
    const [hospitalDetails, setHospitalDetails] = useState(null); // Store hospital details
    const navigate = useNavigate(); // Initialize navigation hook

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        
        if (token) {
            try {
                // Extract the payload part of the JWT
                const payload = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));

                // Decode the Base64URL encoded payload
                const decodedPayload = base64.decode(payload);

                // Parse the JSON string into an object
                const payloadObject = JSON.parse(decodedPayload);

                // Extract the 'sub' field and store it
                const sub = payloadObject.sub;
                setHospitalSub(sub);

                console.log('Decoded sub:', sub);
            } catch (error) {
                console.error('Error decoding JWT:', error);
            }
        } else {
            console.error('No token found in localStorage');
        }
    }, []);

    useEffect(() => {
        if (hospitalSub) {
            const fetchHospitalDetails = async () => {
                try {
                    const response = await getHospitalDetails(hospitalSub); // Fetch hospital details
                    setHospitalDetails(response.data); // Store the hospital details in state
                } catch (error) {
                    console.error('Failed to fetch hospital details:', error);
                }
            };

            fetchHospitalDetails();
        }
    }, [hospitalSub]); // Fetch hospital details when hospitalSub is available

    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // Remove token from localStorage
        alert('로그아웃 성공!'); // Show logout success alert
        navigate('/login'); // Redirect to login page
    };

    const renderMainContent = () => {
        switch (activeComponent) {
            case 'Reqeust':
                return <Reqeust hospitalSub={hospitalSub} />; 
            case 'Reception':
                return <Reception hospitalSub={hospitalSub} />;
            case 'List':
                return <List hospitalSub={hospitalSub} />;
            default:
                return null;
        }
    };

    return (
        <div className="hospital-dashboard">
            <div className="hospital-sidebar">
                <div className="hospital-logo">SOS</div>
                <div className="hospital-image">
                    {hospitalDetails && hospitalDetails.imageUrl ? (
                        <img src={hospitalDetails.imageUrl} alt={hospitalDetails.name} />
                    ) : (
                        <div className="hospital-image-placeholder">Image Not Available</div>
                    )}
                </div>
                <div className="hospital-info">
                    <div className="hospital-name">{hospitalDetails ? hospitalDetails.name : 'Loading...'}</div>
                    <div className="hospital-address">{hospitalDetails ? hospitalDetails.address : ''}</div>
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
                        <FaRegStickyNote className="hospital-menu-icon" />
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
                {hospitalSub ? renderMainContent() : <div>Loading...</div>} {/* Show loading while hospitalSub is undefined */}
            </div>
        </div>
    );
};

export default HospitalDashboard;