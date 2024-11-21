import React, { useEffect, useState } from 'react';
import { Card, Input, Typography, Row, Col, Button, List as AntList, message, Space, Tag } from 'antd';
import { getHospitalDetails } from '../../api/hospitalAPI';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Reception = ({ hospitalSub }) => {
    const [hospitalDetails, setHospitalDetails] = useState(null);
    const [ambulanceInfo, setAmbulanceInfo] = useState({
        name: '',
        address: '',
        phone: '',
    });
    const [patients, setPatients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');

    useEffect(() => {
        if (!hospitalSub) {
            console.error('No hospital identifier (sub) provided');
            return;
        }

        const fetchHospitalData = async () => {
            try {
                const response = await getHospitalDetails(hospitalSub);
                setHospitalDetails(response.data);
            } catch (error) {
                console.error('Error fetching hospital details:', error);
                message.error('병원 정보를 불러오는 중 오류가 발생했습니다.');
            }
        };

        const fetchAmbulanceInfo = async () => {
            try {
                const API_URL = process.env.REACT_APP_BASE_URL;
                const response = await fetch(`${API_URL}api/ambulance/info`);
                const data = await response.json();
                setAmbulanceInfo({
                    name: data.name || 'Unknown Ambulance',
                    address: data.address || 'Unknown Address',
                    phone: data.phone || 'Unknown Phone',
                });
            } catch (error) {
                console.error('Error fetching ambulance info:', error);
                message.error('구급차 정보를 불러오는 중 오류가 발생했습니다.');
            }
        };

        const fetchPatients = async () => {
            try {
                const API_URL = process.env.REACT_APP_BASE_URL;
                const response = await fetch(`${API_URL}api/hospital/patients`);
                const data = await response.json();
                setPatients(data.patients || []);
            } catch (error) {
                console.error('Error fetching patients:', error);
                message.error('환자 데이터를 불러오는 중 오류가 발생했습니다.');
            }
        };

        fetchHospitalData();
        fetchAmbulanceInfo();
        fetchPatients();
    }, [hospitalSub]);

    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            setMessages([...messages, { text: currentMessage, timestamp: new Date() }]);
            setCurrentMessage('');
        }
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card>
                <Title level={3}>
                    접수 상세 내역 - {hospitalDetails ? hospitalDetails.name : '병원 이름 불러오는 중'}
                </Title>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="구급차 정보">
                            <p><strong>이름:</strong> {ambulanceInfo.name}</p>
                            <p><strong>주소:</strong> {ambulanceInfo.address}</p>
                            <p><strong>전화번호:</strong> {ambulanceInfo.phone}</p>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Card title="환자 정보">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Input placeholder="환자 이름" />
                                </Col>
                                <Col span={8}>
                                    <Input placeholder="나이" />
                                </Col>
                                <Col span={8}>
                                    <Input placeholder="성별" />
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ marginTop: '16px' }}>
                                <Col span={8}>
                                    <Tag color="red">중증도: 심각</Tag>
                                </Col>
                                <Col span={16}>
                                    <Input placeholder="증상" />
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ marginTop: '16px' }}>
                                <Col span={12}>
                                    <Input placeholder="복용약" />
                                </Col>
                                <Col span={12}>
                                    <TextArea rows={3} placeholder="특이사항" />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Card>

            <Card title="채팅">
                <AntList
                    dataSource={messages}
                    renderItem={(item) => (
                        <AntList.Item>
                            <Text>{item.text}</Text>
                            <Text type="secondary" style={{ marginLeft: 'auto' }}>
                                {item.timestamp.toLocaleString()}
                            </Text>
                        </AntList.Item>
                    )}
                />
                <Row gutter={16} style={{ marginTop: '16px' }}>
                    <Col span={20}>
                        <TextArea
                            rows={1}
                            placeholder="메시지 입력하세요..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                        />
                    </Col>
                    <Col span={4}>
                        <Button type="primary" block onClick={handleSendMessage}>
                            보내기
                        </Button>
                    </Col>
                </Row>
            </Card>
        </Space>
    );
};

export default Reception;
