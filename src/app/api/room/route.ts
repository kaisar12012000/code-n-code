import { Room } from "@/app/types";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";

export async function POST (request: NextRequest) {
    
    const roomId = randomUUID();

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let res1 = "";
    let res2 = "";

    for (let i = 0; i < 6; i++) {
        const randIndx = Math.floor(Math.random()*chars.length);
        res1 += chars[randIndx]
    }

    for (let i = 0; i < 6; i++) {
        const randIndx = Math.floor(Math.random()*chars.length);
        res2 += chars[randIndx]
    }
    
    const hostCode = "HOST_"+res1
    const guestCode = "GUEST_"+res2

    const room: Room = {
         id: roomId, hostCode, guestCode, filePath: ""
    }

    const dbUrl = `${process.env.NEXT_PUBLIC_DB_URL}`;

    try {
        await fetch(dbUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...room,
                createdAt: new Date()
            })
        }).then(response => response.json())
          .then(resData => {
            // console.log(resData)
            // return new Response(JSON.stringify({
            //     error: {}, data: {room: resData}, code: 200
            // }), {status: 200});
            room.id = resData.id
            room.hostCode = resData.hostCode
            room.guestCode = resData.guestCode
            room.filePath = resData.filePath
          })
          .catch(e => {
            throw new Error(e)
          })
    } catch (error) {
        //
        return new Response(JSON.stringify({
            error: error,
            data: {},
            code: 500
        }), {status: 500})
    }

    return new Response(JSON.stringify({
        error: {}, data: {room}, status: 200
    }), {status: 200});

}