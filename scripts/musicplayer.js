let aud = new Audio("audio/menu.wav")
aud.loop = true;
function openGame() {
    window.open("game.html")
    aud.currentTime = 0;
    aud.pause()
}