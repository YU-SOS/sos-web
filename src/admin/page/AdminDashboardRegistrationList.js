import React, { useEffect, useState } from 'react';
import { Layout, List, Typography, Card, Button, Modal, Image, message } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { getRegistrationList, getRegistrationDetails, approveRegistration } from '../../api/adminAPI';
import { Map, MapMarker } from "react-kakao-maps-sdk";

const { Content, Header } = Layout;
const { Title } = Typography;

const RegistrationList = () => {
    const [hospitalRequests, setHospitalRequests] = useState([]);
    const [ambulanceRequests, setAmbulanceRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const fetchDetails = async (id, type) => {
        setLoading(true);
        try {
            const role = type === 'hospital' ? 'HOS_GUEST' : 'AMB_GUEST';
            const response = await getRegistrationDetails(id, role);
            setSelectedRequest(response.data.data);
            setShowDetail(true);
        } catch (error) {
            message.error('세부 정보를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (isApproved) => {
        if (!selectedRequest) return;
        setLoading(true);
        try {
            const role = selectedRequest.hospitalId ? 'HOS_GUEST' : 'AMB_GUEST';
            await approveRegistration(selectedRequest.id, role, isApproved);
            message.success(isApproved ? '승인되었습니다.' : '거절되었습니다.');
            setShowDetail(false);
            fetchData();
        } catch (error) {
            message.error('승인/거절 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout>
                <Header style={{ background: '#fff', padding: '16px' }}>
                    <Title level={3}>관리자 대시보드 - 회원가입 요청 목록</Title>
                </Header>
                <Content style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Card title="병원" style={{ width: '48%' }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={hospitalRequests}
                                style={{ maxHeight: '600px', overflowY: 'auto' }}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[<RightOutlined />]}
                                        onClick={() => fetchDetails(item.id, 'hospital')}
                                    >
                                        <List.Item.Meta
                                            title={<strong>{item.name}</strong>}
                                            description={item.address}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>

                        <Card title="구급대" style={{ width: '48%' }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={ambulanceRequests}
                                style={{ maxHeight: '600px', overflowY: 'auto' }}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[<RightOutlined />]}
                                        onClick={() => fetchDetails(item.id, 'ambulance')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <List.Item.Meta
                                            title={<strong>{item.name}</strong>}
                                            description={item.address}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </div>

                    <Modal
                        visible={showDetail}
                        title="회원가입 요청 상세 정보"
                        onCancel={() => setShowDetail(false)}
                        footer={[
                            <Button key="reject" danger onClick={() => handleApproval(false)}>
                                거절
                            </Button>,
                            <Button key="approve" type="primary" onClick={() => handleApproval(true)}>
                                승인
                            </Button>,
                        ]}
                    >
                        {selectedRequest && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                                    <div style={{ flex: 1 }}>
                                        <Image
                                            src={selectedRequest.imageUrl || 'https://via.placeholder.com/200'}
                                            alt="대표 이미지"
                                            style={{ width: '100%', height: '200px', borderRadius: '8px' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Map
                                            center={{
                                                lat: parseFloat(selectedRequest.location.latitude),
                                                lng: parseFloat(selectedRequest.location.longitude),
                                            }}
                                            style={{ width: '100%', height: '200px', borderRadius: '8px' }}
                                            level={3}
                                        >
                                            <MapMarker
                                                position={{
                                                    lat: parseFloat(selectedRequest.location.latitude),
                                                    lng: parseFloat(selectedRequest.location.longitude),
                                                }}
                                            >
                                            </MapMarker>
                                        </Map>
                                    </div>
                                </div>
                                <div>
                                    <Title level={4} style={{ marginTop: '5px', marginBottom: '2px' }}>병원명</Title>
                                    <p style={{ marginLeft: '5px' }}>{selectedRequest.name}</p>

                                    <Title level={4} style={{ marginTop: '7px', marginBottom: '2px' }}>주소</Title>
                                    <p style={{ marginLeft: '5px' }}>{selectedRequest.address}</p>

                                    <Title level={4} style={{ marginTop: '7px', marginBottom: '2px' }}>전화번호</Title>
                                    <p style={{ marginLeft: '5px' }}>{selectedRequest.telephoneNumber}</p>
                                </div>
                            </div>
                        )}
                    </Modal>
                </Content>
            </Layout>
        </Layout>
    );
};

export default RegistrationList;