function remove_format() {
    var sel = window.getSelection();

    var newdiv = document.createElement('div');
    newdiv.style.position='absolute';
    newdiv.style.left='-99999px';
    newdiv.innerHTML = sel.toString().replace(/\s+/g, ' ');

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(newdiv);
    sel.selectAllChildren(newdiv);
    window.setTimeout(function() {
        body.removeChild(newdiv);
    }, 0);

    return true;
}

let content = null;
let player = null;
let button = null;
let decoded = false;
let first = true;

let what = null;

$(document).ready(function () {
    var url = '.';
    var pixelPerSecond = 85; // number of milliseconds the animation will take
    var topOffset = 150;

    $('body').append('<img src="' + url + '/nyancat.gif" id="image" width="100" style="position:fixed;z-index:9999;left:-100px;top:'+topOffset+'px;"/>');
    var img = $("img#image");

    $('body').append('<audio loop id="sound" preload="auto"><source src="' + url + '/nyancat.ogg" type="audio/ogg"/><source src="' + url + '/nyancat.mp3" type="audio/mp3" /></audio>');
    var sound = $("#sound").get(0);

    var nyancat_stop = function () {
        //no sound control if not in HTML5
        if (sound.volume != undefined) {
            sound.pause();
            sound.currentTime = 0;
            sound.volume = 1;
        } else {
            $("#sound-ie").remove();
        }
        img.css("left", "-100px");
    };


    var w = $(window).width();
    var h = $(document).height();


    function nyancat_step(p, fx) {
        s = Math.sin(20*p / w);
        y = curTop +s * 100;
        var move = {top: y + "px", left: p + "px"};
        $(fx.elem).css(move);
    }

    var curTop = topOffset;
    function nyancat_run() {
        curTop = Math.floor(Math.random() * (h-2*topOffset+1) + topOffset);
        img.css({ left: "-100px", top: curTop + "px"});

        img.show();
        img.animate({'left': w }, {step: nyancat_step, easing: "linear", duration: 1000* w /pixelPerSecond, complete: nyancat_run});
    }

    function nyancat_start() {
        //no sound control if not in HTML5
        if (sound.volume != undefined) {
            sound.play();
        }
        else {
            $('body').append('<embed id="sound-ie" src="' + url + '/nyancat.mp3" type="application/x-mplayer2" autostart="true" playcount="true" loop="true" height="0" width="0">');
        }
        nyancat_run();
    };

    content = document.getElementById("content");
    player = document.getElementById("player");
    button = document.getElementById("button");
    what = document.getElementById("what");

    nyancat_start();



    //$("#sound").on('timeupdate', function () {});
});


function action() {
    if (first) {
        alert("LOL. Stalker. FWIW.");
        alert("Malware installed.");
        alert("Joke.");
        first = false;
        document.getElementById("itemhead").innerHTML = "Live Forever";
    }

    if (decoded) {
        content.innerHTML = "a741656b3883a89c1f0b3f5a3e1f1d82c38264f34b36e11543b69ca68e17f1d4";
        button.innerHTML = "Unhash";
        decoded = false;
    } else {
       content.innerHTML = '"Maybe you\'re the same as me, we see things they\'ll never see"';
       button.innerHTML = "Hash";
       decoded = true;
    }
    
    player.style.visibility = "visible";
    what.style.visibility = "visible";
}
