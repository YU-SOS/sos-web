import React, { useEffect, useState } from 'react';
import { Layout, List, Card, Typography, message, Row, Col, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { getEmergencyReceptionList } from '../../api/hospitalAPI';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const AcceptedReceptions = () => {
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const navigate = useNavigate();

    const fetchAcceptedReceptions = async () => {
        try {
            const response = await getEmergencyReceptionList();
            const allRequests = response.data?.data?.content || [];
            const filteredRequests = allRequests.filter(
                (request) => request.receptionStatus === 'MOVE' || request.receptionStatus === 'ARRIVAL'
            );
            setAcceptedRequests(filteredRequests);
        } catch (error) {
            console.error(error);
            message.error('수락된 요청 목록을 가져오는 중 오류가 발생했습니다.');
        }
    };

    const handleAcceptedRequestClick = (item) => {
        navigate(`/hospital/reception/${item.id}`);
    };

    useEffect(() => {
        fetchAcceptedReceptions();
    }, []);

    const getGenderLabel = (gender) => {
        if (gender === 'male') return '남자';
        if (gender === 'female') return '여자';
        return '알 수 없음';
    };

    return (
        <Layout style={{ minHeight: '100vh - 64px' }}>
            <Header
                style={{
                    background: '#fff',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Title level={3} style={{ margin: 0 }}>
                    응급실 접수 수락 목록
                </Title>
            </Header>
            <Content
                style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden', // 부모에서 스크롤 방지
                }}
            >
                <Row
                    gutter={[16, 16]}
                    style={{
                        flex: 1, // 남은 공간을 채우도록 설정
                        overflow: 'hidden', // 부모에서 스크롤 방지
                    }}
                >
                    <Col span={24} style={{ height: '100%' }}>
                        <Card
                            title={
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                수락된 요청 목록
                            </span>
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
                                display: 'flex',
                                flexDirection: 'column',
                                maxHeight: '100%', // 카드의 최대 높이를 부모에 맞게 제한
                                overflow: 'hidden', // 내부에서 스크롤 제어
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    maxHeight: 'calc(100vh - 150px)', // 헤더와 카드 제목 등을 제외한 가용 영역 설정
                                    overflowY: 'auto', // 스크롤 활성화
                                    paddingRight: '10px', // 스크롤바 여백
                                }}
                            >
                                <List
                                    dataSource={acceptedRequests}
                                    renderItem={(item) => (
                                        <List.Item
                                            onClick={() => handleAcceptedRequestClick(item)}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: '#f6f8fa',
                                                borderRadius: '10px',
                                                marginBottom: '10px',
                                                padding: '20px',
                                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            <Row
                                                gutter={[16, 16]}
                                                style={{ width: '100%' }}
                                            >
                                                <Col span={4}>
                                                    <img
                                                        src={item.ambulance?.imageUrl}
                                                        alt="구급차"
                                                        style={{
                                                            width: 100,
                                                            height: 100,
                                                            borderRadius: '10px',
                                                            objectFit: 'cover',
                                                            border: '2px solid #d9d9d9',
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={20}>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: '16px',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            {`환자 이름: ${item.patient?.name || '정보 없음'}`}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                color: '#999',
                                                            }}
                                                        >
                                                            접수 번호:{' '}
                                                            <strong>
                                                                {item.number || 'N/A'}
                                                            </strong>
                                                        </Text>
                                                    </div>
                                                    <div
                                                        style={{
                                                            marginTop: '10px',
                                                            color: '#555',
                                                        }}
                                                    >
                                                        <Text>
                                                            나이:{' '}
                                                            {item.patient?.age || 'N/A'}{' '}
                                                            | 성별:{' '}
                                                            {getGenderLabel(
                                                                item.patient?.gender
                                                            )}{' '}
                                                            | 증상:{' '}
                                                            {item.patient?.reference ||
                                                                'N/A'}
                                                        </Text>
                                                    </div>
                                                    <div
                                                        style={{
                                                            marginTop: '10px',
                                                        }}
                                                    >
                                                        <Text>
                                                            전화번호:{' '}
                                                            {item.patient?.phoneNumber ||
                                                                'N/A'}
                                                        </Text>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default AcceptedReceptions;
