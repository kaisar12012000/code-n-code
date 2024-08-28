import { APIResponse, Output } from "@/app/types";
import { exec } from "child_process";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { NextRequest } from "next/server";
import path from "path";
import { platform } from "os"


function genrateCodeFile (ext: string, code: string, filePath: string = ""): string {
    // console.log(__dirname);
    const fileLoc = path.join(__dirname, "codeFiles");

    if (filePath === "") {
        if (!existsSync(fileLoc)) mkdirSync(fileLoc, {recursive: true});

        const jobId = randomUUID();
        const fileName = `${jobId}.${ext}`
        
        filePath = path.join(fileLoc, fileName)
    }

    writeFileSync(filePath, code)

    return filePath

}

export async function POST (request: NextRequest) {
    const data = await request.json()

    const { code, lang, file } = data;

    let output: Output = {stderr : "", stdout: "", filePath: ""};
    let resBody: APIResponse = { data: output, code: 200, error: undefined};
    let command: string = "";

    const filePath = genrateCodeFile(lang, code, file)

    switch(lang) {
        case "js":
            command = `node "${filePath}"`
            break;
        case "py":
            command = `py "${filePath}"`
            break;
        case "ts":
            command = `tsc "${filePath}" && node "${filePath.replace(".ts", ".js")}"`
            break;
        case "c":
            const cOutputFileName = platform() === "win32" ? "program" : "./program";
            command = `gcc ${filePath} -o program && ${cOutputFileName}`;
            break;
        case "cpp":
            const cppOutputFileName = platform() === "win32" ? "program" : "./program";
            command = `g++ ${filePath} -o program && ${cppOutputFileName}`;
            break;
        case "go":
            command = `go run ${filePath}`;
            break;
        default:
            resBody.code = 400
            resBody.error = new Error()
            resBody.error.message = "Unknown language selected."
            break;
    }
    
    console.log(command)

    if(command.length>0) {
        await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                
                if (!stdout) {
                    if (error) {
                        resBody.error = error
                        resBody.code = 500
                        resolve(error)
                    }
                    output.stderr = stderr
                    resolve(stderr)
                }

                output.stdout = stdout
                resolve(stdout)

            })
        })
    }

    console.log(output, 39)

    return new Response(JSON.stringify(resBody), {
        status: resBody.code
    })
}