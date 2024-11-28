import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import loginAdminAPI from '../../api/login/loginAdminAPI';
import loginHospitalAPI, {newlogin} from '../../api/login/loginHospitalAPI';
import SOSLogo from "../SOS_Logo.png";
import loginHospital from "../../api/login/loginHospitalAPI";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('HOS');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (key) => {
    setRole(key);
  };

  const handleSubmit = async (values) => {
    const { id, password } = values;
    setLoading(true);

    try {
      let result;
      if (role === 'HOS') {
        result = await loginHospital(id, password, role);
      } else {
        result = await loginAdminAPI({ adminId: id, password });
      }
        if (result.status === 200) {
        notification.success({ message: '로그인 성공!', description: '환영합니다.' });
        if (role === 'HOS') {
          localStorage.setItem('HospitalDoctorLoggedIn', true);
          navigate('/hospital/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      } else if (result.status === 403) {
            let message = result.message;
            console.log(result.message);
          if (message === 'GUEST') {
              notification.error({ message: '로그인 실패', description: '승인 대기 중입니다.' });
          } else if (message == 'BLACKLIST') {
              notification.error({ message: '로그인 실패', description: '블랙리스트된 사용자입니다.' });
          } else {
              notification.error({ message: '로그인 실패', description: '접근이 거부되었습니다.' });
          }
      } else {
          notification.error({ message: '로그인 실패', description: '다시 시도해주세요.' });
      }
    } catch (error) {
      notification.error({ message: '오류', description: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5',
            overflow: 'hidden',
          }}
      >
        <div style={{ width: '400px', height: '450px', padding: '20px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px', backgroundColor: '#fff' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={SOSLogo} alt="SOS Logo" style={{ width: '200px', height: '150px', objectFit: 'contain' }} />
          </div>
          <Tabs defaultActiveKey="HOS" onChange={handleTabChange} centered>
            <Tabs.TabPane tab="병원 로그인" key="HOS">
              <Form
                  name="hospital_login"
                  onFinish={handleSubmit}
                  layout="vertical"
                  style={{ maxWidth: '100%' }}
              >
                <Form.Item
                    name="id"
                    rules={[
                      { required: true, message: '아이디를 입력하세요.' },
                      {
                        validator: (_, value) =>
                            value && (/\s/.test(value) || /^[0-9]+$/.test(value))
                                ? Promise.reject(new Error('아이디는 공백 없이 문자와 숫자를 조합해 입력해주세요.'))
                                : Promise.resolve(),
                      },
                    ]}
                >
                  <Input size="large" prefix={<UserOutlined />} placeholder={role === 'HOS' ? "병원 아이디" : "관리자 아이디"} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: '비밀번호를 입력하세요.' },
                      {
                        validator: (_, value) =>
                            value && /\s/.test(value)
                                ? Promise.reject(new Error('비밀번호에 공백 문자를 포함할 수 없습니다.'))
                                : Promise.resolve(),
                      },
                    ]}
                >
                  <Input.Password size="large" prefix={<LockOutlined />} placeholder="비밀번호" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block size="large">
                    병원 로그인
                  </Button>
                </Form.Item>
                <Button type="link" onClick={() => navigate('/signup/hospital')}>
                  회원가입하기
                </Button>
              </Form>
            </Tabs.TabPane>
            <Tabs.TabPane tab="관리자 로그인" key="ADMIN">
              <Form
                  name="admin_login"
                  onFinish={handleSubmit}
                  layout="vertical"
                  style={{ maxWidth: '100%' }}
              >
                <Form.Item
                    name="id"
                    rules={[
                      { required: true, message: '아이디를 입력하세요.' },
                      {
                        validator: (_, value) =>
                            value && (/\s/.test(value) || /^[0-9]+$/.test(value))
                                ? Promise.reject(new Error('아이디에 공백 문자 또는 숫자만 입력할 수 없습니다.'))
                                : Promise.resolve(),
                      },
                    ]}
                >
                  <Input size="large" prefix={<UserOutlined />} placeholder="관리자 아이디" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: '비밀번호를 입력하세요.' },
                      {
                        validator: (_, value) =>
                            value && /\s/.test(value)
                                ? Promise.reject(new Error('비밀번호에 공백 문자를 포함할 수 없습니다.'))
                                : Promise.resolve(),
                      },
                    ]}
                >
                  <Input.Password size="large" prefix={<LockOutlined />} placeholder="비밀번호" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block size="large">
                    관리자 로그인
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
  );
};

export default Login;
