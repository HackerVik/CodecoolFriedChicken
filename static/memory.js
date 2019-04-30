buttons = document.querySelectorAll(".diff");
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", difficulty);
}

window.onload = function main() {
    getImages(5, 5)

    let originalArray = getActualArray();
    sessionStorage.setItem("originalArray", JSON.stringify(originalArray));
    console.log(originalArray);

};

dragula([document.getElementById("memorycontainer")])
    .on('drag', function (el) {

    }).on('drop', function (el) {
    let arr = getActualArray();
    let arrSolution = JSON.parse(sessionStorage.getItem("originalArray"));
    console.log(arrSolution);
    moveCounter();
    if (checkArray(arr, arrSolution)) {
        let moves = sessionStorage.getItem("moves");
        setTimeout(function () {alert("You won! Your moves: " + moves)});
    }


    // Used like so


});

function getImages(numberOfCards, numberOfImages) {
    let arr = new Array();
    do {
        let numberOfGenerated = Math.floor(Math.random() * numberOfImages + 1);
        if (arr.indexOf(numberOfGenerated) === -1) {
            arr.push(numberOfGenerated);
        }
    } while (arr.length < numberOfCards);
    changeImageSource(arr);
}

function changeImageSource(arr) {
    let images = document.querySelectorAll(".card");
    for (let i = 0; i < arr.length; i++) {

        images[i].innerHTML = '<div class="images" data-image="' + arr[i] + '"><img src="/static/images/' + arr[i] + '.png"></div>';
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

        changeImageSource(array);

        return array;
    }
}

function timer(time) {
    sessionStorage.setItem("moves", 0);
    var timeleft = time;
    var downloadTimer = setInterval(function () {
        document.getElementById("timer").innerHTML = timeleft + " seconds remaining";
        timeleft -= 1;
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
            document.getElementById("timer").innerHTML = ""
            shuffle();
        }
    }, 1000);
}

function difficulty(e) {


    timer(this.dataset.time);
}

function moveCounter() {
    let moves = parseInt(sessionStorage.getItem("moves")) + 1;
    document.getElementById("moves").innerHTML = "Moves: " + moves;
    sessionStorage.setItem("moves", moves);
}