if ("SharedWorker" in window) {
    const sw = new SharedWorker("/socket_worker.js");
    sw.port.addEventListener("message", (e) => {
        if (e.data.n == "alert") {
            alert(e.data.p[0]);
        }
    });
    sw.port.start();
} else {
    var ws = new WebSocket(`wss://tejc.place:8352/`);
    ws.addEventListener("message", (e) => {
        if (e.data === "heartbeat") {
            return;
        }
        let data = JSON.parse(e.data);
        if (data.n === "alert") {
            alert(data.p[0]);
        }
    });
}
