import React, { useEffect, useState } from 'react';
import { Layout, List, Card, Typography, message, Row, Col, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { getReceptionDetails } from '../../api/hospitalAPI'; // 특정 리셉션 상세 정보 API 호출 함수

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const AcceptedReceptions = () => {
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchAcceptedReceptions = async () => {
        try {
            // 로컬스토리지에서 ID 배열 가져오기
            const storedIds = JSON.parse(localStorage.getItem('acceptedReceptions')) || [];

            // 저장된 ID로 데이터 가져오기
            const responses = await Promise.all(storedIds.map((id) => getReceptionDetails(id)));
            const data = responses.map((response) => response.data);
            setAcceptedRequests(data); // 상태에 저장
        } catch (error) {
            message.error('수락된 요청 목록을 가져오는 중 오류가 발생했습니다.');
        }
    };

    // 특정 요청을 클릭했을 때 동작
    const handleAcceptedRequestClick = (item) => {
        setSelectedRequest(item);
        message.success(`선택된 요청: ${item.patient?.name || '정보 없음'}`);
    };

    useEffect(() => {
        fetchAcceptedReceptions(); // 컴포넌트 마운트 시 데이터 로드
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
            <Content style={{ padding: '20px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>수락된 요청 목록</span>
                                    <Button
                                        type="default"
                                        icon={<ReloadOutlined />}
                                        onClick={fetchAcceptedReceptions}
                                    >
                                        새로고침
                                    </Button>
                                </div>
                            }
                            style={{ height: '100%', display: 'flex', flexDirection: 'column' }} // 높이와 레이아웃 설정
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
