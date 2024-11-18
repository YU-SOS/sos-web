import React, { useState, useEffect } from 'react';
import { getRegistrationList, getFetchStatus } from '../../api/adminAPI';
import { useNavigate } from "react-router-dom";
import { Layout, Card, List, Typography, Button, message, Statistic, Row, Col } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState(null);
    const [hospitalRequests, setHospitalRequests] = useState([]);
    const [ambulanceRequests, setAmbulanceRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    // 통계 데이터 불러오기
    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const response = await getFetchStatus();
            setStatistics(response.data);
        } catch (err) {
            console.error(err);
            message.error('통계 데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const hospitalResponse = await getRegistrationList('hospital');
            const ambulanceResponse = await getRegistrationList('ambulance');
            setHospitalRequests(hospitalResponse.data.data.hospitalList || []);
            setAmbulanceRequests(ambulanceResponse.data.data.ambulanceList || []);
        } catch (error) {
            message.error('데이터를 불러오는 중 오류가 발생했습니다.');
        }
    };

    const handleNavigateToRegistrationList = () => {
        navigate('/admin/registration-list');
    };

    // 컴포넌트 마운트 시 데이터 불러오기
    useEffect(() => {
        fetchStatistics();
        fetchData();
    }, []);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#fff', padding: '16px' }}>
                <Title level={3}>관리자 대시보드</Title>
            </Header>
            <Content style={{ padding: '20px' }}>
                <Row gutter={16}>
                    <Col span={16}>
                        <Card title="회원가입 요청 목록">
                            <div style={{ marginBottom: '20px' }}>
                                <Title level={4}>병원</Title>
                                <List
                                    size="small"
                                    bordered
                                    dataSource={hospitalRequests.slice(0, 4)}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={<strong>{item.name}</strong>}
                                            />
                                        </List.Item>
                                    )}
                                />
                                <Button
                                    type="link"
                                    onClick={handleNavigateToRegistrationList}
                                    style={{ paddingLeft: 0 }}
                                >
                                    더보기 →
                                </Button>
                            </div>
                            <div>
                                <Title level={4}>구급대</Title>
                                <List
                                    size="small"
                                    bordered
                                    dataSource={ambulanceRequests.slice(0, 4)}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={<strong>{item.name}</strong>}
                                            />
                                        </List.Item>
                                    )}
                                />
                                <Button
                                    type="link"
                                    onClick={handleNavigateToRegistrationList}
                                    style={{ paddingLeft: 0 }}
                                >
                                    더보기 →
                                </Button>
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Row gutter={[16, 16]}>
                            {[
                                { title: "가입 병원 수", value: statistics?.data.hospitalCount || 0 },
                                { title: "가입 구급대 수", value: statistics?.data.ambulanceCount || 0 },
                                { title: "가입 유저 수", value: statistics?.data.userCount || 0 },
                                { title: "접수 내역", value: statistics?.data.receptionCount || 0 }
                            ].map((stat, index) => (
                                <Col span={24} key={index}>
                                    <Card style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Statistic
                                            title={<span style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>{stat.title}</span>}
                                            value={stat.value}
                                            valueStyle={{ fontSize: '48px', fontWeight: 'bold', textAlign: 'center' }}
                                            style={{ textAlign: 'center' }}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default AdminDashboard;
