import React, { useEffect, useState } from 'react';
import { Layout, Menu, message } from 'antd';
import styled from 'styled-components';
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';
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
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '로그아웃',
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
                        margin: '16px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        border: '2px solid #fff',
                        objectFit: 'contain',
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
                style={{ backgroundColor: '#353535', color: '#fff' }}
            />
        </CustomSider>
    );
};

const CustomSider = styled(Sider)`
    background-color: #353535 !important;
    color: #fff;
    position: relative;
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

export default HospitalHeader;
