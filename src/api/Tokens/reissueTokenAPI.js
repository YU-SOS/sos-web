import { getAuthAxios } from '../authAxios';

const reissueToken = async () => {
  try {
    const authAxios = getAuthAxios();
    const response = await authAxios.get('/reissue-token');

    if (response.status === 200) {
      return {
        statusCode: 200,
        message: "토큰 재발급 성공",
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
