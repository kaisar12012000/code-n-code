"use client"

import { endpoints } from "@/app/helpers/url"
import React, { useEffect, useState } from "react"
import CodeEditor from "../page"
import {io, Socket} from "socket.io-client";

let socket: Socket;

type PropTypes = {
    params: { roomId: string }
}

export default function Room({ params }:PropTypes) {

    const [isHost, setIsHost] = useState<boolean>(false)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | boolean>(false)
    const [roomCode, setRoomCode] = useState<string>("");
    const [name, setName] = useState<string>("")
    const [tabIndex, setTabIndex] = useState<number>(0)
    const [hostCode, setHostCode] = useState<string>("")
    const [guestCode, setGuestCode] = useState<string>("")
    const [filePath, setFilePath] = useState<string | undefined>("")
    const [codeFromSocket, setCodeFromSocket] = useState<string|undefined>()
    const [langFromSocket, setLangFromSocket] = useState<string|undefined>()
    // const [filePathFromSocket, setFilePathFromSocket] = useState<string|undefined>()
    const [outputFromSocket, setOutputFromSocket] = useState<string|undefined>()
    const [errOutputFromSocket, setErrOutputFromSocket] = useState<string|undefined>()
    const [errFromSocket, setErrFromSocket] = useState<string|undefined>()
    const [isLoading, setIsLoading] = useState<boolean|undefined>()
    const [loginMsg, setLoginMsg] = useState<string>("")
    const [showRoomDetails, setShowRoomDetails] = useState<boolean>(false)

    // const socket = io(`/code/${params.roomId}`);

    const getCodeFromSocketServer = async () => {
        const url = endpoints.getCodeFromSocketServer();
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                roomId: params.roomId
            })
        }).then(res => res.json())
          .then(resData => {
            console.log("Code from server", resData, 40)
            setCodeFromSocket(resData.codeData)
          })
    }

    const getRoomDetails = async () => {
        await fetch(endpoints.getRoomDetails(params.roomId), {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
          .then(resData => {
            console.log(resData)
            // setRoom(resData.data.room)
            setHostCode(resData.data.room.hostCode)
            setGuestCode(resData.data.room.guestCode)
            setFilePath(resData.data.room.filePath)
          })
          .catch(e => {
            console.log(e)
          })
    }

    const findEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const key = e.key;
        if (key === "Enter") {
            setTabIndex(1)
        }
    }

    const matchRoomCode = () => {
        // setRoomCode(e.target.value)
        if (roomCode.startsWith("HOST")) {
            if (roomCode === hostCode) {
                setIsLoggedIn(true)
                localStorage.setItem("role", "host")
                setIsHost(true)
            } else {
                setLoginMsg("Incorrect code! Please check your Host code or login with your guest code.")
            }
        } else if (roomCode.startsWith("GUEST")) {
            if(roomCode === guestCode) {
                setIsLoggedIn(true)
                localStorage.setItem("role", "guest")
            } else {
                setLoginMsg("Incorrect code! Please check your HostGuest code or login with your host code.")
            }
        } else {
            setLoginMsg("Incorrect code! Please check your Host/Guest code.")
        }
    }

    // get room detils
    useEffect(() => {
        if(localStorage.getItem("role") === "host") {
            setIsHost(true)
            setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true")
            console.log("Host machine")
        }
        getRoomDetails()
        getCodeFromSocketServer()
    }, [])

    // socket
    useEffect(() => {
        socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`);

        // console.log(socket)

        socket.on("code-change", (data) => {
            console.log("code has changed", data)
            setCodeFromSocket(data.code)
            setLangFromSocket(data.lang)
            setFilePath(data.filePath)
            setOutputFromSocket(data.output)
            setErrOutputFromSocket(data.errOutput)
            setErrFromSocket(data.err)
            setIsLoading(data.isLoading)
        })

        return () => {
            socket.disconnect();
        }
    }, [])

    return <div>
        {!isLoggedIn && <div style={{
            position: "fixed", zIndex: 10, top: 0, left: 0, backdropFilter: "blur(10px)", display: "flex", justifyContent: "center",
            alignItems: "center", height: "100%", width: "100%"
        }}>
            <div className="rounded container bg-slate-900 text-center py-5">
                {tabIndex === 0 ? 
                    <span className="container block w-full flex justify-center py-5">
                        <input className="px-5 py-5 rounded-s w-1/2 text-black" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name..." />
                        <button type="button" className="rounded-e px-5 py-5 border-2 text-xl hover:bg-slate-600" onClick={() => setTabIndex(1)}>
                            &#8594;
                        </button>
                    </span>
                    :
                    <span className="container block w-full flex-col justify-center py-5">
                        <input className="px-5 py-5 rounded-s border-2 w-1/2 mb-5 text-black" type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="Enter room code..." />
                        <button type="button" className="rounded-e px-5 py-5 border-2 hover:bg-slate-600" onClick={matchRoomCode}>
                            Enter room
                        </button>
                    </span>
                }
                <small style={{ color: "red" }}>{loginMsg}</small>
            </div>
        </div>}
        {isHost && <div style={{
            position: "absolute", zIndex: 1, right: 5
        }}>
            {showRoomDetails ? <div style={{
                marginTop: 10, padding: 10,
            backgroundColor: "#ddd", borderRadius: 4, color: "#000"
            }}>
                <ul>
                    <li><b>Room details:</b></li>
                    <li><b>Host code:</b> {hostCode}</li>
                    <li><b>Guest Code:</b> {guestCode}</li>
                </ul>
                <center>
                    <button onClick={() => setShowRoomDetails(false)}>
                        <small>Hide</small>
                    </button>
                </center>
            </div> : <button onClick={() => setShowRoomDetails(true)} style={{
                marginTop: 10, padding: 10,
            }}>
                &#9432; Show room details
            </button>}
        </div>}
        <CodeEditor
         roomId={params.roomId} 
         socket={socket} 
         codeFromSocket={codeFromSocket} 
         langFromSocket={langFromSocket} 
         filePathFromSocket={filePath} 
         outputFromSocket={outputFromSocket} 
         errOutputFromSocket={errOutputFromSocket} 
         errFromSocket={errFromSocket}
         isLoading={isLoading}
         />
    </div>
}