import apiClient from "./apiClient"

const loginHandler = async () => {
    try {
        const result = await apiClient.post('/login',{
            role : "HOS",
            id : "test",
            password : "test"
        })

        return {
            status : result.status,
            data : result.data
        }

    } catch(err){
        console.error(err)
    }
}
export default loginHandler;