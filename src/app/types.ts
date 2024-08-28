export type Language = {
    label: string,
    value: string
}

export type APIResponse = {
    error: Error | undefined,
    data: unknown,
    code: number
}

export type Output = {
    stdout: string,
    stderr: string,
    filePath: string
}

export type Room = {
    id: string,
    guestCode: string,
    hostCode: string,
    filePath: string
}