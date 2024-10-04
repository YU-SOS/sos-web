import { getAuthAxios } from '../authAxios'; 

const loginHospitalAmbulance = async (id, password) => {
  try {
    const authAxios = getAuthAxios();  
    const response = await authAxios.post('/login', {
      id,
      password
    }); 

    if (response.status === 200) {
      return {
        statusCode: 200,
        message: "로그인 성공",  
        access_token: response.data.access_token,  
        refresh_token: response.data.refresh_token 
      };
    }
  } catch (error) {
    if (error.response.status === 403) {
      return {
        statusCode: 403,
        message: "블랙리스트된 사용자입니다.",
        userId: error.response.data 
      };
    } else if (error.response.status === 404) {
      return {
        statusCode: 404,
        message: "사용자 조회 불가",
      };
    }
    return {
      statusCode: error.response.status,
      message: "오류 발생",
    };
  }
};

export default loginHospitalAmbulance;
