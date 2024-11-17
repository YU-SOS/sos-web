import apiClient from "../apiClient"

const hospitalLoginHandler = async (data) => {
    try {
        const response = await apiClient.post('/login', {...data, role : "HOS"});

        const accessToken = response.headers['authorization'];

        if(accessToken)
            localStorage.setItem('accessToken', accessToken);
        else
            console.error('Access Token not found in response : ', response);

        return {
            // status: response.status
            status : 200
        }
    } catch(err){
        console.error(err);
        
        return {
            status: err.response.status
        }
    }
}

export default hospitalLoginHandler;