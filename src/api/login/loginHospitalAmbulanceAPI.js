import apiClient from "../apiClient";

const loginHospitalAmbulance = async (id, password) => {
  try {
    const response = await apiClient.post('/login', {
      id,
      password
    });

    return {
      status : response.status,
      body : response.data
    }

  } catch (error) {
    console.error(error);

    if (error.response.status === 403) {
      return {
        status: 403,
        body: {
          message: "블랙리스트된 사용자입니다.",
          userId: error.response.data.data  
        }
      };
    } else if (error.response.status === 404) {
      return {
        status: 404,
        body: {
          message: "사용자 조회 불가"
        }
      };
    }

    return {
      status: error.response.status,
      body: {
        message: "오류 발생"
      }
    };
  }
};

export default loginHospitalAmbulance;
