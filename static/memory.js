window.onload=function main() {getImages(5,5)};

dragula([document.getElementById("upper"), document.getElementById("lower")])
    .on('drag', function (el) {

    }).on('drop', function (el) {
    let arr = getActualArray();
    let arrSolution = [1, 2, 3, 4, 5];
    if (checkArray(arr, arrSolution)) {
        alert("Nyertél!")
    }
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
    let images = document.querySelectorAll(".col");
    for (let i = 0; i < arr.length; i++) {
        images[i].innerHTML = '<div class="images" data-image="'+arr[i]+'"><img src="/static/images/' + arr[i] + '.png"></div>';
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
    for (let i of images) {arr.push(i.dataset.image);}
    let set = new Set(arr);
    return Array.from(set);
}