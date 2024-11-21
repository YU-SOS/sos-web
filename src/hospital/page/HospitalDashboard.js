import React, { useEffect, useState } from 'react';
import { Layout, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Request from '../page/Request';
import Reception from '../page/Reception';
import List from '../page/List';
import { getHospitalDetails, getHospitalIdFromToken } from '../../api/hospitalAPI';

const { Content } = Layout;
const { Title } = Typography;

const HospitalDashboard = () => {
    const [activeComponent, setActiveComponent] = useState('Request'); // Default view
    const [hospitalDetails, setHospitalDetails] = useState(null); // Store hospital details
    const navigate = useNavigate(); // Navigation hook

    useEffect(() => {
        const fetchHospitalDetails = async () => {
            const hospitalId = getHospitalIdFromToken();
            if (!hospitalId) {
                message.error('병원 ID를 가져오는 데 실패했습니다.');
                return;
            }

            try {
                const response = await getHospitalDetails(); // API call for hospital details
                setHospitalDetails(response.data);
            } catch (error) {
                console.error('Failed to fetch hospital details:', error);
                message.error('병원 정보를 불러오는 중 오류가 발생했습니다.');
            }
        };

        fetchHospitalDetails();
    }, []); // Fetch details on component mount

    const renderMainContent = () => {
        switch (activeComponent) {
            case 'Request':
                return <Request />;
            case 'Reception':
                return <Reception />;
            case 'List':
                return <List />;
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
                <Title level={3}>병원 대시보드</Title>
                {hospitalDetails ? renderMainContent() : <div>Loading...</div>}
            </Content>
        </Layout>
    );
};

export default HospitalDashboard;