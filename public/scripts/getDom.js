import {setCookie,getCookie} from './cookie.js'
import { socket } from './socketDeal.js';
import { callUser } from './webRTC.js';
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const sureUserName = document.getElementById('userNameSure')
const userNameInput = document.getElementById('userNameInput');
const userInfoShow = document.getElementsByClassName('userInfo')[0];
const userList = document.getElementsByClassName('userList')[0];
const targetNameSure = document.getElementById('targetNameSrue');
const targetNameInput = document.getElementById('targetNameInput');
targetNameSure.onclick = ()=>{
    const targetName = targetNameInput.value;
    console.log(targetName)
    callUser(targetName);
}
sureUserName.onclick = ()=>{
    const userName = userNameInput.value;
    userInfoShow.innerText = `您的用户名为:${userName}`;
    // setCookie("userName",userName);
    socket.emit("userInfo",{
        userName:userName
    })
}
userList.onclick = (e)=>{
    const target = e.target;
    if(target.tagName === "UL") return;
    const targetName = target.innerText;
    setCookie("targetName",targetName);
    callUser(targetName);
}
export {
    localVideo,
    remoteVideo,
    sureUserName,
    userNameInput,
    userList,
    targetNameInput
}