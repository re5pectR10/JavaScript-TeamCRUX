var menu = document.getElementById('menu');
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
document.querySelectorAll('.play')[0].addEventListener('click', function () {
    hide(menu);
    initEnemies();

});