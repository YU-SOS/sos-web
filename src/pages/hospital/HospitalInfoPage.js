import React, { useState, useEffect } from 'react';
import { getHospitalDetails, updateHospitalInfo } from '../../api/hospitalAPI';
import { Map } from 'react-kakao-maps-sdk';
import useKakaoLoader from '../../api/signup/useKakaoLoader';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { toast } from 'react-toastify';

const HospitalInfoPage = () => {
    const [hospitalInfo, setHospitalInfo] = useState({
        name: '',
        address: '',
        telephoneNumber: '',
        imageUrl: '',
        location: {
            latitude: '',
            longitude: ''
        },
        emergencyRoomStatus: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [map, setMap] = useState({
        center: { lat: 37.5665, lng: 126.9780 },  // 초기값: 서울
        isPanto: true,
    });

    useKakaoLoader();

    // 병원 정보를 가져오는 함수
    const fetchHospitalInfo = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getHospitalDetails();
            setHospitalInfo({
                ...response.data,
                location: response.data.location || { latitude: '', longitude: '' }
            });
        } catch (err) {
            setError('병원 정보를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 병원 정보 수정 함수
    const handleUpdateHospitalInfo = async () => {
        setLoading(true);
        setError(null);

        try {
            let updatedData = { ...hospitalInfo };

            if (imageFile) {
                const imageUrl = await uploadImage(imageFile);  // 이미지 업로드 후 URL 반환
                updatedData = { ...updatedData, imageUrl };
            }

            await updateHospitalInfo(updatedData);
            toast.success('병원 정보가 성공적으로 수정되었습니다.');
        } catch (err) {
            setError('병원 정보를 수정하는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 이미지 업로드 함수
    const uploadImage = (imageFile) => {
        const storageRef = ref(storage, `images/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        setIsUploading(true);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                null,
                (error) => {
                    console.error("이미지 업로드 중 오류:", error);
                    toast.error("이미지 업로드 실패.");
                    setIsUploading(false);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    toast.success("이미지 업로드 성공.");
                    setIsUploading(false);
                    resolve(downloadURL);
                }
            );
        });
    };

    const handleAddressSearch = () => {
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(hospitalInfo.address, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const location = data[0];
                setMap({ center: { lat: location.y, lng: location.x } });
                setHospitalInfo({
                    ...hospitalInfo,
                    location: { latitude: location.y, longitude: location.x }
                });
            } else {
                setError('주소 검색에 실패했습니다.');
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        fetchHospitalInfo();
    }, []);

    return (
        <div className="hospital-info-container">
            <h2>병원 정보 관리</h2>
            <div className="info-form">
                <label>
                    병원명:
                    <input
                        type="text"
                        value={hospitalInfo.name}
                        onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                    />
                </label>
                <label>
                    주소:
                    <input
                        type="text"
                        value={hospitalInfo.address}
                        onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
                    />
                    <button onClick={handleAddressSearch}>주소 검색</button>
                </label>
                <Map
                    center={map.center}
                    isPanto={map.isPanto}
                    style={{ width: '100%', height: '350px' }}
                    level={3}
                    onClick={(_, mouseEvent) => {
                        const latlng = mouseEvent.latLng;
                        setHospitalInfo({
                            ...hospitalInfo,
                            location: { latitude: latlng.getLat(), longitude: latlng.getLng() }
                        });
                    }}
                />
                <label>
                    위도:
                    <input type="text" value={hospitalInfo.location.latitude} readOnly />
                </label>
                <label>
                    경도:
                    <input type="text" value={hospitalInfo.location.longitude} readOnly />
                </label>
                <label>
                    전화번호:
                    <input
                        type="text"
                        value={hospitalInfo.telephoneNumber}
                        onChange={(e) => setHospitalInfo({ ...hospitalInfo, telephoneNumber: e.target.value })}
                    />
                </label>

                {/* 이미지 선택 및 미리보기 */}
                <label>
                    대표 이미지:
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {imagePreview && (
                        <img src={imagePreview} alt="미리보기" style={{ width: '120px', height: '120px' }} />
                    )}
                </label>

                <button onClick={handleUpdateHospitalInfo} disabled={loading || isUploading}>
                    {loading || isUploading ? '저장 중...' : '정보 수정'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default HospitalInfoPage;
