
const data = {}

data.getAllPost = async ()=>{
    let response = await fetch('/data')
    let res = await response.json()
    return res
}

data.getPostToComment = async (id) =>{
    let response = await fetch('/postComment/'+id)
    let res = await response.json()
    return res
}

data.getMyPost = async (id) =>{
    let response = await fetch('/my_posts')
    let res = await response.json()
    return res
}



export default data;