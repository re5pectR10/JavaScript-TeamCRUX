var menu = document.getElementById('menu');
var endGame = document.getElementById('end-game');

/**
 * Hide element
 */
function hide(el) {
    el.style.display = 'none';
}


/**
 * Show element
 */
//function show(el) {
//    el.style.display = 'block';
//}
/**
 * Show the main menu after loading all assets
 */
//function mainMenu() {
//    show(menu);
//}
/**
 * Click handlers for the different menu screens
 */
document.querySelector('.play').addEventListener('click', function () {
    hide(menu);
    initEnemies();
    

});
document.querySelector('.new').addEventListener('click', function () {
    hide(endGame);


});

