import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, Card, List, Input, Button, Avatar, Typography, Empty, Row, Col } from "antd";
import {getAuthToken, getEmergencyReceptionList} from "../../api/hospitalAPI";
import apiClient from "../../api/apiClient";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const ReceptionDetails = () => {
    const { id } = useParams(); // URL에서 ID를 가져옴
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");

    const fetchReceptionDetails = async () => {
        try {
            const response = await getEmergencyReceptionList();
            const allRequests = response.data.data.content;
            const request = allRequests.find((item) => item.id === id);
            setSelectedRequest(request);
        } catch (error) {
            console.error("세부 정보를 가져오는 중 오류:", error);
        }
    };

    const handleSendMessage = async () => {
        if (currentMessage.trim()) {
            try {
                const token = getAuthToken();
                const response = await apiClient.post(`/reception/${id}/comment`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    description: currentMessage,
                });

                if (response.status === 201) {
                    setMessages((prev) => [
                        ...prev,
                        { text: currentMessage, timestamp: new Date() },
                    ]);
                    setCurrentMessage("");
                }
            } catch (error) {
                console.error("메시지 전송 실패:", error);
            }
        }
    };

    useEffect(() => {
        fetchReceptionDetails();
    }, [id]);

    return (
        <Layout>
            <Header style={{ background: "#fff", padding: "20px" }}>
                <Title level={3}>응급실 요청 상세 정보</Title>
            </Header>
            <Content style={{ padding: "20px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={16}>
                        <Card title="요청 상세 정보">
                            {selectedRequest ? (
                                <>
                                    <Avatar
                                        src={selectedRequest.ambulance?.imageUrl || "https://via.placeholder.com/120"}
                                        size={120}
                                    />
                                    <Text>{selectedRequest.ambulance?.name || "구급대 이름 없음"}</Text>
                                    <Text>{selectedRequest.ambulance?.address || "주소 없음"}</Text>
                                </>
                            ) : (
                                <Empty description="세부 정보가 없습니다." />
                            )}
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="채팅">
                            <List
                                dataSource={messages}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={item.text}
                                            description={new Date(item.timestamp).toLocaleString()}
                                        />
                                    </List.Item>
                                )}
                            />
                            <Input.TextArea
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                rows={2}
                            />
                            <Button type="primary" onClick={handleSendMessage}>
                                보내기
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default ReceptionDetails;
