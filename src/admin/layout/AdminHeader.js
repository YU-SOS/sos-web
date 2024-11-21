import React, { useEffect } from 'react';
import { Layout, Menu, message } from 'antd';
import {AppstoreOutlined, HomeOutlined, LogoutOutlined} from '@ant-design/icons';
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
                    src={SOSLogo}
                    alt="SOS Logo"
                    style={{
                        margin: '16px',
                        width: '200px',
                        height: '200px',
                        objectFit: 'contain'}}
                />
            </ImageContainer>
            <Name>관리자</Name>
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

export default Header;
