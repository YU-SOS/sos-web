import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/svg/sos-logo-white.svg';
import { Layout, Form, Input, Button, Checkbox, Upload, notification, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import signupHospitalAPI from '../../api/signup/signupHospitalAPI';
import dupCheckAPI from '../../api/duplicates/dupCheckAPI';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { Tooltip } from 'antd';

const { Header, Content } = Layout;

const SignupHospital = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [addr, setAddr] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 35.8358302, lng: 128.7521449 });
  const [markerPosition, setMarkerPosition] = useState({ lat: 35.8358302, lng: 128.7521449 });
  const [mapInstance, setMapInstance] = useState(null);
  const categoryOptions = ['산부인과', '정형외과', '흉부외과', '화상외과', '내과'];
  const [tooltipVisible, setTooltipVisible] = useState(false);


  // ID 중복 확인
  const handleIdCheck = async () => {
    const id = form.getFieldValue('id');
    if (!id) {
      notification.error({ message: 'ID를 입력하세요.' });
      return;
    }

    try {
      const response = await dupCheckAPI(id, 'HOS');
      if (response.status === 200) {
        notification.success({ message: '사용 가능한 ID입니다.' });
        setIsIdChecked(true);
      } else if (response.status === 409) {
        notification.error({ message: '이미 사용 중인 ID입니다.' });
        setIsIdChecked(false);
      } else {
        notification.error({ message: 'ID 중복 검사 중 오류가 발생했습니다.' });
        setIsIdChecked(false);
      }
    } catch (error) {
      notification.error({ message: '서버 오류가 발생했습니다. 다시 시도해주세요.' });
      console.error(error);
      setIsIdChecked(false);
    }
  };

  // 지도 사용
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

        setAddr(data[0].road_address_name)
        setMapCenter(newLocation);
        setMarkerPosition(newLocation);
        setLatitude(newLocation.lat);
        setLongitude(newLocation.lng);
        notification.success({ message: '검색된 위치로 이동하였습니다.' });
      } else {
        notification.error({
          message: '검색 결과가 없습니다.',
          description: '정확한 주소를 입력해주세요.',
        });
      }
    });
  };

  // 지도 클릭 이벤트
  const handleMapClick = (map, mouseEvent) => {
    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();
    const newCenter = new window.kakao.maps.LatLng(lat, lng);

    map.panTo(newCenter);

    setMarkerPosition({ lat, lng });
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleImageChange = ({ file }) => {
    const imageFile = file.originFileObj || file;
    if (imageFile instanceof Blob) {
      const previewUrl = URL.createObjectURL(imageFile);
      setImageFile(imageFile);
      setImageUrl(previewUrl);

      form.setFieldsValue({ imageUrl: previewUrl });
    } else {
      notification.error({ message: '이미지 파일을 업로드할 수 없습니다.' });
    }
  };

  // 대표 이미지 업로드
  const uploadImage = () => {
    const storageRef = ref(storage, `images/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    setIsUploading(true);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          notification.error({ message: '이미지 업로드 실패.' });
          setIsUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          notification.success({ message: '이미지 업로드 성공.' });
          setIsUploading(false);
          resolve(downloadURL);
        }
      );
    });
  };

  // 회원가입 요청
  const handleFinish = async (values) => {
    if (!imageFile) {
      notification.error({ message: '대표 이미지를 업로드해주세요.' });
      return;
    }
    if (isUploading) {
      notification.warning({ message: '이미지 업로드 중입니다. 잠시만 기다려주세요.' });
      return;
    }
    setIsUploading(true);
    try {
      const downloadURL = await uploadImage();
      const payload = {
        ...values,
        address : addr,
        imageUrl: downloadURL,
        location: { latitude, longitude },
      };
      const result = await signupHospitalAPI(payload);

      if (result.status === 201) {
        notification.success({ message: '가입 신청이 완료되었습니다.' });
        setTimeout(() => navigate('/'), 1000);
      } else if (result.status === 409) {
        notification.error({ message: '이미 존재하는 사용자입니다.' });
      } else {
        notification.error({ message: '회원가입 실패. 서버 오류가 발생했습니다.' });
      }
    } catch (error) {
      notification.error({ message: '회원가입 중 오류가 발생했습니다.' });
      console.error('회원가입 오류:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{ background: '#001529', padding: '0 20px', display: 'flex', alignItems: 'center' }}
      >
        <Logo />
      </Header>
      <Content
        style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          background: '#f0f2f5',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            width: '100%',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            background: '#fff',
          }}
        >
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>병원 회원가입</h1>
          <Form
            form={form}
            layout="horizontal"
            onFinish={handleFinish}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              name="id"
              label="ID"
              rules={[
                { required: true, message: '아이디를 입력하세요.' },
                {
                  validator: (_, value) =>
                    value && /^[0-9]+$/.test(value)
                      ? Promise.reject(new Error('숫자만 입력할 수 없습니다.'))
                      : Promise.resolve(),
                },
              ]}
            >
              <Tooltip
                title="공백이 포함되거나 숫자로만 구성된 ID는 사용할 수 없습니다."
                visible={tooltipVisible} 
                placement="bottom"
                color="red"
              >
                <Input.Search
                  placeholder="아이디"
                  enterButton="중복검사"
                  onSearch={(value) => {
                    if (/^[0-9]+$/.test(value)) {
                      setTooltipVisible(true);
                      setTimeout(() => setTooltipVisible(false), 5000);
                      return;
                    }
                    handleIdCheck(value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === ' ') {
                      e.preventDefault(); 
                      setTooltipVisible(true); 
                      setTimeout(() => setTooltipVisible(false), 5000);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s+/g, ''); 
                    if (/^[0-9]+$/.test(value)) {
                      setTooltipVisible(true);
                      setTimeout(() => setTooltipVisible(false), 5000);
                    }
                    form.setFieldsValue({ id: value });
                  }}
                  onPaste={(e) => {
                    const pastedText = e.clipboardData.getData('text');
                    if (pastedText.includes(' ') || /^[0-9]+$/.test(pastedText)) {
                      e.preventDefault(); 
                      setTooltipVisible(true); 
                      setTimeout(() => setTooltipVisible(false), 5000); 
                    }
                  }}
                  onBlur={() => setTooltipVisible(false)} 
                />
              </Tooltip>
            </Form.Item>

            <Form.Item
              name="password"
              label="비밀번호"
              rules={[
                { required: true, message: '비밀번호를 입력하세요.' },
                { pattern: /^\S+$/, message: '비밀번호에 공백 문자를 포함할 수 없습니다.' }
              ]}
            >
              <Input.Password
                  placeholder="비밀번호"
                  disabled={!isIdChecked}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s+/g, '');
                    form.setFieldsValue({ password: value });
                  }}
              />
            </Form.Item>
            <Form.Item
              name="name"
              label="병원 이름"
              rules={[
                { required: true, message: '병원 이름을 입력하세요.' },
                {
                  validator: (_, value) =>
                      value && (value.trim() === '' || /^[0-9]+$/.test(value))
                          ? Promise.reject(new Error('병원 이름에 공백 문자 또는 숫자만 입력할 수 없습니다.'))
                          : Promise.resolve(),
                }
              ]}
            >
              <Input placeholder="병원 이름" disabled={!isIdChecked} />
            </Form.Item>
            <Form.Item
              name="address"
              label="주소"
              rules={[
                { required: true, message: '주소를 입력하세요.' },
                {
                  validator: (_, value) =>
                    value && (value.trim() === '' || /^[0-9]+$/.test(value))
                      ? Promise.reject(new Error('주소에 공백 문자 또는 숫자만 입력할 수 없습니다.'))
                      : Promise.resolve(),
                },
              ]}
            >
              <Input.Search
                placeholder="주소"
                enterButton="검색"
                onSearch={handleSearch} // This connects the search input to the handleSearch function
                disabled={!isIdChecked}
                onChange={(e) => setAddress(e.target.value)} // Update the address state as the user types
              />
            </Form.Item>

            <Form.Item label="지도">
              <Map
                center={mapCenter}
                style={{ width: '100%', height: '350px' }}
                level={3}
                onClick={handleMapClick}
              >
                <MapMarker position={markerPosition} />
              </Map>
            </Form.Item>
            <Form.Item
              name="telephoneNumber"
              label="전화번호"
              rules={[
                { required: true, message: '전화번호를 입력하세요.' },
                {
                  pattern: /^[0-9\-]+$/,
                  message: '전화번호는 숫자와 하이픈(-)만 입력할 수 있습니다.',
                },
              ]}
            >
              <Input
                  placeholder="전화번호"
                  disabled={!isIdChecked}
              />
            </Form.Item>
            <Form.Item
              name="categories"
              label="카테고리 선택"
              rules={[
                { required: true, message: '카테고리를 선택해주세요.' },
                {
                  validator: (_, value) =>
                      Array.isArray(value) && value.length === 0
                          ? Promise.reject(new Error())
                          : Promise.resolve(),
                },
              ]}
            >
              <Checkbox.Group options={categoryOptions} disabled={!isIdChecked} />
            </Form.Item>
            <Form.Item
              label="대표 이미지"
              name="imageUrl"
              rules={[{ required: true, message: '대표 이미지를 업로드해주세요.' }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleImageChange}
                listType="picture"
                showUploadList={false}
                maxCount={1}
                disabled={!isIdChecked}
              >
                <Button icon={<UploadOutlined />} disabled={!isIdChecked}>
                  이미지 업로드
                </Button>
              </Upload>
              {imageUrl && (
                <div style={{ marginTop: '10px' }}>
                  <Image
                    src={imageUrl}
                    alt="대표 이미지"
                    width={200}
                    height={200}
                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                  />
                </div>
              )}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isUploading}
                  disabled={!isIdChecked || isUploading}
              >
                회원가입 요청
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default SignupHospital;