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
var play = document.querySelectorAll('.play');
var newPlay = document.querySelectorAll('.new');

function addListeners(item, menu) {
    for (var i = 0; i < item.length; i++) {
        item[i].addEventListener('click', function () {
            this.getAttribute('data-players-count') == '1' ? twoPlayer = false : twoPlayer = true;
            if (twoPlayer) {
                document.getElementsByClassName('info')[1].style.visibility = 'visible';
                document.getElementById('lvl').style.display = 'none';
            } else {
                document.getElementsByClassName('info')[1].style.visibility = 'hidden';
                document.getElementById('lvl').style.display = 'inline';
            }

            hide(menu);
            reset();
        });
    }
}

addListeners(newPlay, endGame);
addListeners(play, menu);