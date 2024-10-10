// reissueTokenAPI.js
import { getAuthAxios } from '../api/authAxios';

const reissueToken = async () => {
  try {
    const authAxios = getAuthAxios();
    const response = await authAxios.get('/reissue-token');

    if (response.status === 200 && response.data.token) {
      return {
        statusCode: 200,
        message: "토큰 재발급 성공",
        token: response.data.token
      };
    } else {
      return {
        statusCode: 401,
        message: "토큰이 유효하지 않습니다. 다시 로그인하세요.",
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      message: "토큰 재발급 실패",
    };
  }
};

export default reissueToken;
