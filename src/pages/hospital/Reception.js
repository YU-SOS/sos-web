import React, { useEffect, useState } from 'react';
import './Reception.css'; 

const Reception = () => {
    const [hospitalName, setHospitalName] = useState('');
    const [ambulanceInfo, setAmbulanceInfo] = useState({
        name: '',
        address: '',
        phone: '',
    });
    const [patients, setPatients] = useState([]);
    const [messages, setMessages] = useState([]); // State to store messages
    const [currentMessage, setCurrentMessage] = useState(''); // State for input field

    useEffect(() => {
        const fetchHospitalName = async () => {
            try {
                const API_URL = process.env.REACT_APP_BASE_URL;
                const response = await fetch(`${API_URL}/api/auth/user`);
                const data = await response.json();
                setHospitalName(data.hospitalName || '');
            } catch (error) {
                console.error('Error fetching hospital name:', error);
            }
        };
        

        const fetchAmbulanceInfo = async () => {
            try {
                const API_URL = process.env.REACT_APP_BASE_URL; 
                const response = await fetch(`${API_URL}/api/ambulance/info`); 
                const data = await response.json();
                setAmbulanceInfo({
                    name: data.name || 'Unknown Ambulance',
                    address: data.address || 'Unknown Address',
                    phone: data.phone || 'Unknown Phone',
                });
            } catch (error) {
                console.error('Error fetching ambulance info:', error);
            }
        };
        

        const fetchPatients = async () => {
            try {
                const API_URL = process.env.REACT_APP_BASE_URL; 
                const response = await fetch(`${API_URL}/api/hospital/patients`); 
                const data = await response.json();
                setPatients(data.patients || []);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchHospitalName();
        fetchAmbulanceInfo();
        fetchPatients();
    }, []);

    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            setMessages([...messages, { text: currentMessage, timestamp: new Date() }]);
            setCurrentMessage('');
        }
    };

    return (
        <div className="reception-container">
            <header className="request-header">
                <div className="header-content">
                접수 상세 내역 - {hospitalName || '병원 이름 불러오는 중'}
                <span className="status-indicator"></span>
                </div>
            </header>
            <hr className="header-line" />
            <div className="reception-content">
                <div className="reception-info">
                    <div className="hospital-header">
                        <div className="hospital-title">{ambulanceInfo.name}</div>
                        <div className="hospital-subtitle">
                            {ambulanceInfo.address}
                            <br />
                            {ambulanceInfo.phone}
                        </div>
                    </div>
                    <div className="patient-info">
                        <div className="field" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <label style={{ whiteSpace: 'nowrap', marginTop: '5px' }}>
                                <span>선탑</span>
                                <span style={{ display: 'block' }}>구급대원</span>
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <input type="text" />
                                <input type="text" />
                            </div>
                        </div>
                        <div className="field-row">
                            <div className="field">
                                <label>환자 이름</label>
                                <input type="text" />
                            </div>
                            <div className="field small-field">
                                <label>나이</label>
                                <input type="text" />
                            </div>
                            <div className="field small-field">
                                <label>성별</label>
                                <input type="text" />
                            </div>
                            <div className="field small-field">
                                <label>중증도</label>
                                <div
                                    className="severity-icon"
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        backgroundColor:
                                            patients.length > 0 && patients[0].status === 'red'
                                                ? '#ff0000'
                                                : patients.length > 0 && patients[0].status === 'white'
                                                ? '#ffffff'
                                                : '#808080',
                                        border: '1px solid #ddd',
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="field">
                            <label>증상</label>
                            <textarea style={{ height: '150px' }}></textarea>
                        </div>
                        <div className="field">
                            <label>복용약</label>
                            <input type="text" />
                        </div>
                        <div className="field">
                            <label>특이사항</label>
                            <textarea style={{ height: '150px' }}></textarea>
                        </div>
                        <div className="field">
                            <label>전화번호</label>
                            <input type="text" />
                        </div>
                    </div>
                </div>
                <div className="chat-interface">
                    <div className="message-list">
                        {messages.map((message, index) => (
                            <div key={index} className="message">
                                <div className="message-text">{message.text}</div>
                                <div className="message-timestamp">
                                    {message.timestamp.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="message-input-container">
                        <textarea
                            className="message-input"
                            placeholder="메시지 입력하세요..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                        ></textarea>
                        <button className="send-button" onClick={handleSendMessage}>
                            보내기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reception;
