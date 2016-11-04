var big_modal = document.getElementById('big-modal');
var small_modal = document.getElementById('small-modal');

// Get the button that opens the modal
var btn = document.getElementsByClassName("logo");

// Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    big_modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     big_modal.style.display = "none";
// }

window.onclick = function(event) {
    if (event.target == big_modal) {
        big_modal.style.display = "none";
    }
    if (event.target == small_modal) {
        small_modal.style.display = "none";
    }
}