let widget1 = document.getElementsByClassName('wid1');
let option1 = document.getElementsByClassName('opt1');

for (let i = 0; i < widget1.length; i++) {
    widget1[i].onclick = function() {
        for (let j = 0; j < option1.length; j++) {
            option1[j].style.display = 'none'; // Hides all elements with the class 'opt1'
        }
    };
}
