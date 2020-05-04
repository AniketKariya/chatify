let isPlaying = false;

const video = document.getElementById('video');
const rad1 = document.getElementById("rad-1"); // Calm Radio
const rad2 = document.getElementById("rad-2"); // Meethi Mirchi
const rad3 = document.getElementById("rad-3"); // Radio Mirchi
const rad4 = document.getElementById("rad-4"); // ESPN - Sports

let currentlyPlaying;

const playRadio = e => {
    const rad1_src = "http://streams.calmradio.com:7028/stream/1/";
    const rad2_src =
        "https://meethimirchihdl-lh.akamaihd.net/i/MeethiMirchiHDLive_1_1@320572/master.m3u8";
    const rad3_src = "http://peridot.streamguys.com:7150/Mirchi";
    const rad4_src = "http://edge.espn.cdn.abacast.net/espn-networkmp3-48";

    if (isPlaying) {
        if (currentlyPlaying.srcElement.id == e.srcElement.id) {
            video.pause();
            e.srcElement.classList.remove("active");
            isPlaying = false;
            return;
        } else {
            currentlyPlaying.srcElement.classList.remove("active");
            currentlyPlaying = e;
            currentlyPlaying.srcElement.classList.add("active");
        }
    } else {
        isPlaying = true;
        e.srcElement.classList.add("active");
        currentlyPlaying = e;
    }

    switch (currentlyPlaying.srcElement.id) {
        case "rad-1":
            bindRadio(rad1_src, false);
            break;
        case "rad-2":
            bindRadio(rad2_src, true);
            break;
        case "rad-3":
            bindRadio(rad3_src, false);
            break;
        case "rad-4":
            bindRadio(rad4_src, false);
            break;
    }
}

const bindRadio = (src, isHLS) => {
    video.src = '';
    if(isHLS) {
        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        }
        // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
        // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element through the `src` property.
        // This is using the built-in support of the plain video element, without using hls.js.
        // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
        // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
        else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoSrc;
            video.addEventListener("loadedmetadata", function () {
                video.play();
            });
        }
    } else {
        video.src = src;
        video.play();
    }
}

rad1.addEventListener("click", e => playRadio(e));
rad2.addEventListener("click", e => playRadio(e));
rad3.addEventListener("click", e => playRadio(e));
rad4.addEventListener("click", e => playRadio(e));
