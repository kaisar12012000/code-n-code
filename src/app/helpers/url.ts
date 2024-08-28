export const endpoints = {
    postCode: () : string => `${process.env.NEXT_PUBLIC_BASE_URL}api/code`,
    createRoom: () : string => `${process.env.NEXT_PUBLIC_BASE_URL}api/room`,
    getRoomDetails: (id: string): string => `${process.env.NEXT_PUBLIC_BASE_URL}api/room/${id}`,
    getCodeFromSocketServer: (): string => `${process.env.NEXT_PUBLIC_SOCKET_URL}code`,
}