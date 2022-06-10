const sw = new SharedWorker("/socket_worker.js");
sw.port.addEventListener("message", (e) => {
    if (e.data.n == "alert") {
        alert(e.data.p[0]);
    }
});
sw.port.start();
