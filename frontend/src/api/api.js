import Vue from 'vue';

async function getIdToken(){
    const tokenId = await Vue.auth.getIdTokenClaims();
    const tokenIdRaw = tokenId.__raw
    return tokenIdRaw
}

export async function getUploadURL(recipeId){
    const tokenId = await getIdToken();
    const response = await this.$http.post(`${this.$api_endpoint}/recipe/${recipeId}/attachment`,'',{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenId}`
        }
    })
    return response.data.uploadUrl
}

export async function uploadFile(uploadUrl, file){
    await this.$http.put(uploadUrl,file)
}


export async function getRecipe(recipeId){
    try{
        const tokenId = await getIdToken()
        const response = await this.$http.get(`${this.$api_endpoint}/recipe/${recipeId}`,{
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenId}`
            }
            });
        const recipe = response.data.item;
        return recipe
    }
    catch(e){
        console.log(e)
    }
}

export async function updateRecipe(recipeId, body){
    try{
        const tokenId = await getIdToken()
        await this.$http.patch(`${this.$api_endpoint}/recipe/${recipeId}`,JSON.stringify(body),{
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${tokenId}`
            }
        });
    }catch(error){console.log(error)}
}
