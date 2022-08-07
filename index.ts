import { Errorlike, Serve } from "bun";

enum LogType {
    INFO,
    WARN,
    ERROR
}

function logRequest(request: Request | Errorlike, type: LogType) {
    let method: string;
    let url: string;
    let logType: string;
    switch(type) {
        case LogType.INFO:
            logType = 'INFO';
            break;
        case LogType.WARN:
            logType = 'WARN';
            break;
        case LogType.ERROR:
            logType = 'ERROR';
            break;
        default:
            logType = 'DEBUG';
            break
    }
    if(request instanceof Request) {
        method = request.method;
        url = request.url;
        console.log(`${logType}\t${method} - ${url}`)
    }
    else{
        console.log(`${logType}\t${request.code} - ${request.message}`);
    }
}

const serveOptions: Serve = {
    fetch: async (request: Request) => {
        logRequest(request, LogType.INFO);
        return new Response(JSON.stringify({
            status: 'SUCCESS',
            message: 'Hello world'
        }),{
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    error: (request: Errorlike) => {
        logRequest(request, LogType.ERROR);
        return new Response(JSON.stringify({
            status: 'ERROR',
            message: 'Something went wrong!'
        }),{
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    hostname: '0.0.0.0',
    port: 8080
}

try {
    console.log(`Server started on ${serveOptions.hostname} and port ${serveOptions.port}`);
    Bun.serve(serveOptions);
}
catch(e) {
    console.error(e);
}