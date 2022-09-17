var ws = new WebSocket(`wss://ws.tejc.place/`);
var loggedIn = false;
var ports = [];
addEventListener("connect", (/** @type {MessageEvent} */ e) => {
    let port = e.ports[0];
    // ports.push(port);

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

    ws.addEventListener("message", (e) => {
        if (e.data === "heartbeat") {
            port.postMessage(makeMessage(["heartbeat"]));
            return;
        }
        let data = JSON.parse(e.data);
        if (data.n === "status") {
            if (data.p[1] === "login") {
                loggedIn = true;
            } else if (data.p[1] === "logout") {
                loggedIn = false;
            }
        }
        port.postMessage(data);
    });

    port.addEventListener("message", (e) => {
        // console.log(e);
        if (e.data[0] === "localstatus") {
            if (loggedIn) {
                port.postMessage(makeMessage(["localstatus", "login"]));
            }
            return;
        }
        let msg = makeMessage(e.data);
        if (msg) {
            let data = JSON.stringify(msg);
            ws.send(data);
        }
    });

    port.start();
});
