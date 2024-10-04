import apiClient from "./apiClient"

export const loginHandler = async () => {
    try {
        const result = await apiClient.post('/login',{
            role : "AMB",
            id : "testamb",
            password : "testpw"
        })

        console.log(result);

        return {
            status : result.status,
            data : result.data
        }

    } catch(err){
        console.error(err)
    }
}