import React, { useEffect, useState } from 'react';
import { Layout, List, Card, Typography, message, Row, Col, Input, Avatar, Button, Empty, Switch, Modal } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { getEmergencyReceptionList, getHospitalDetails, updateHospitalStatus, updateReceptionStatus } from '../../api/hospitalAPI';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [hospitalDetails, setHospitalDetails] = useState(null);
    const [emergencyStatus, setEmergencyStatus] = useState(false);

    const fetchHospitalDetails = async () => {
        try {
            const response = await getHospitalDetails();
            console.log(response.data);
            setHospitalDetails(response.data);

            const status = response.data?.data?.emergencyRoomStatus;
            setEmergencyStatus(status || false); // API 값에 따라 초기 상태 설정
        } catch (error) {
            console.error(error);
            message.error('병원 정보를 가져오는 중 오류가 발생했습니다.');
        }
    };

    const fetchReceptionData = async () => {
        try {
            const response = await getEmergencyReceptionList();
            const data = response.data.data.content;
            setRequests(data);

            const pendingRequests = data.filter((request) => request.receptionStatus === "PENDING");

            setRequests(pendingRequests || []); // 필터링된 데이터를 상태에 저장
        } catch (error) {
            message.error('데이터를 불러오는 중 오류가 발생했습니다.');
        }
    };


    const handleEmergencyStatusToggle = async (checked) => {
        try {
            await updateHospitalStatus({ emergencyStatus: checked }); // API 호출
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

        if (!isApproved) {
            Modal.confirm({
                title: '거절 확인',
                content: (
                    <>
                        정말로 이 요청을 거절하시겠습니까?
                        <br />
                        요청을 거절하면 되돌릴 수 없습니다.
                    </>
                ),
                okText: '예',
                cancelText: '아니오',
                onOk: async () => {
                    try {
                        const result = await updateReceptionStatus(id, isApproved);
                        message.success(result.message || '요청이 성공적으로 처리되었습니다.');
                        fetchReceptionData();
                        setSelectedRequest(null);
                    } catch (error) {
                        message.error('요청 처리 중 오류가 발생했습니다.');
                    }
                },
            });
            return;
        }

        try {
            const result = await updateReceptionStatus(id, isApproved);
            if (isApproved) {
                const storedIds = JSON.parse(localStorage.getItem('acceptedReceptions')) || [];
                const updatedIds = [...storedIds, id];
                localStorage.setItem('acceptedReceptions', JSON.stringify(updatedIds));
            }

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

    const getSeverityColor = (severity) => {
        switch (severity) {
            case "IMMEDIATE":
                return "red";
            case "EMERGENCY":
                return "orange";
            case "URGENT":
                return "yellow";
            case "SEMI_URGENT":
                return "green";
            case "NON_URGENT":
                return "gray";
            default:
                return "lightgray";
        }
    };

    useEffect(() => {
        fetchReceptionData();
        fetchHospitalDetails();
        const interval = setInterval(() => {
            fetchReceptionData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ background: '#fff', padding: '20px', display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <Title level={3} style={{ margin: 0 }}>
                        병원 대시보드 - {hospitalDetails ? hospitalDetails.data.name : '병원 이름 불러오는 중'}
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
            <Content style={{ padding: '20px', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
                <Row gutter={[16, 16]} style={{ height: '100%' }}>
                    <Col span={16} style={{ height: '100%' }}>
                        <Card
                            style={{
                                height: '100%',
                                borderRadius: '10px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            {selectedRequest ? (
                                <div>
                                    <Row align="middle" gutter={[16, 16]} style={{ marginBottom: '4px' }}>
                                        <Col span={4}>
                                            <Text strong>접수번호</Text>
                                        </Col>
                                        <Col span={3}>
                                            <Input value={selectedRequest.number || '정보 없음'} readOnly />
                                        </Col>
                                    </Row>
                                    <Row align="middle" gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                                        <Col span={4}>
                                            <Avatar
                                                src={selectedRequest.ambulance?.imageUrl}
                                                size={100}
                                                style={{ backgroundColor: '#f0f0f0' }}
                                            />
                                        </Col>
                                        <Col span={10}>
                                            <Title level={4}>{selectedRequest.ambulance?.name || '구급대 이름 없음'}</Title>
                                            <Text>&nbsp;{selectedRequest.ambulance?.address || '주소 정보 없음'}</Text>
                                            <br />
                                            <Text>&nbsp;{selectedRequest.ambulance?.telephoneNumber || '연락처 정보 없음'}</Text>
                                        </Col>
                                        <Col
                                            span={1}
                                            style={{ textAlign: 'center', borderRight: '1px solid #d9d9d9', height: '100%' }}
                                        >
                                            <div style={{ height: '100%' }}></div>
                                        </Col>
                                        <Col span={8}>
                                            <Title level={4}>선탑 구급대원</Title>
                                            <Text>
                                                &nbsp;&nbsp;
                                                <span style={{ fontWeight: 'bold' }}>이름: </span>
                                                {selectedRequest?.paramedicRes?.name || '정보 없음'}
                                            </Text>
                                            <br />
                                            <Text>
                                                &nbsp;&nbsp;
                                                <span style={{ fontWeight: 'bold' }}>전화번호 : </span>
                                                {selectedRequest?.paramedicRes?.phoneNumber || '정보 없음'}
                                            </Text>
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                        <Col span={4}>
                                            <Text strong>환자 이름</Text>
                                        </Col>
                                        <Col span={8}>
                                            <Input value={selectedRequest.patient?.name || '정보 없음'} readOnly />
                                        </Col>
                                        <Col span={4}>
                                            <Text strong>나이</Text>
                                        </Col>
                                        <Col span={8}>
                                            <Input value={selectedRequest.patient?.age || '정보 없음'} readOnly />
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                        <Col span={4}>
                                            <Text strong>성별</Text>
                                        </Col>
                                        <Col span={8}>
                                            <Input value={getGenderLabel(selectedRequest.patient?.gender)} readOnly />
                                        </Col>
                                        <Col span={4}>
                                            <Text strong>중증도</Text>
                                        </Col>
                                        <Col span={8}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        border: '2px solid #d9d9d9',
                                                        borderRadius: '50%',
                                                        backgroundColor: getSeverityColor(selectedRequest.patient?.severity),
                                                    }}
                                                />
                                                <Text>{selectedRequest.patient?.severity || '정보 없음'}</Text>
                                            </div>
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
                                            <Input value={selectedRequest.patient?.phoneNumber || '정보 없음'} readOnly />
                                        </Col>
                                    </Row>
                                    <Row justify="end" gutter={[32, 16]}>
                                        <Col>
                                            <Button
                                                type="primary"
                                                style={{ backgroundColor: '#52c41a' }}
                                                onClick={() => handleDecision(true)}
                                            >
                                                수락
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button
                                                type="primary"
                                                danger
                                                onClick={() => handleDecision(false)}
                                            >
                                                거절
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            ) : (
                                <>
                                    <Empty style={{ fontSize: '16px' }} description="환자를 선택하세요." />
                                </>
                            )}
                        </Card>

                    </Col>

                    <Col span={8}>
                        <Card title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>응급실 접수 요청 목록</span>
                                {/*
                                <Button
                                    type="default"
                                    icon={<ReloadOutlined />}
                                    onClick={fetchReceptionData}
                                >
                                    새로고침
                                </Button>*/}
                                <Button
                                    type="primary"
                                    icon={<ReloadOutlined />}
                                    onClick={fetchReceptionData}
                                >
                                    새로고침
                                </Button>
                            </div>
                        }
                            style={{
                                height: '100%',
                                borderRadius: '10px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <List
                                dataSource={requests}
                                renderItem={(item) => (
                                    <List.Item
                                        onClick={() => handleRequestClick(item)}
                                        style={{
                                            cursor: 'pointer',
                                            backgroundColor: selectedRequest?.id === item.id ? '#e6f7ff' : 'transparent', // 선택된 항목 강조
                                            borderRadius: '5px',
                                        }}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <img
                                                    src={item.ambulance?.imageUrl}
                                                    alt="구급차"
                                                    style={{ width: 50, height: 50, borderRadius: '50%', marginLeft: '10px' }}
                                                />
                                            }
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <Text>{`환자: ${item.patient?.name || '정보 없음'}`}</Text>
                                                    <div
                                                        style={{
                                                            marginLeft: 'auto',
                                                            marginRight: 3,
                                                            width: '18px',
                                                            height: '18px',
                                                            border: '1px solid #d9d9d9',
                                                            borderRadius: '50%',
                                                            backgroundColor: getSeverityColor(item.patient?.severity),
                                                        }}
                                                    />
                                                </div>
                                            }
                                            description={`나이: ${item.patient?.age || 'N/A'} | 성별: ${getGenderLabel(item.patient?.gender)} | 증상: ${item.patient?.reference}`}
                                        />
                                    </List.Item>
                                )}
                                style={{ minHeight: '600px', maxHeight: '600px', overflowY: 'auto' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Dashboard;