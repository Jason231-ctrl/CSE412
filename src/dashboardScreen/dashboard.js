document.getElementById("newGameButton").addEventListener("click", newGame);
function newGame()
{
    document.getElementById("newGameIcon").classList.add("newGameTransition");
    setTimeout(() => {
        window.open("../boardScreen/index.html", "_self");
    },4000);
}