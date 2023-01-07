(() => {
    var canv = document.createElement("canvas");
    canv.id = "snow";
    canv.width = window.innerWidth;
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
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
    ctx.font = "30px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const emojis = ["❄️"];
    const speedBase = 0.01 * canv.height;
    const particleCount = 100;

    let particles = new Array(particleCount);

    let direction = Math.random() < .5 ? 1 : -1;

    let drawPaused = false;

    // canv.onclick = () => {drawPaused = !drawPaused};

    function choice(list) {
        if (list.length == 1) {
            return list[0];
        }
        return list[Math.floor(Math.random() * list.length)];
    }

    function generateParticle() {
        let x = Math.floor(Math.random() * canv.width);
        let y = Math.floor(Math.random() * canv.height);
        let speed = Math.random() + .5;
        let speed2 = direction * (Math.random() + .5);
        let type = choice(emojis);
        return [x, y, speed, speed2, type];
    }

    function camouflageParticle(p) {
        p[2] = Math.random() + .5;
        p[3] = direction * (Math.random() + .5);
    }

    for (let i = 0; i < particleCount; i++) {
        particles[i] = generateParticle();
    }

    function drawParticles() {
        if (!drawPaused) {
            ctx.clearRect(0, 0, canv.width, canv.height);
            for (let i = 0; i < particles.length; i++) {
                let particle = particles[i];
                ctx.fillText(particle[4], particle[0], particle[1]);
            }
        }
        requestAnimationFrame(drawParticles);
    }

    function simulateParticles() {
        for (let i = 0; i < particles.length; i++) {
            let particle = particles[i];
            if (particle[1] > canv.height) {
                particle[1] = -(particle[1] % canv.height) - 36;
                camouflageParticle(particle);
            } else {
                particle[1] += particle[2] * speedBase;
            }
            if (particle[0] > canv.width) {
                particle[0] = -(particle[0] % canv.width) - 36;
                camouflageParticle(particle);
            } else if (particle[0] < 0 && direction === -1) {
                particle[0] = canv.width + particle[0] + 36;
                camouflageParticle(particle);
            } else {
                particle[0] += particle[3] * speedBase;
            }
        }
    }

    function windChange() {
        let change = Math.random();
        for (let i = 0; i < particles.length; i++) {
            particles[i][3] *= 0.95 + change * 0.1;
        }
    }

    setInterval(simulateParticles, 1000 / 30);
    requestAnimationFrame(drawParticles);
    setInterval(windChange, 1000 / 10);
    window.addEventListener("resize", (e) => {
        canv.width = window.innerWidth;
        canv.height = window.innerHeight;
    });
})();
