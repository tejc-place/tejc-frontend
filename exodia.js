/*
    data-exodia-url = url for this exodia piece for the current page
    data-is-exodia-main = 1 if this is the main exodia page, 0 or undefined otherwise. shouldn't be used more than once.
    data-piece-count = amount of pages needed to activate exodia on all pages. count includes the main exodia page
    data-cooldown = secondary exodia parts notify their identifier (url probably) every cooldown ms    
                    main exodia checks every cooldown+500 ms if enough other parts exist then tells other
                    exodia parts to activate for cooldown+1000 ms. default to 1000
*/
(() => {
    var currentScript = document.currentScript;
    var isExodiaMain = false;
    var exodiaUrl = '';
    if ('exodiaUrl' in currentScript.dataset) {
        exodiaUrl = currentScript.dataset.exodiaUrl;
        if (currentScript.dataset.isExodiaMain) {
            isExodiaMain = true;
        }
    }

    var activation_chan = new BroadcastChannel('exodia_activation');
    var identifier_chan = new BroadcastChannel('exodia_names');
    var cooldown = parseInt(currentScript.dataset.cooldown) || 1000;

    var exodiaDiv = document.createElement('div');
    var exodiaImg = document.createElement('img');
    exodiaImg.src = exodiaUrl;
    exodiaDiv.style.visibility = 'hidden';
    exodiaDiv.style.zIndex = 999999;
    exodiaDiv.style.position = 'absolute';
    exodiaDiv.style.left = 0;
    exodiaDiv.style.top = 0;
    exodiaDiv.style.overflow = 'hidden';
    exodiaDiv.style.width = '100vw';
    exodiaDiv.style.height = '100vh';
    exodiaDiv.style.background = '#7F7F7F';

    exodiaDiv.appendChild(exodiaImg);
    document.body.appendChild(exodiaDiv);

    var deactivationTimeoutId;
    var initialBodyOverflow;

    function activatePart(deactivationDelay) {
        exodiaDiv.style.visibility = 'visible';
        initialBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        if (deactivationTimeoutId) {
            clearInterval(deactivationTimeoutId);
            console.log('aboerting cancel')
            deactivationTimeoutId = null;
        }
    }
    
    function deactivatePart() {
        deactivationTimeoutId = null;
        exodiaDiv.style.visibility = 'hidden';
        if (initialBodyOverflow) {
            document.body.style.overflow = initialBodyOverflow;
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    if (isExodiaMain) {
        var totalCountNeeded = currentScript.dataset.pieceCount;
        if (totalCountNeeded) {
            var otherParts = new Set();
            setInterval(() => {
                if ((otherParts.size + 1) >= totalCountNeeded) {
                    activation_chan.postMessage({
                        cmd: 'activate',
                        duration: cooldown + 1000
                    });
                    activatePart(cooldown + 1000);
                }
                otherParts.clear();
            }, cooldown + 500);
            identifier_chan.addEventListener('message', e => {
                otherParts.add(e.data.toString());
                console.log(otherParts.size);
            });
            activation_chan.addEventListener('message', e => {
                if ('cmd' in e.data) {
                    if (e.data.cmd === 'deactivate') {
                        deactivatePart();
                        otherParts.clear();
                    }
                }
            });
        }
    } else {
        setInterval(() => {
            identifier_chan.postMessage(exodiaUrl);
        }, cooldown);
        activation_chan.addEventListener('message', e => {
            if ('cmd' in e.data) {
                if (e.data.cmd === 'activate') {
                    activatePart(e.data.duration || cooldown + 1000);
                } else if (e.data.cmd === 'deactivate') {
                    deactivatePart();
                }
            }
        });
        window.addEventListener('beforeunload', e => {
            activation_chan.postMessage({
                cmd: 'deactivate'
            });
        });
        console.log('not main exodia');
    }
})();
