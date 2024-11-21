import React, { useEffect, useState } from 'react';
import { Card, Input, Typography, Row, Col, Button, Tag, List as AntList, message } from 'antd';
import { getHospitalDetails, getAmbulanceDetails, getPatientDetails } from '../../api/hospitalAPI';

const { Title } = Typography;
const { TextArea } = Input;

const Request = ({ hospitalSub, receptionId }) => {
    const [hospitalDetails, setHospitalDetails] = useState(null);
    const [ambulanceInfo, setAmbulanceInfo] = useState({
        name: '',
        address: '',
        phone: '',
    });
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        if (!hospitalSub || !receptionId) {
            message.error('병원 식별자 또는 접수 ID가 없습니다.');
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
                const response = await getAmbulanceDetails(hospitalSub);
                setAmbulanceInfo({
                    name: response.data.name || 'Unknown Ambulance',
                    address: response.data.address || 'Unknown Address',
                    phone: response.data.telephoneNumber || 'Unknown Phone',
                });
            } catch (error) {
                console.error('Error fetching ambulance info:', error);
                message.error('구급차 정보를 불러오는 중 오류가 발생했습니다.');
            }
        };

        const fetchPatients = async () => {
            try {
                const response = await getPatientDetails(hospitalSub);
                setPatients(response.data || []);
            } catch (error) {
                console.error('Error fetching patients:', error);
                message.error('환자 데이터를 불러오는 중 오류가 발생했습니다.');
            }
        };

        fetchHospitalData();
        fetchAmbulanceInfo();
        fetchPatients();
    }, [hospitalSub, receptionId]);

    const renderSeverityTag = (status) => {
        switch (status) {
            case 'red':
                return <Tag color="red">심각</Tag>;
            case 'white':
                return <Tag color="default">경미</Tag>;
            default:
                return <Tag color="gray">보통</Tag>;
        }
    };

    return (
        <Card>
            <Title level={3}>
                병원 종합 상황 정보 대시보드 - {hospitalDetails ? hospitalDetails.name : '병원 이름 불러오는 중'}
            </Title>
            <Row gutter={[16, 16]}>
                {/* 구급차 정보 */}
                <Col span={8}>
                    <Card title="구급차 정보">
                        <p><strong>이름:</strong> {ambulanceInfo.name}</p>
                        <p><strong>주소:</strong> {ambulanceInfo.address}</p>
                        <p><strong>전화번호:</strong> {ambulanceInfo.phone}</p>
                    </Card>
                </Col>

                {/* 환자 정보 */}
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
                                {renderSeverityTag(patients[0]?.status || '')}
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

            {/* 환자 목록 */}
            <Card title="환자 목록" style={{ marginTop: '16px' }}>
                <AntList
                    dataSource={patients}
                    renderItem={(patient) => (
                        <AntList.Item>
                            <Row style={{ width: '100%' }}>
                                <Col span={6}><strong>이름:</strong> {patient.name}</Col>
                                <Col span={6}><strong>나이:</strong> {patient.age}</Col>
                                <Col span={6}><strong>성별:</strong> {patient.gender}</Col>
                                <Col span={6}>{renderSeverityTag(patient.status)}</Col>
                            </Row>
                        </AntList.Item>
                    )}
                    locale={{ emptyText: '환자 데이터가 없습니다' }}
                />
            </Card>

            {/* 수락 및 거절 버튼 */}
            <Row justify="end" style={{ marginTop: '16px' }}>
                <Button type="primary" style={{ marginRight: '8px' }}>수락</Button>
                <Button danger>거절</Button>
            </Row>
        </Card>
    );
};

export default Request;
