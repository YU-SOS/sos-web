import React, { useEffect } from 'react';
import axios from 'axios';

const KakaoLogin = () => {
  useEffect(() => {
    // Load Kakao SDK on component mount
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('YOUR_KAKAO_APP_KEY'); // Replace with your Kakao app key
    }
  }, []);

  const handleKakaoLogin = () => {
    // Trigger Kakao login
    window.Kakao.Auth.login({
      success: function (authObj) {
        // After successful login, get user info
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: function (response) {
            const { id, kakao_account } = response;
            const name = kakao_account.profile.nickname;
            const email = kakao_account.email;
            const providerId = id;
            const provider = 'kakao'; // Fixed for Kakao

            // Send login data to backend
            loginUser({ name, providerId, provider, email });
          },
          fail: function (error) {
            console.log('Failed to fetch Kakao user data', error);
          }
        });
      },
      fail: function (err) {
        console.log('Kakao login failed', err);
      }
    });
  };

  const loginUser = async (userData) => {
    try {
      const response = await axios.post('/login/user', userData);
      const { statusCode, message, access_token, refresh_token } = response.data;

      if (statusCode === 200) {
        console.log(message); // "로그인 성공"
        // Store tokens (optional)
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
      } else {
        console.log(message); // Handle error cases (404, 510, etc.)
      }
    } catch (error) {
      console.error('Login request failed', error);
    }
  };

  return (
    <div>
      <h1>Login with Kakao</h1>
      <button onClick={handleKakaoLogin}>Kakao Login</button>
    </div>
  );
};

export default KakaoLogin;
