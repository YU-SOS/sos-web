import React, { useEffect, useState } from 'react';
import { Layout, List, Card, Typography, message, Row, Col, Input, Avatar, Button, Empty, Switch} from 'antd';
import { getEmergencyReceptionList, getHospitalDetails, updateHospitalInfo, updateReceptionStatus} from '../../api/hospitalAPI';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Reception = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [hospitalDetails, setHospitalDetails] = useState(null);
    const [emergencyStatus, setEmergencyStatus] = useState(false);

    // Chat-related states
    const [messages, setMessages] = useState([]); // State for chat messages
    const [currentMessage, setCurrentMessage] = useState(''); // State for the current input message

    const isValid = (patient) => {
        return patient && patient.id && patient.patient?.name;
    };


    useEffect(() => {
        const storedPatient = localStorage.getItem('selectedPatient');
        if (storedPatient) {
            const patient = JSON.parse(storedPatient);
            if (isValid(patient)) {
                setSelectedRequest(patient);
            }
        }
    }, []);



    const fetchHospitalDetails = async () => {
        try {
            const response = await getHospitalDetails();
            console.log(response.data);
            setHospitalDetails(response.data);
        } catch (error) {
            console.error(error);
            message.error('병원 정보를 가져오는 중 오류가 발생했습니다.');
        }
    };

    const fetchReceptionData = async () => {
        try {
            const response = await getEmergencyReceptionList();
            const data = response.data.data.content;
            setRequests(data || []);
        } catch (error) {
            message.error('데이터를 불러오는 중 오류가 발생했습니다.');
        }
    };

    const handleEmergencyStatusToggle = async (checked) => {
        try {
            await updateHospitalInfo({ emergencyStatus: checked }); // API 호출
            setEmergencyStatus(checked); // 상태 업데이트
        } catch (error) {
            console.error(error);
        }
    };

    const handleRequestClick = (item) => {
        if (selectedRequest?.id === item.id) {
            setSelectedRequest(null);
        } else {
            setSelectedRequest(item);
        }
    };

    const handleDecision = async (isApproved) => {
        if (!selectedRequest) {
            message.error('선택된 요청이 없습니다.');
            return;
        }

        const { id } = selectedRequest;

        try {
            const result = await updateReceptionStatus(id, isApproved);
            message.success(result.message || '요청이 성공적으로 처리되었습니다.');
            fetchReceptionData();
            setSelectedRequest(null);
        } catch (error) {
            message.error('요청 처리 중 오류가 발생했습니다.');
        }
    };

    const getGenderLabel = (gender) => {
        if (gender === 'male') return '남자';
        if (gender === 'female') return '여자';
        return '알 수 없음';
    };

    // Chat message handler
    const handleSendMessage = async () => {
        if (currentMessage.trim()) {
            try {
                const response = await fetch(`/reception/${selectedRequest.id}/comment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        description: currentMessage, // The message to send
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 201 && data.message === "코멘트 등록에 성공했습니다..") {
                        message.success(data.message);

                        // Add the new message to the local state
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            { text: currentMessage, timestamp: new Date() },
                        ]);
                        setCurrentMessage(""); // Clear the input field
                    } else {
                        message.error("서버 응답이 예상과 다릅니다.");
                    }
                } else {
                    message.error("메시지 전송에 실패했습니다.");
                }
            } catch (error) {
                console.error("Error sending message:", error);
                message.error("서버 오류로 메시지를 전송하지 못했습니다.");
            }
        }
    };


    useEffect(() => {
        fetchReceptionData();
        fetchHospitalDetails();
    }, []);

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ background: '#fff', padding: '20px', display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <Title level={3} style={{ margin: 0 }}>
                        접수 상세 내역 - {hospitalDetails ? hospitalDetails.data.name : '병원 이름 불러오는 중'}
                    </Title>
                    <Switch
                        checked={emergencyStatus}
                        onChange={handleEmergencyStatusToggle}
                        checkedChildren="환자 수용 가능"
                        unCheckedChildren="응급실 FULL"
                        style={{
                            backgroundColor: emergencyStatus ? '#52c41a' : '#ff4d4f',
                            color: '#fff',
                            border: 'none',
                        }}
                    />
                </div>
            </Header>
            <Content style={{ padding: '20px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={16}>
                        <Card style={{ height: '100%' }}>
                            {selectedRequest ? (
                                <div>
                                    <Row align="middle" gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                                        {/* First Avatar */}
                                        <Col span={3}>
                                            <Avatar
                                                src={selectedRequest.ambulance?.imageUrl}
                                                size={100}
                                                style={{ backgroundColor: '#f0f0f0' }}
                                            />
                                        </Col>
                                        {/* Ambulance Info */}
                                        <Col span={11}>
                                            <Title level={4}>
                                                {selectedRequest.ambulance?.name || '구급대 이름 없음'}
                                            </Title>
                                            <Text>{selectedRequest.ambulance?.address || '주소 정보 없음'}</Text>
                                            <br />
                                            <Text>{selectedRequest.ambulance?.telephoneNumber || '연락처 정보 없음'}</Text>
                                        </Col>
                                        {/* Vertical Divider */}
                                        <Col
                                            span={1}
                                            style={{
                                                textAlign: 'center',
                                                borderRight: '1px solid #d9d9d9',
                                                height: '100%',
                                            }}
                                        >
                                            <div style={{ height: '100%' }}></div>
                                        </Col>
                                        {/* Hospital Info */}
                                        <Col span={6}>
                                            <Title level={4}>
                                                {hospitalDetails ? hospitalDetails.data.name : '병원 이름 불러오는 중'}
                                            </Title>
                                            <Text>{hospitalDetails ? hospitalDetails.data.address : '병원 이름 없음'}</Text>
                                            <br />
                                            <Text>
                                                &nbsp;
                                            </Text>
                                        </Col>
                                        {/* Second Avatar - Aligned to the Right */}
                                        <Col span={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Avatar
                                                src={hospitalDetails?.data.imageUrl || 'https://via.placeholder.com/120'}
                                                size={100}
                                                style={{ backgroundColor: '#f0f0f0' }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginBottom: '16px', alignItems: 'center' }}>
                                        <Col span={4}>
                                            <Text>
                                                <span style={{ fontWeight: 'bold' }}>선탑 구급대원 </span>
                                            </Text>
                                        </Col>
                                        <Col span={20} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '16px' }}>
                                            <Text>
                                                <span style={{ fontWeight: 'bold' }}>이름: </span>
                                                {selectedRequest?.paramedicRes?.name || '정보 없음'}
                                            </Text>
                                            <Text>
                                                <span style={{ fontWeight: 'bold' }}>전화번호: </span>
                                                {selectedRequest?.paramedicRes?.phoneNumber || '정보 없음'}
                                            </Text>
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                        <Col span={4}>
                                            <Text strong>환자 이름</Text>
                                        </Col>
                                        <Col span={8}>
                                            <Input
                                                value={selectedRequest.patient?.name || '정보 없음'}
                                                readOnly
                                            />
                                        </Col>
                                        <Col span={4}>
                                            <Text strong>나이</Text>
                                        </Col>
                                        <Col span={8}>
                                            <Input
                                                value={selectedRequest.patient?.age || '정보 없음'}
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                        <Col span={4}>
                                            <Text strong>성별</Text>
                                        </Col>
                                        <Col span={8}>
                                            <Input
                                                value={getGenderLabel(selectedRequest.patient?.gender)}
                                                readOnly
                                            />
                                        </Col>
                                        <Col span={4}>
                                            <Text strong>중증도</Text>
                                        </Col>
                                        <Col span={8}>
                                            <Input
                                                value={selectedRequest.receptionStatus || '정보 없음'}
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                        <Col span={4}>
                                            <Text strong>증상</Text>
                                        </Col>
                                        <Col span={20}>
                                            <Input.TextArea
                                                value={selectedRequest.patient?.reference || '정보 없음'}
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                        <Col span={4}>
                                            <Text strong>복용약</Text>
                                        </Col>
                                        <Col span={20}>
                                            <Input.TextArea
                                                value={selectedRequest.patient?.medication || '정보 없음'}
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                        <Col span={4}>
                                            <Text strong>특이사항</Text>
                                        </Col>
                                        <Col span={20}>
                                            <Input.TextArea
                                                value={selectedRequest.patient?.reference || '정보 없음'}
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                        <Col span={4}>
                                            <Text strong>전화번호</Text>
                                        </Col>
                                        <Col span={20}>
                                            <Input
                                                value={selectedRequest.patient?.phoneNumber || '정보 없음'}
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row justify="end" gutter={[16, 16]}>
                                        <Col>
                                            <Button
                                                type="primary"
                                                style={{ backgroundColor: '#52c41a' }}
                                                onClick={() => handleDecision(true)} // 수락
                                            >
                                                수락
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button
                                                type="primary"
                                                danger
                                                onClick={() => handleDecision(false)} // 거절
                                            >
                                                거절
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            ) : (
                                <>
                                    <Empty description="No Data" />
                                </>
                            )}
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Chat Interface" style={{ height: '100%' }}>
                            <List
                                dataSource={messages}
                                renderItem={(message, index) => (
                                    <List.Item
                                        key={index}
                                        style={{
                                            borderRadius: '5px',
                                            padding: '10px 15px',
                                            backgroundColor: index % 2 === 0 ? '#fafafa' : 'transparent',
                                        }}
                                    >
                                        <List.Item.Meta
                                            title={<div>{message.text}</div>}
                                            description={<div>{message.timestamp.toLocaleString()}</div>}
                                        />
                                    </List.Item>
                                )}
                                style={{ minHeight: '500px', maxHeight: '500px', overflowY: 'auto', marginBottom: '10px' }}
                            />
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Input.TextArea
                                    placeholder="메시지 입력하세요..."
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    autoSize={{ minRows: 1, maxRows: 3 }}
                                    style={{ flexGrow: 1 }}
                                />
                                <Button type="primary" onClick={handleSendMessage}>
                                    보내기
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Reception;