/**
 * Application是一个接口
 *
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(80);
 */
import express, { Application } from 'express';
import socketIO, { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import path from 'path';
export class Server {
    private httpServer: HTTPServer
    private app: Application
    private io: SocketIOServer
    private readonly DEFAULT_PORT = 5000
    private activeSockets: string[] = []
    constructor() {

        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = socketIO(this.httpServer);
        this.handleRoutes();
        this.setStaticDir();
        this.handleSocketConnection()
    }
    private handleRoutes(): void {
        this.app.get("/", (req, res) => {
            res.send(`<h1>hello,typescript-express</h1>`)
        })
    }
    // 监听端口  /
    public listen(port: number = this.DEFAULT_PORT): void {
        this.httpServer.listen(port, () => {
            console.log(`监听端口为：${port}`)
        })
    }
    // socket 连接处理
    private handleSocketConnection(): void {
        // 存放用户
        let users = new Map();
        // 用户返回信息
        let userInfo:object[]= [];
        this.io.on("connection", function (socket) {
            // 做用户与socketID的映射
            // 每当有新用户加入时，便会触发
            socket.on("userInfo", function (data) {
                if(data.userName === undefined){
                    socket.emit("userList",userInfo)
                    return;
                }
                const userName:string = data.userName;
                users.set(userName,socket.id)
                console.log(users);
                userInfo.push({
                    userName
                })
                // 返回给当前用户最新的用户数组
                socket.emit("userList",userInfo)
            })
            // 接受用户的offer
            socket.on("offerInfo",(data)=>{
                console.log("服务器收到一个发给"+data.to+"的offer");
                const socketID:string = users.get(data.to);
                console.log(socketID);
                // 转发信令
                socket.to(socketID).emit("shareOffer",{
                    offer:data.offer,
                    userName:data.userName
                })
            })
            // 接受用户的answer
            socket.on("answerInfo",(data)=>{
                console.log(data)
                // 要发送给谁
                const socketID = users.get(data.to);
                socket.to(socketID).emit("shareAnswer",{
                    answer:data.answer,
                    userName:data.userName
                })
            })
        })
    }
    // 设置静态目录
    private setStaticDir(): void {
        this.app.use(express.static(path.join(__dirname, "../public")))
    }
}
