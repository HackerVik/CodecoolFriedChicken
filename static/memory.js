buttons = document.querySelectorAll(".diff");
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", difficulty);
}

window.onload = function () {
    difficulty();
};

dragula([document.getElementById("memorycontainer")])
    .on('drag', function (el) {
    }).on('drop', function (el) {

    let game_run = sessionStorage.getItem("game_run");
    if (game_run === "true") {
        let arr = getActualArray();
        let arrSolution = JSON.parse(sessionStorage.getItem("originalArray"));

        moveCounter();
        if (checkArray(arr, arrSolution)) {

            let moves = sessionStorage.getItem("moves");
            setTimeout(function () {
                alert("You won! Your moves: " + moves)
            });
            sessionStorage.setItem("moves", 0);
            cardToBack();
            sessionStorage.setItem("game_run", "false");
            moveCounter(true);

        }

    }
    // Used like so


});

function cardToBack() {
    let cards = document.querySelectorAll(".card");
    for (let i = 0; i < cards.length; i++) {
        cards[i].innerHTML = '<div class="card" id=' + i + '><img class="card_image" src="/static/images/cardbackground.png"></div>';
    }
}

function main() {
    document.getElementById("timer").style.display = "none";
    let arr2 = shuffle();
    changeImageSource(arr2);

}

function getImages(numberOfCards, numberOfImages) {
    let arr = new Array();
    do {
        let numberOfGenerated = Math.floor(Math.random() * numberOfImages + 1);
        if (arr.indexOf(numberOfGenerated) === -1) {
            arr.push(numberOfGenerated);
        }
    } while (arr.length < numberOfCards);
    return arr;
}

function changeImageSource(arr) {
    let images = document.querySelectorAll(".card");
    for (let i = 0; i < arr.length; i++) {

        images[i].innerHTML = '<div class="images" data-image="' + arr[i] + '"><img  class="card_image" src="/static/images/' + arr[i] + '.png"></div>';
    }
}

function checkArray(arr, arrSolution) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] != arrSolution[i]) {
            return false;
        }
    }
    return true;
}

function getActualArray() {
    let images = document.querySelectorAll(".images");
    let arr = new Array();
    for (let i of images) {
        arr.push(i.dataset.image);
    }
    let set = new Set(arr);
    return Array.from(set);
}


function shuffle() {
    let array = JSON.parse(sessionStorage.getItem("originalArray"));
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;


    }
    return array;
}


function difficulty(e) {

    sessionStorage.setItem("game_run", "false");
    document.getElementById("timer").style.display = "block";
    let numnerOfCards = document.getElementById("diff").dataset.diff;
    console.log(numnerOfCards);
    let originalArray = getImages(numnerOfCards, 55)
    changeImageSource(originalArray);
    sessionStorage.setItem("originalArray", JSON.stringify(originalArray));

    let time = 4.5;


    setTimeout(function () {
        sessionStorage.setItem("game_run", "true");

        main()
    }, time * 1000);


}

function moveCounter(reset = false) {

    if (reset){
        document.getElementById("moves").innerHTML = "<h1><img src=/static/images/moves.png>" + moves + "</h1>";
    } else {
        let moves = parseInt(sessionStorage.getItem("moves")) + 1;
        sessionStorage.setItem("moves", moves);
    }
    document.getElementById("moves").innerHTML = "<h1><img src=/static/images/moves.png>" + moves + "</h1>";
}

