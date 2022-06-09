(() => {
    var currentScript = document.currentScript;
    const maxClicks = 2500;

    var canv = document.createElement("canvas");
    canv.width = window.innerHeight;
    canv.height = window.innerHeight;
    canv.style.zIndex = "999999999";
    canv.style.backgroundColor = "rgba(0,0,0,0)";
    canv.style.position = "fixed";
    canv.style.left = "0";
    canv.style.top = "0";
    canv.style.width = "100vw";
    canv.style.height = "100vh";
    canv.style.overflow = "hidden";
    canv.style.pointerEvents = "none";
    document.body.appendChild(canv);
    /** @type {CanvasRenderingContext2D} */
    var ctx = canv.getContext("2d");
    let pride = false;
    let d = new Date();
    if (
        d.getMonth() === 5 ||
        (document.location.hash && document.location.hash === "#pride")
    ) {
        pride = true;
    }

    function drawDots() {
        canv.width = window.innerWidth;
        canv.height = window.innerHeight;
        let rainbowGr = ctx.createRadialGradient(
            0,
            0,
            0,
            0,
            0,
            Math.sqrt(canv.width * canv.width + canv.height * canv.height)
        );
        rainbowGr.addColorStop(0, "red");
        rainbowGr.addColorStop(1 / 6, "orange");
        rainbowGr.addColorStop(2 / 6, "yellow");
        rainbowGr.addColorStop(3 / 6, "green");
        rainbowGr.addColorStop(4 / 6, "blue");
        rainbowGr.addColorStop(5 / 6, "indigo");
        rainbowGr.addColorStop(6 / 6, "violet");
        ctx.clearRect(0, 0, canv.width, canv.height);
        click_hist.forEach((pt) => {
            ctx.beginPath();
            let x = pt[0];
            let y = pt[1];
            ctx.moveTo(x * canv.width, y * canv.height);
            ctx.arc(x * canv.width, y * canv.height, 6, 0, 2 * Math.PI);
            ctx.closePath();
            if (pride) {
                ctx.fillStyle = rainbowGr;
            } else {
                ctx.fillStyle = "rgba(255,0,0,0.2)";
            }
            ctx.fill();
        });
    }

    var click_hist = localStorage.getItem("tejc_click_history");
    if (click_hist) {
        click_hist = JSON.parse(click_hist);
        requestAnimationFrame(drawDots);
    } else {
        click_hist = [];
    }

    window.addEventListener("resize", (e) => {
        requestAnimationFrame(drawDots);
    });

    var dots_chan = new BroadcastChannel("click_dots");
    document.addEventListener("click", (e) => {
        let w = window.innerWidth;
        let h = window.innerHeight;
        let x = e.clientX / w;
        let y = e.clientY / h;
        click_hist.push([x, y]);
        if (click_hist.length > maxClicks) {
            click_hist.shift();
        }
        // localStorage.setItem("tejc_click_history", JSON.stringify(click_hist));
        dots_chan.postMessage([x, y]);
        requestAnimationFrame(drawDots);
    });

    dots_chan.addEventListener("message", (e) => {
        let x = e.data[0];
        let y = e.data[1];
        click_hist.push([x, y]);
        if (click_hist.length > maxClicks) {
            click_hist.shift();
        }
        drawDots();
    });
    window.addEventListener("beforeunload", (e) => {
        localStorage.setItem("tejc_click_history", JSON.stringify(click_hist));
    });
})();
