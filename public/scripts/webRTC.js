import { localVideo ,remoteVideo, userNameInput,userList} from "./getDom.js";
import {socket} from './socketDeal.js'
import { getCookie } from "./cookie.js";
let { RTCPeerConnection, RTCSessionDescription } = window;
export let peerConnection = new RTCPeerConnection();
async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localVideo.srcObject = stream;
}
export async function callUser(targetName) {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    // const userName = getCookie("userName");
    console.log(targetName)
    const userName = userNameInput.value;
    socket.emit("offerInfo", {
        offer,
        to: targetName,
        userName:userName
    });
}

// 接收所有用户连接信息
// [{userName:jfkfjfjf}
socket.on("userList",(dataArr)=>{
    userList.innerHTML = '';
    for(let i = 0,len = dataArr.length;i<len;i++){
        const liDom = document.createElement('li');
        liDom.classList.add("list-group-item");
        liDom.innerText = dataArr[i].userName;
        userList.appendChild(liDom);
    }
})
socket.on("shareOffer", async (data) => {
    alert("收到一个来自"+data.userName+"的offer")
    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
    );
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    // const userName = getCookie("userName");
    // const targetName = getCookie("targetName");

    const userName = userNameInput.value;
    const targetName = targetNameInput.value;
    console.log(targetNameInput)
    console.log(userName)
    console.log(targetName)
    socket.emit("answerInfo", {
        answer:answer,
        to: targetName,
        userName: userName
    })
})
socket.on("shareAnswer", async (data) => {
    alert("answer")
    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
    );
})
peerConnection.ontrack = function (e) {
    if (remoteVideo) {
        remoteVideo.srcObject = e.streams[0];
    }
};
navigator.getUserMedia(
    { video: true, audio: true },
    stream => {
        const localVideo = document.getElementById("localVideo");
        if (localVideo) {
            localVideo.srcObject = stream;
        }
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    },
    error => {
        console.warn(error.message);
    }
);
// start()
