import React, { useEffect, useState } from 'react';
import './Reqeust.css';
import { getHospitalDetails, getAmbulanceDetails, getPatientDetails } from '../../api/hospitalAPI';


const Reqeust = ({ hospitalSub, receptionId }) => {
    const [hospitalDetails, setHospitalDetails] = useState(null);
    const [ambulanceInfo, setAmbulanceInfo] = useState({
        name: '',
        address: '',
        phone: '',
    });
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        if (!hospitalSub || !receptionId) {
            console.error('Hospital identifier (sub) or Reception ID is missing.');
            return;
        }

        const fetchHospitalData = async () => {
            try {
                const response = await getHospitalDetails(hospitalSub); // Fetch hospital details
                setHospitalDetails(response.data); // Store hospital details
            } catch (error) {
                console.error('Error fetching hospital details:', error);
            }
        };

        const fetchAmbulanceInfo = async () => {
            try {
                const response = await getAmbulanceDetails(hospitalSub);
                setAmbulanceInfo({
                    name: response.data.name || 'Unknown Ambulance',
                    address: response.data.address || 'Unknown Address',
                    phone: response.data.telephoneNumber || 'Unknown Phone',
                });
            } catch (error) {
                console.error('Error fetching ambulance info:', error);
            }
        };

        const fetchPatients = async () => {
            if (!hospitalSub) {
                console.error('Hospital identifier (hospitalSub) is missing.');
                return;
            }
        
            try {
                const response = await getPatientDetails(hospitalSub); // Use hospitalSub as the hospitalId
                setPatients(response.data || []); // Assuming response.data contains the list of patients
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchHospitalData();
        fetchAmbulanceInfo();
        fetchPatients();
    }, [hospitalSub, receptionId]);

    return (
        <div className="request-container">
            <header className="request-header">
                <div className="header-content">
                    병원 종합 상황 정보 대시보드 - {hospitalDetails ? hospitalDetails.name : '병원 이름 불러오는 중'}
                    <span className="status-indicator"></span>
                </div>
            </header>
            <hr className="header-line" />
            <div className="request-content">
                <div className="request-info">
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
                                                ? '#ff0000' // Red for high severity
                                                : patients.length > 0 && patients[0].status === 'white'
                                                ? '#ffffff' // White for medium severity
                                                : '#808080', // Grey for low severity
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
                    <div className="action-buttons">
                        <button className="accept-button">수락</button>
                        <button className="reject-button">거절</button>
                    </div>
                </div>
                <div className="field patient-list-field">
                    <div className="patient-list">
                        {patients.length > 0 ? (
                            patients.map((patient, index) => (
                                <div
                                    key={index}
                                    className={`patient-block ${patient.status}`}
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        marginBottom: '10px',
                                        backgroundColor:
                                            patient.status === 'red'
                                                ? '#ffcccc'
                                                : patient.status === 'white'
                                                ? '#ffffff'
                                                : '#d3d3d3',
                                    }}
                                >
                                    <div><strong>Name:</strong> {patient.name}</div>
                                    <div><strong>Age:</strong> {patient.age}</div>
                                    <div><strong>Gender:</strong> {patient.gender}</div>
                                </div>
                            ))
                        ) : (
                            <div className="no-patients">환자 데이터가 없습니다</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reqeust;
