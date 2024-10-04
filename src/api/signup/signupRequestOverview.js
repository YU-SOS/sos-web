import { getAuthAxios } from '../authAxios';

const RegistrationRequestOverview = async () => {
    const authAxios = getAuthAxios();
    try {
        const response = await authAxios.get('/registration');

        if (response.status === 200) {
            return {
                statusCode: 200,
                message: "요청이 성공했습니다.",
                data: response.data,
            };
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            return {
                statusCode: 400,
                message: "조회 실패",
            };
        }
        return {
            statusCode: error.response ? error.response.status : 500,
            message: "오류 발생",
        };
    }
};

export default RegistrationRequestOverview;
