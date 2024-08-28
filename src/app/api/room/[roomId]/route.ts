import { Room } from "@/app/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, {params} : {
    params: {roomId: string}
}) {
    const { roomId } = params

    let room: Room = {id: "", hostCode: "", guestCode: "", filePath: ""}

    const queryUrl = `${process.env.NEXT_PUBLIC_DB_URL}/${roomId}`
    await fetch(queryUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())
      .then(resData => {
        console.log(resData)
        room = {
            id: resData.id,
            hostCode: resData.hostCode,
            guestCode: resData.guestCode,
            filePath: resData.filePath
        }
      })
      .catch(e => {
        console.log(e)
        return new Response(JSON.stringify({
            error: e,
            data: {},
            code: 500
        }), {status: 500})
      })
    return new Response(JSON.stringify({
        error: {},
        data: {room},
        code: 200
    }), {status: 200})
}
