import React, { useEffect } from 'react';
import { Layout, Menu, message } from 'antd';
import { AppstoreOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SOSLogo from "../../pages/SOS_Logo.png";

const { Sider } = Layout;

const Header = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const menuItems = [
        {
            key: 'admin/dashboard',
            icon: <HomeOutlined />,
            label: '대시보드',
        },
        {
            key: 'admin/registration-list',
            icon: <AppstoreOutlined />,
            label: '회원가입 요청',
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
                    src={SOSLogo}
                    alt="SOS Logo"
                    style={{
                        margin: '16px',
                        width: '200px',
                        height: '200px',
                        objectFit: 'contain',
                    }}
                />
            </ImageContainer>
            <Name>관리자</Name>
            <Menu
                theme="dark"
                mode="inline"
                items={menuItems}
                onClick={onMenuClick}
                style={{ backgroundColor: '#353535', color: '#fff', flex: 1 }}
            />
            <LogoutContainer>
                <LogoutButton onClick={() => onMenuClick({ key: 'logout' })}>
                    <LogoutOutlined style={{ marginRight: '8px' }} />
                    로그아웃
                </LogoutButton>
            </LogoutContainer>
        </CustomSider>
    );
};

const CustomSider = styled(Sider)`
    background-color: #353535 !important;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    height: 100vh; /* 화면 전체 높이 */
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

const LogoutContainer = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #404040;
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
    border-radius: 8px; /* 둥근 버튼 모양 */
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #b71c1c; /* Hover 시 더 어두운 빨간색 */
        transform: translateX(-50%) scale(1.05); /* Hover 시 살짝 커짐 */
    }

    &:active {
        background-color: #c62828; /* 클릭 시 중간 색상 */
        transform: translateX(-50%) scale(0.95); /* 클릭 시 약간 작아짐 */
    }
`;


export default Header;
