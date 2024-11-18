import React, { useEffect } from 'react';
import { Layout, Menu, Avatar, message } from 'antd';
import { AppstoreOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const menuItems = [
        {
            key: 'register',
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
                <Avatar size={150} icon={<UserOutlined />} style={{ backgroundColor: '#f1f1f1' }} />
            </ImageContainer>
            <Name>관리자</Name>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname.split('/')[1]]}
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
