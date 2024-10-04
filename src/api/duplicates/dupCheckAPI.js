import { getAuthAxios } from '../authAxios';

const dupCheck = async (id, role) => {
  try {
    const authAxios = getAuthAxios();
    const response = await authAxios.get(`/dup-check?id=${id}&role=${role}`);

    if (response.status === 200) {
      return {
        statusCode: 200,
        message: "사용가능한 아이디입니다.",
      };
    }
  } catch (error) {
    if (error.response.status === 409) {
      return {
        statusCode: 409,
        message: "이미 사용 중인 아이디입니다.",
      };
    }
  }
};

export default dupCheck;
