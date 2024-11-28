import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout, Card, List, Input, Button, Avatar, Typography, Empty, Row, Col, message } from "antd";
import { getReceptionDetails, sendComments, updateReceptionStatueArrival } from "../../api/hospitalAPI";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const ReceptionDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [receptionData, setReceptionData] = useState(null);
    const [comments, setComments] = useState([]);
    const [currentComments, setCurrentComments] = useState("");
    const [isTextAreaInvalid, setIsTextAreaInvalid] = useState(false);
    const [isArrivalProcessed, setIsArrivalProcessed] = useState(false);
    const listRef = useRef(null);

    const fetchReceptionDetails = async () => {
        try {
            const response = await getReceptionDetails(id);
            const data = response.data?.data || {};

            const sortedComments = [...(data.comments || [])].sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );

            setReceptionData(data);
            setComments(sortedComments);
        } catch (error) {
            console.error("리셉션 세부 정보 가져오기 실패:", error);
            message.error("리셉션 세부 정보를 가져오는 중 오류가 발생했습니다.");
        }
    };

    const handleSendMessage = async () => {
        if (!currentComments.trim()) {
            setIsTextAreaInvalid(true);
            return;
        }

        try {
            await sendComments(id, currentComments);

            const newComment = {
                id: Date.now().toString(),
                content: currentComments,
                createdAt: new Date().toISOString(),
            };

            setComments((prev) => [...prev, newComment]);
            setCurrentComments("");
            setIsTextAreaInvalid(false);
            message.success("메시지를 성공적으로 전송했습니다.");

            if (listRef.current) {
                listRef.current.scrollTop = listRef.current.scrollHeight;
            }
        } catch (error) {
            console.error("메시지 전송 실패:", error);
            message.error("메시지 전송 중 오류가 발생했습니다.");
        }
    };

    const handleArrival = async () => {
        if (isArrivalProcessed) return;

        setIsArrivalProcessed(true);

        try {
            await updateReceptionStatueArrival(id);
            message.success("구급대가 병원에 도착했습니다.");

            const processedArrivals = JSON.parse(localStorage.getItem("processedArrivals") || "[]");
            processedArrivals.push(id);
            localStorage.setItem("processedArrivals", JSON.stringify(processedArrivals));

            navigate("/hospital/reception");
        } catch (error) {
            console.error("구급대 병원 도착 처리 실패:", error);
            message.error("구급대 병원 도착 처리 중 오류가 발생했습니다.");
            setIsArrivalProcessed(false);
        }
    };

    useEffect(() => {
        fetchReceptionDetails();

        const processedArrivals = JSON.parse(localStorage.getItem("processedArrivals") || "[]");
        setIsArrivalProcessed(processedArrivals.includes(id));
    }, [id]);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [comments]);

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
            case "NON_URGEN":
                return "gray";
            default:
                return "lightgray";
        }
    };

    if (!receptionData) {
        return <Empty description="리셉션 세부 정보가 없습니다." />;
    }

    const { ambulance, hospital, patient, paramedic } = receptionData;

    return (
        <Layout style={{ height: "100vh" }}>
            <Header style={{ background: "#fff", padding: "20px" }}>
                <Title level={3}>응급실 요청 상세 정보</Title>
            </Header>
            <Content style={{ padding: "20px" }}>
                <Row gutter={[16, 16]} style={{ height: "100%" }}>
                    <Col span={16} style={{ height: "100%" }}>
                        <Card style={{ height: "100%" }}>
                            <Row align="middle" gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                                <Col span={12} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <Avatar
                                        src={ambulance?.imageUrl || "https://via.placeholder.com/120"}
                                        size={100}
                                        style={{ border: "2px solid #d9d9d9", borderRadius: "10px" }}
                                    />
                                    <div>
                                        <Title level={5}>{ambulance?.name || "구급대 이름 없음"}</Title>
                                        <Text>{ambulance?.address || "주소 정보 없음"}</Text>
                                    </div>
                                </Col>
                                <Col span={12} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <Avatar
                                        src={hospital?.imageUrl || "https://via.placeholder.com/120"}
                                        size={100}
                                        style={{ border: "2px solid #d9d9d9", borderRadius: "10px" }}
                                    />
                                    <div>
                                        <Title level={5}>{hospital?.name || "병원 이름 없음"}</Title>
                                        <Text>{hospital?.address || "주소 정보 없음"}</Text>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                                <Col span={4}>
                                    <Text strong>선탑 구급대원</Text>
                                </Col>
                                <Col span={20}>
                                    <Input
                                        value={paramedic?.name || "정보 없음"}
                                        readOnly
                                        style={{ marginBottom: "10px" }}
                                    />
                                    <Input value={paramedic?.phoneNumber || "정보 없음"} readOnly />
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]} style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                                <Col span={3}>
                                    <Text strong>환자 이름</Text>
                                </Col>
                                <Col span={4}>
                                    <Input style={{ width: "90%" }} value={patient?.name || "정보 없음"} readOnly />
                                </Col>
                                <Col span={2}>
                                    <Text strong>나이</Text>
                                </Col>
                                <Col span={3}>
                                    <Input style={{ width: "80%" }} value={patient?.age || "정보 없음"} readOnly />
                                </Col>
                                <Col span={2}>
                                    <Text strong>성별</Text>
                                </Col>
                                <Col span={3}>
                                    <Input
                                        style={{ width: "80%" }}
                                        value={
                                            patient?.gender === "male"
                                                ? "남자"
                                                : patient?.gender === "female"
                                                    ? "여자"
                                                    : "정보 없음"
                                        }
                                        readOnly
                                    />
                                </Col>
                                <Col span={7} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <Text strong>중증도</Text>
                                    <div
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            border: "2px solid #d9d9d9",
                                            borderRadius: "50%",
                                            backgroundColor: getSeverityColor(patient?.severity),
                                        }}
                                    />
                                    <Text>{patient?.severity || "정보 없음"}</Text>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                                <Col span={3}>
                                    <Text strong>증상</Text>
                                </Col>
                                <Col span={21}>
                                    <Input.TextArea rows={6} value={patient?.symptom || "정보 없음"} readOnly />
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                                <Col span={3}>
                                    <Text strong>복용약</Text>
                                </Col>
                                <Col span={21}>
                                    <Input.TextArea rows={5} value={patient?.medication || "정보 없음"} readOnly />
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                                <Col span={3}>
                                    <Text strong>특이사항</Text>
                                </Col>
                                <Col span={21}>
                                    <Input.TextArea rows={6} value={patient?.reference || "정보 없음"} readOnly />
                                </Col>
                            </Row>
                            <Row justify="end" gutter={[16, 16]}>
                                <Col>
                                    <Button
                                        type="primary"
                                        onClick={handleArrival}
                                        disabled={isArrivalProcessed}
                                        style={{
                                            backgroundColor: isArrivalProcessed ? "#d9d9d9" : undefined,
                                            borderColor: isArrivalProcessed ? "#d9d9d9" : undefined,
                                            color: isArrivalProcessed ? "#888" : undefined,
                                        }}
                                    >
                                        {isArrivalProcessed ? "이미 처리되었습니다" : "구급대 병원 도착"}
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={8} style={{ height: "100%" }}>
                        <Card
                            title={
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                    코멘트
                                </span>
                            }
                            style={{ height: "100%", display: "flex", flexDirection: "column" }}
                        >
                            <List
                                dataSource={comments}
                                renderItem={(item) => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta
                                            title={
                                                <span style={{ wordBreak: "break-word" }}>{item.content}</span>
                                            }
                                            description={new Date(item.createdAt).toLocaleString()}
                                        />
                                    </List.Item>
                                )}
                                style={{
                                    flex: 1,
                                    overflowY: "auto",
                                    maxHeight: 480,
                                    minHeight: 480,
                                    borderBottom: "1px solid #f0f0f0",
                                }}
                                ref={listRef}
                            />
                            <Input.TextArea
                                value={currentComments}
                                onChange={(e) => {
                                    setCurrentComments(e.target.value);
                                    if (e.target.value.trim()) {
                                        setIsTextAreaInvalid(false);
                                    }
                                }}
                                rows={3}
                                placeholder="메시지를 입력하세요..."
                                style={{
                                    overflowY: "auto",
                                    marginTop: "10px",
                                    borderColor: isTextAreaInvalid ? "red" : undefined,
                                }}
                            />
                            <Button
                                type="primary"
                                onClick={handleSendMessage}
                                style={{ marginTop: "10px", width: "100%" }}
                            >
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
