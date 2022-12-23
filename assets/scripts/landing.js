const selectedGameMode = document.getElementById("game-modes").value

function redirectToGameMode() {
    if (selectedGameMode === "quote-book") {
        window.location.href = "./index.html";
    }
}
