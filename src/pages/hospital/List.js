import React, { useEffect, useState } from 'react';
import './List.css'; // Add your styling here
import { getHospitalDetails } from '../../api/hospitalAPI'; // Import the API function

const List = ({ hospitalSub }) => {
    const [hospitalDetails, setHospitalDetails] = useState(null); // Updated to store hospital details
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        if (!hospitalSub) {
            console.error('No hospital identifier (sub) provided');
            return;
        }

        // Fetch hospital data
        const fetchHospitalData = async () => {
            try {
                const response = await getHospitalDetails(hospitalSub); // Fetch hospital details
                setHospitalDetails(response.data); // Store hospital details
            } catch (error) {
                console.error('Error fetching hospital details:', error);
            }
        };

        // Fetch patients data
        const fetchPatients = async () => {
            try {
                const API_URL = process.env.REACT_APP_BASE_URL;
                const response = await fetch(`${API_URL}api/hospital/patients`);
                const data = await response.json();
                setPatients(data.patients || []);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchHospitalData();
        fetchPatients();
    }, [hospitalSub]);

    return (
        <div className="list-container">
            {/* Header Section */}
            <header className="request-header">
                <div className="header-content">
                    응급실 목록 화면 - {hospitalDetails ? hospitalDetails.name : '병원 이름 불러오는 중'}
                    <span className="status-indicator"></span>
                </div>
            </header>
            <hr className="header-line" />

            {/* Patient List Section */}
            <div className="patient-list-container">
                <h2 className="patient-list-title">환자 목록</h2>
                {patients.length > 0 ? (
                    <table className="patient-table">
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>나이</th>
                                <th>성별</th>
                                <th>중증도</th>
                                <th>증상</th>
                                <th>복용약</th>
                                <th>특이사항</th>
                                <th>전화번호</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient, index) => (
                                <tr key={index}>
                                    <td>{patient.name}</td>
                                    <td>{patient.age}</td>
                                    <td>{patient.gender}</td>
                                    <td>
                                        <span
                                            className="severity-icon"
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor:
                                                    patient.status === 'red'
                                                        ? '#ff0000'
                                                        : patient.status === 'white'
                                                        ? '#ffffff'
                                                        : '#808080',
                                                border: '1px solid #ddd',
                                                display: 'inline-block',
                                            }}
                                        ></span>
                                    </td>
                                    <td>{patient.symptoms}</td>
                                    <td>{patient.medication}</td>
                                    <td>{patient.notes}</td>
                                    <td>{patient.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>등록된 환자가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default List;