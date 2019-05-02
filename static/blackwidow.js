//for difficulty setting later
function getDeck(num) {
    let deck = [];
    for (let j = 0; j < num; j++) {
        for (let i = 1; i < 14; i++) {
            deck.push(i.toString());
        }
    }
    return deck;
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function putCardsIntoDeck() {
    let cardDeck = document.querySelector('#cardDeck');
    let shuffledCards = shuffle(getDeck(8));
    let i = 0;
    for (let card of shuffledCards) {
        const cardDiv = document.createElement('div');
        cardDiv.setAttribute("id", i++);
        cardDiv.classList.add('card-in-deck');
        cardDiv.setAttribute("data-value", card);
        cardDeck.appendChild(cardDiv);

        const cardFront = document.createElement('img');
        cardFront.classList.add('front-face');
        cardFront.setAttribute("src", `/static/bw_images/${card}H.png`);
        cardDiv.appendChild(cardFront);

        const cardBack = document.createElement('img');
        cardBack.setAttribute("src", "/static/bw_images/card_back.png");
        cardBack.classList.add('back-face');
        cardDiv.appendChild(cardBack);
    }
}

function timer(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function displayCards() {
    const cardPlaces = document.querySelectorAll(".cardPlace");
    const cardDeck = Array.from(document.querySelector('#cardDeck').children);
    let index = 0, i = 0, row = 0;

    while (i < 54) {
        slideCard(index, row, i);
        await timer(100);
        let card = cardDeck[i];

        if (i >= 44) {
            card = setBackCardHidden(card)
        }
        card.className = 'card';
        cardPlaces[index].appendChild(card);
        index = index === 9 ? 0 : index + 1;
        row = index === 9 ? row + 1 : row;
        card.addEventListener('click', moveCards);
        i++;
    }
}


async function addNextHand(event) {
    let cardPlaces = document.querySelectorAll(".cardPlace");
    let cardDeck = Array.from(event.currentTarget.children);
    let index = 0;

    while (index < 10) {

        await timer(50);
        let card = setBackCardHidden(cardDeck[index]);
        card.className = 'card';
        cardPlaces[index].appendChild(card);
        card.addEventListener('click', moveCards);
        index++
    }
}

function setBackCardHidden(card) {
    let back = card.querySelector('.back-face');
    back.className = 'back-face-hidden';
    return card;
}


function overturn() {
    let cardPlaces = document.querySelectorAll('.cardPlace');
    for (let place of cardPlaces) {
        let lastCard = place.lastChild;
        let backCard = lastCard.lastChild;
        if (backCard.className === 'back-face') {
            setBackCardHidden(lastCard);
        }
    }
}


function slideCard(col, row, _id) {
    let elem = document.getElementById(`${_id}`);
    let bottom = 0, right = 0;
    let id = setInterval(frame, 1);

    function frame() {
        if (bottom >= 700) {
            clearInterval(id);
        } else {
            bottom = bottom + 24 - 2 * row;
            right = right + 48 - 3.84 * col;
            elem.style.bottom = bottom + "px";
            elem.style.right = right + "px";
        }
    }
}

function getNextSiblings(elem) {
    let siblings = [];

    while (elem) {
        siblings.push(elem);
        elem = elem.nextSibling;
    }
    return siblings;
}


function checkDraggable(cards) {
    let selected = sessionStorage.getItem('selected');

    if (selected === 'no') {
        for (let i = 0; i < cards.length - 1; i++) {
            if (parseInt(cards[i].dataset.value) !== parseInt(cards[i + 1].dataset.value) + 1) {
                return false;
            }
        }
        sessionStorage.setItem('selected', 'yes');
        return true;
    }
    return false;
}

function moveCards(event) {
    let cards = getNextSiblings(event.currentTarget);
    let draggable = checkDraggable(cards);

    if (draggable) {
        for (let card of cards) {
            card.classList.add('selected');
        }
        addMovingEvent();
        changeCardSelectBack();
    }
}

function addMovingEvent() {
    let cardPlaces = document.querySelectorAll('.cardPlace');
    for (let place of cardPlaces) {
        place.addEventListener('click', changeCardsPlace);
    }
    setTimeout(function () {
        for (let place of cardPlaces) {
            place.removeEventListener('click', changeCardsPlace);
        }
    }, 2000);
}

function changeCardsPlace(event) {
    let selected = document.querySelectorAll('.selected');
    let place = event.currentTarget;
    for (let card of selected) {
        place.appendChild(card);
    }
}

function changeCardSelectBack() {
    let selected = document.querySelectorAll('.selected');

    for (let card of selected) {
        setTimeout(function () {
            card.classList.remove('selected');
            sessionStorage.setItem('selected', 'no');
            overturn()
            checkCard()
        }, 2000)
    }
}

function checkCard() {
    let counter = 0;
    let places = document.querySelectorAll('.cardPlace');

    for (let place of places) {
        let cards = place.children;
        for (let i = 0; i < cards.length - 1; i++) {
            if (cards[i].lastChild.className === 'back-face-hidden') {
                if (parseInt(cards[i].dataset.value) === parseInt(cards[i + 1].dataset.value) + 1) {
                    counter++;
                    console.log(counter)
                } else {
                    counter = 0;
                }
            }
        }
        if (counter === 12) {
            console.log('true')
        } else {
            counter = 0;
        }
    }
}


function checkCompleteDeck() {
    let cardPlaces = document.querySelectorAll('.cardPlace');
    for (let place of cardPlaces) {
        place.addEventListener('click', checkCard)

    }

}

sessionStorage.setItem('selected', 'no');
let cardDeck = document.querySelector('#cardDeck');
cardDeck.addEventListener('click', addNextHand);
putCardsIntoDeck();
// checkCompleteDeck();

window.addEventListener('load', displayCards);


// function rotateMatrix(matrix) {
//     const flipMatrix = matrix => (
//         matrix[0].map((column, index) => (
//             matrix.map(row => row[index])
//         ))
//     );
//     return flipMatrix(matrix)
// }

// function getBoardArray() {
//     let board = [], col = [];
//     let cardPlaces = document.querySelectorAll('.cardPlace');
//     for (let place of cardPlaces) {
//         for (let card of place.children) {
//             col.push(card);
//         }
//         board.push(col);
//         col = [];
//     }
//     return rotateMatrix(board);
// }