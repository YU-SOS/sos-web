import React, { useEffect, useState } from 'react';
import { Layout, List, Card, Typography, message, Row, Col, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { getEmergencyReceptionList } from '../../api/hospitalAPI';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

const AcceptedReceptions = () => {
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const navigate = useNavigate();

    const fetchAcceptedReceptions = async () => {
        try {
            const response = await getEmergencyReceptionList(); // API 호출
            const allRequests = response.data?.data?.content || []; // API 데이터 접근
            const filteredRequests = allRequests.filter(
                (request) => request.receptionStatus === 'MOVE' && 'ARRIVAL'
            );
            setAcceptedRequests(filteredRequests); // 상태에 저장
        } catch (error) {
            console.error(error);
            message.error('수락된 요청 목록을 가져오는 중 오류가 발생했습니다.');
        }
    };

    const handleAcceptedRequestClick = (item) => {
        navigate(`/hospital/reception/${item.id}`); // 클릭된 항목의 ID를 URL에 포함하여 네비게이트
    };

    // 컴포넌트가 마운트될 때 데이터 로드
    useEffect(() => {
        fetchAcceptedReceptions();
    }, []);

    const getGenderLabel = (gender) => {
        if (gender === 'male') return '남자';
        if (gender === 'female') return '여자';
        return '알 수 없음';
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ background: '#fff', padding: '20px', display: 'flex', alignItems: 'center' }}>
                <Title level={3} style={{ margin: 0 }}>
                    응급실 접수 수락 목록
                </Title>
            </Header>
            <Content style={{ padding: '20px', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
    <Row gutter={[16, 16]} style={{ height: '100%' }}>
        <Col span={24} style={{ height: '100%' }}>
            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>수락된 요청 목록</span>
                        {/*
                        <Button
                            type="default"
                            icon={<ReloadOutlined />}
                            onClick={fetchAcceptedReceptions}
                        >
                            새로고침
                        </Button>*/}
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={fetchAcceptedReceptions}
                        >
                            새로고침
                        </Button>
                    </div>
                }
                style={{
                    height: '100%',
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <List
                    dataSource={acceptedRequests}
                    renderItem={(item) => (
                        <List.Item
                            onClick={() => handleAcceptedRequestClick(item)}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: selectedRequest?.id === item.id ? '#e6f7ff' : 'transparent',
                                borderRadius: '5px',
                                marginBottom: '10px',
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <img
                                        src={item.ambulance?.imageUrl}
                                        alt="구급차"
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            marginLeft: '10px',
                                        }}
                                    />
                                }
                                title={`환자: ${item.patient?.name || '정보 없음'}`}
                                description={`나이: ${item.patient?.age || 'N/A'} | 성별: ${getGenderLabel(item.patient?.gender)}`}
                            />
                        </List.Item>
                    )}
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        minHeight: '600px',
                    }}
                />
            </Card>
        </Col>
    </Row>
</Content>

        </Layout>
    );
};

export default AcceptedReceptions;
