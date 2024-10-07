import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../../components/StyledComponents';
import loginAdminAPI from '../../api/login/loginAdminAPI';

const LoginAdmin = () => {
    const navigate = useNavigate();
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await loginAdminAPI({
                adminId,
                password,
            });

            if (result.status === 200) {
                setSuccess('로그인 성공!');
                setError('');
                navigate('/admin/dashboard');
            } else {
                setError('로그인에 실패했습니다. ID 또는 비밀번호를 확인하세요.');
            }
        } catch (e) {
            console.error(e);
            setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
            setSuccess('');
        }
    };

    return (
        <FormContainer>
            <h1>관리자 로그인</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" primary>로그인</Button>
            </form>
        </FormContainer>
    );
};

export default LoginAdmin;
