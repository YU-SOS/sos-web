import React, { useRef, useState, useEffect } from 'react';
import {Form, Input, Button, Card, Typography, Checkbox, Row, Col, message, Image, notification} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getHospitalDetails, updateHospitalInfo } from '../../api/hospitalAPI';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';



const { Title } = Typography;

const HospitalProfilePage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [hospitalDetails, setHospitalDetails] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [address, setAddress] = useState('');
    const [mapInstance, setMapInstance] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 35.8358302, lng: 128.7521449 });
    const [markerPosition, setMarkerPosition] = useState({ lat: 35.8358302, lng: 128.7521449 });
    const categoryOptions = ['산부인과', '정형외과', '흉부외과', '화상외과', '내과'];
    const fileInputRef = useRef(null);
    const [imageFile, setImageFile] = useState(null);


    const fetchHospitalDetails = async () => {
        try {
            const response = await getHospitalDetails();
            const data = response.data.data;
            setHospitalDetails(data);
            form.setFieldsValue({
                name: data.name,
                address: data.address,
                telephoneNumber: data.telephoneNumber,
                categories: data.categories?.map((category) => category.name) || [],
            });
            setImageUrl(data.imageUrl);
            setAddress(data.address);
            setLatitude(data.location?.latitude || 0);
            setLongitude(data.location?.longitude || 0);
            setMapCenter({ lat: parseFloat(data.location?.latitude || 0), lng: parseFloat(data.location?.longitude || 0) });
            setMarkerPosition({ lat: parseFloat(data.location?.latitude || 0), lng: parseFloat(data.location?.longitude || 0) });
        } catch (error) {
            console.error(error);
            message.error('병원 정보를 가져오는 중 오류가 발생했습니다.');
        }
    };

    const handleUpdate = async (values) => {
        try {
            setLoading(true);
            let finalImageUrl = imageUrl;
            if (imageFile) {
                const storageRef = ref(storage, `images/${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                finalImageUrl = await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        null,
                        (error) => {
                            message.error('이미지 업로드 실패');
                            reject(error);
                        },
                        async () => {
                            const url = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(url);
                        }
                    );
                });
            }

            const updatedData = {
                ...values,
                imageUrl: finalImageUrl, // 최종 URL
                location: { latitude, longitude },
            };

            await updateHospitalInfo(updatedData);
            message.success('병원 정보가 성공적으로 수정되었습니다.');

            setTimeout(() => {
                window.location.reload();
            }, 300);
        } catch (error) {
            console.error(error);
            message.error('병원 정보를 수정하는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const ps = new window.kakao.maps.services.Places();

    const handleSearch = () => {
        if (!address) {
            notification.error({ message: '주소를 입력하세요.' });
            return;
        }

        ps.keywordSearch(address, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const newLocation = {
                    lat: parseFloat(data[0].y),
                    lng: parseFloat(data[0].x),
                };
                const newCenter = new window.kakao.maps.LatLng(newLocation.lat, newLocation.lng);

                if (mapInstance) {
                    mapInstance.panTo(newCenter);
                }

                setMapCenter(newLocation);
                setMarkerPosition(newLocation);
                setLatitude(newLocation.lat);
                setLongitude(newLocation.lng);
                notification.success({ message: '검색된 위치로 이동하였습니다.' });
            } else {
                notification.error({ message: '검색 결과가 없습니다.' });
            }
        });
    };

    const handleMapClick = (map, mouseEvent) => {
        const lat = mouseEvent.latLng.getLat();
        const lng = mouseEvent.latLng.getLng();
        const newCenter = new window.kakao.maps.LatLng(lat, lng);

        map.panTo(newCenter);

        setMarkerPosition({ lat, lng });
        setLatitude(lat);
        setLongitude(lng);
    };

    useEffect(() => {
        fetchHospitalDetails();
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '90%', padding: '20px' }}>
                <Card
                    style={{
                        height: '100%',
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Title level={3} style={{ textAlign: 'left', marginBottom: '20px' }}>
                        병원 정보 수정
                    </Title>
                    <Form form={form} layout="vertical" onFinish={handleUpdate}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <Row gutter={16}>
                                    <Col span={10}>
                                        <Form.Item
                                            name="name"
                                            label={<span style={{ fontWeight: 'bold' }}>병원 이름</span>}
                                            rules={[{ required: true, message: '병원 이름을 입력하세요!' }]}
                                        >
                                            <Input
                                                placeholder="병원 이름"
                                                style={{ width: '250px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="telephoneNumber"
                                            label={<span style={{ fontWeight: 'bold' }}>전화번호</span>}
                                            rules={[{ required: true, message: '전화번호를 입력하세요!' }]}
                                        >
                                            <Input
                                                placeholder="전화번호"
                                                style={{ width: '250px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    name="categories"
                                    label={<span style={{ fontWeight: 'bold' }}>카테고리 선택</span>}
                                    rules={[
                                        {
                                            required: true,
                                            message: '카테고리를 최소 하나 이상 선택해주세요.',
                                        },
                                        {
                                            validator: (_, value) =>
                                                value && value.length > 0
                                                    ? Promise.resolve()
                                                    : Promise.reject(),
                                        },
                                    ]}
                                >
                                    <Checkbox.Group options={categoryOptions} />
                                </Form.Item>

                                <Form.Item
                                    name="address"
                                    label={<span style={{ fontWeight: 'bold' }}>주소</span>}
                                    rules={[{ required: true, message: '주소를 입력하세요!' }]}
                                >
                                    <Row gutter={8}>
                                        <Col span={20}>
                                            <Input.Search
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="주소 검색"
                                                enterButton="검색"
                                                onSearch={handleSearch}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={
                                        <span>
                                            <span
                                                style={{ fontWeight: 'bold' }}
                                            >대표 이미지</span>
                                            (이미지 클릭 시 수정 가능)
                                        </span>
                                    }
                                >
                                    <div>
                                        {imageUrl && (
                                            <Image
                                                src={imageUrl}
                                                alt="대표 이미지"
                                                width={210}
                                                height={210}
                                                style={{
                                                    borderRadius: '10px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={handleImageClick}
                                                preview={false}
                                            />
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef} // 파일 입력 요소 참조
                                            style={{ display: 'none' }} // 화면에서 숨김
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {!imageUrl && (
                                            <Button
                                                icon={<UploadOutlined />}
                                                onClick={handleImageClick} // 버튼 클릭으로도 파일 선택 트리거
                                            >
                                                이미지 업로드
                                            </Button>
                                        )}
                                    </div>
                                </Form.Item>

                            </Col>

                        </Row>
                        <Row>
                            {/* 지도 */}
                            <Col span={24}>
                                <Map
                                    center={mapCenter}
                                    style={{ width: '100%', height: '350px', marginBottom: '20px' }}
                                    level={3}
                                    onClick={handleMapClick}
                                    onCreate={(map) => setMapInstance(map)}
                                >
                                    <MapMarker position={markerPosition} />
                                </Map>
                            </Col>
                        </Row>
                        <Form.Item style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                수정하기
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default HospitalProfilePage;