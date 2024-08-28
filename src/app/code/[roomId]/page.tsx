"use client"

import { endpoints } from "@/app/helpers/url"
import { useEffect, useState } from "react"
import CodeEditor from "../page"
import {io, Socket} from "socket.io-client";

let socket: Socket;

type PropTypes = {
    params: { roomId: string }
}

export default function Room({ params }:PropTypes) {

    const [hostCode, setHostCode] = useState<string>("")
    const [guestCode, setGuestCode] = useState<string>("")
    const [filePath, setFilePath] = useState<string | undefined>("")
    const [codeFromSocket, setCodeFromSocket] = useState<string|undefined>()
    const [langFromSocket, setLangFromSocket] = useState<string|undefined>()
    // const [filePathFromSocket, setFilePathFromSocket] = useState<string|undefined>()
    const [outputFromSocket, setOutputFromSocket] = useState<string|undefined>()
    const [errOutputFromSocket, setErrOutputFromSocket] = useState<string|undefined>()
    const [errFromSocket, setErrFromSocket] = useState<string|undefined>()

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

    // get room detils
    useEffect(() => {
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
        })

        return () => {
            socket.disconnect();
        }
    }, [])

    return <div>
        {/* <div style={{
            position: "absolute", zIndex: 1, right: 5, marginTop: 10, padding: 10,
            backgroundColor: "#ddd", borderRadius: 4, color: "#000"
        }}>
            <ul>
                <li><b>Room details:</b></li>
                <li><b>Host code:</b> {hostCode}</li>
                <li><b>Guest Code:</b> {guestCode}</li>
            </ul>
        </div> */}
        <CodeEditor roomId={params.roomId} socket={socket} codeFromSocket={codeFromSocket} langFromSocket={langFromSocket} filePathFromSocket={filePath} outputFromSocket={outputFromSocket} errOutputFromSocket={errOutputFromSocket} errFromSocket={errFromSocket} />
    </div>
}