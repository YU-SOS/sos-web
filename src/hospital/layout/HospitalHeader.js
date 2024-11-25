import React, { useEffect, useState } from 'react';
import { Layout, Menu, message } from 'antd';
import styled from 'styled-components';
import {AppstoreOutlined, HomeOutlined, LogoutOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getHospitalDetails } from '../../api/hospitalAPI';

const { Sider } = Layout;

const HospitalHeader = () => {
    const [hospitalDetails, setHospitalDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        const fetchHospitalDetails = async () => {
            try {
                const response = await getHospitalDetails();
                setHospitalDetails(response.data);
            } catch (error) {
                console.error('Error fetching hospital details:', error);
                message.error('병원 정보를 가져오는 중 오류가 발생했습니다.');
            }
        };

        fetchHospitalDetails();
    }, []);

    const menuItems = [
        {
            key: 'hospital/dashboard',
            icon: <HomeOutlined />,
            label: '대시보드',
        },
        {
            key: 'hospital/profile',
            icon: <AppstoreOutlined />,
            label: '병원 정보 수정',
        },
        {
            key: 'hospital/list',
            icon: <AppstoreOutlined />,
            label: '응급실 목록 화면',
        },
        {
            key: 'hospital/request',
            icon: <AppstoreOutlined />,
            label: '병원 종합 상황 정보 대시보드',
        },
        {
            key: 'hospital/reception',
            icon: <AppstoreOutlined />,
            label: '접수 상세 내역',
        },
    ];

    const onMenuClick = ({ key }) => {
        if (key === 'logout') {
            localStorage.removeItem('accessToken');
            message.success('로그아웃 성공!');
            navigate('/');
        } else {
            navigate(`/${key}`);
        }
    };

    return (
        <CustomSider width={300}>
            <Logo>SOS</Logo>
            <ImageContainer>

                <img
                    src={hospitalDetails?.data.imageUrl || 'https://via.placeholder.com/120'}
                    alt="병원 대표 이미지"
                    style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        border: '2px solid #fff',
                        objectFit: 'pointer',
                    }}
                />
            </ImageContainer>
            <Name>{hospitalDetails?.data.name || ' '}</Name>
            <SubInfo>{hospitalDetails?.data.address || ' '}</SubInfo>
            <Menu
                theme="dark"
                mode="inline"
                items={menuItems}
                onClick={onMenuClick}
                style={{ backgroundColor: '#353535', color: '#fff', flex: 1 }}
            />
            <LogoutButton onClick={() => onMenuClick({ key: 'logout' })}>
                <LogoutOutlined style={{ marginRight: '8px' }} />
                로그아웃
            </LogoutButton>
        </CustomSider>
    );
};

const CustomSider = styled(Sider)`
    background-color: #353535 !important;
    color: #fff;
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Logo = styled.div`
    height: 50px;
    color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
    font-family: 'Pacifico', cursive;
    font-size: 30px;
    font-weight: 600;
    border-bottom: 0.5px solid #404040;
`;

const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
`;

const Name = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    font-size: 25px;
    font-weight: 600;
    color: #fff;
`;

const SubInfo = styled.div`
    font-size: 14px;
    color: #ccc;
    text-align: center;
    margin-bottom: 20px;
`;

const LogoutButton = styled.div`
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 250px;
    padding: 16px 0;
    text-align: center;
    background-color: #d32f2f;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #b71c1c;
        transform: translateX(-50%) scale(1.05);
    }

    &:active {
        background-color: #c62828;
        transform: translateX(-50%) scale(0.95);
    }
`;

export default HospitalHeader;
