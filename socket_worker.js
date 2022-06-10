addEventListener("connect", (/** @type {MessageEvent} */ e) => {
    let port = e.ports[0];
    let ws = new WebSocket(`wss://tejc.place:8352/`);
    var loggedIn = false;
    ws.addEventListener("message", (e) => {
        let data = JSON.parse(e.data);
        if (data.n === "status") {
            if (data.p[0] === "login") {
                loggedIn = true;
            } else if (data.p[0] === "logout") {
                loggedIn = false;
            }
        }
        port.postMessage(data);
    });

    function makeMessage(args) {
        if (args.length > 0) {
            let msg = {};
            msg.n = args[0];
            if (args.length > 1) {
                msg.p = args.slice(1);
            }
            return msg;
        }
    }

    port.addEventListener("message", (e) => {
        if (e.data[0] === "localstatus" && loggedIn) {
            port.postMessage(makeMessage(["localstatus", "login"]));
            return;
        }
        let msg = makeMessage(e.data);
        if (msg) {
            ws.send(JSON.stringify(msg));
        }
    });

    port.start();
});
