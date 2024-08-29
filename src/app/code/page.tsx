"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { render } from "react-dom";
import { Socket } from "socket.io-client";
import brace from "brace";
import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/theme/github"; 
import { endpoints } from "../helpers/url";
import { Language } from "../types";
import Navbar from "../_components/navbar";

type PropTypes = {
    socket: Socket | undefined,
    codeFromSocket: string | undefined,
    outputFromSocket: string | undefined,
    errOutputFromSocket: string | undefined,
    errFromSocket: string | undefined,
    filePathFromSocket: string | undefined,
    langFromSocket: string | undefined,
    roomId: string | undefined,
    isLoading: boolean | undefined
}

export default function CodeEditor ({ socket, codeFromSocket, langFromSocket, filePathFromSocket, outputFromSocket, errOutputFromSocket, errFromSocket, roomId, isLoading }: PropTypes): ReactNode {

    const [lang, setLang] = useState<string | undefined>("js")
    const [code, setCode] = useState<string | undefined>("")
    const [filePath, setFilePath] = useState<string | undefined>("")
    const [output, setOutput] = useState<string | undefined>("")
    const [errOutput, setErrOutput] = useState<string | undefined>("")
    const [err, setErr] = useState<string | undefined>("")
    const [loading, setLoading] = useState<boolean>(false)
    
    const langArr: Language[] = [
        {label: "Javascript", value: "js"},
        {label: "Typescript", value: "ts"},
        {label: "C", value: "c"},
        {label: "C++", value: "cpp"},
        {label: "Go (Golang)", value: "go"},
        {label: "Python", value: "py"}
    ]

    const onChange = (newValue: string): void => {
        setCode(newValue)
        // send new changes via socket
        if (socket) {
            socket.emit("code-change", {code: newValue, lang, filePath, output, errOutput, err, roomId, isLoading: false})
        }
    }

    const runCode = async (): Promise<void> => {
        if(socket) {
            socket.emit("code-change", { code, lang, filePath, output, errOutput, err, roomId, isLoading: true })
        }
        setOutput("")
        setErrOutput("")
        setErr("")
        setLoading(true)
        const url : string = endpoints.postCode()
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({lang, code, file: filePath})
        }).then(resposne => resposne.json())
          .then(data => {
            console.log(data)
            setFilePath(data.data.filePath)
            setOutput(data.data.stdout)
            setErrOutput(data.data.stderr)
            if(data.error) {
                setErr(data.error.message)
            }
            if(socket) {
                socket.emit("code-change", { code, lang, filePath, output, errOutput, err, roomId, isLoading: false })
            }
            setLoading(false)
          })
          .catch(e => {
            console.log(e)
            setErr(e.message)
            setLoading(false)
          })
    }

    const selectLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLang(e.target.value)
        
        if (socket) {
            socket.emit("code-change", {code, lang: e.target.value, filePath, output, errOutput, err, roomId, isLoading: false})
        }
    }


    useEffect(() => {
        console.log("filePath changed", filePath)
        if (socket) {
            socket.emit("code-change", {code, lang, filePath, output, errOutput, err, roomId, isLoading: false})
        }
    }, [filePath])
    useEffect(() => {
        console.log("err changed", err)
        if (socket) {
            socket.emit("code-change", {code, lang, filePath, output, errOutput, err, roomId, isLoading: false})
        }
    }, [err])
    useEffect(() => {
        console.log("output changed", output)
        if (socket) {
            socket.emit("code-change", {code, lang, filePath, output, errOutput, err, roomId, isLoading: false})
        }
    }, [output])

    useEffect(() => {
        if (codeFromSocket !== undefined) {
            if(code !== codeFromSocket) {
                setCode(codeFromSocket)
            }
        }
        if (langFromSocket !== undefined) {
            if(lang !== langFromSocket) {
                setLang(langFromSocket)
            }
        }
        if (filePathFromSocket !== undefined) {
            if(filePath !== filePathFromSocket) {
                setFilePath(filePathFromSocket)
            }
        }
        if (outputFromSocket !== undefined) {
            if(output !== outputFromSocket) {
                setOutput(outputFromSocket)
            }
        }
        if(errOutputFromSocket) {
            if(errOutput !== errOutputFromSocket) {
                setErrOutput(errOutputFromSocket)
            }
        }
        if (errFromSocket !== undefined) {
            if(err !== errFromSocket) {
                setErr(errFromSocket)
            }
        }
        if (isLoading !== undefined) {
            if(isLoading !== loading) {
                setLoading(isLoading)
            }
        }
    }, [codeFromSocket, langFromSocket, filePathFromSocket, outputFromSocket, errFromSocket, errOutputFromSocket])

    return <div className="h-full" style={{height: "90vh"}}>
        <div id="code-editor" className="flex-col h-full">
            <div className="flex-1 w-50 h-3/4">
                <div style={{height: "10%"}}>
                    <select value={lang} className="text-base text-black h-full px-2 mx-2 bg-slate-300" onChange={selectLang}>
                        {langArr.map(item => <option className="text-base text-black" key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                    <button className="bg-violet-900 h-full px-10 hover:bg-violet-600 active:bg-slate-500" type="button" onClick={runCode}>
                        {loading ? <>
                        Running...
                        </> : "Run"}
                    </button>
                </div>
                <AceEditor
                  mode={lang === "py" ? "python" : "javascript"}
                  theme="github"
                  onChange={onChange}
                  name="code-editor"
                  value={code}
                  editorProps={{
                    $blockScrolling: true
                  }}
                  height="90%"
                  width="100%"
                  fontSize={16}
                />
            </div>
            <div className="flex-1 h-1/4 w-50 bg-black">
                <p className="text-xl bg-slate-400 px-10">Output:</p>
                <div className="px-14 py-2">
                    <code style={{ whiteSpace: "pre-line" }}>
                        {output}
                    </code>
                    <code style={{color: "red", whiteSpace: "pre-line"}}>
                        {errOutput}
                        {err}
                    </code>
                </div>
            </div>
        </div>
    </div>
}