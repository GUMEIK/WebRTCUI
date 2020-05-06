function getCookie(key){
    const cookieStr = document.cookie;
    const cookieArr = cookieStr.split("; ");
    const cookieObj = {};
    for(let i = 0,len = cookieArr.length;i < len;i++){
        const KV = cookieArr[i].split("=");
        cookieObj[KV[0]] = KV[1];
    }
    if(key){
        return cookieObj[key];
    }
    return cookieObj;
}

function setCookie(key,value){
    document.cookie = `${key}=${value}`;
}
export {getCookie,setCookie}