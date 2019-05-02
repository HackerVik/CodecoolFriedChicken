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
        if(place.innerHTML !== '') {
            let lastCard = place.lastChild;
            let backCard = lastCard.lastChild;

            if (backCard.className === 'back-face') {
                setBackCardHidden(lastCard);
            }
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
    let lastCardValue = 1, firstCardValue = 0;

    if (place.innerHTML !== '') {
        lastCardValue = parseInt(place.lastChild.dataset.value);
        firstCardValue = parseInt(selected[0].dataset.value);
    }
    if (lastCardValue === firstCardValue + 1) {
        for (let card of selected) {
            place.appendChild(card);
        }
    }
}

function changeCardSelectBack() {
    let selected = document.querySelectorAll('.selected');

    for (let card of selected) {
        setTimeout(function () {
            card.classList.remove('selected');
            sessionStorage.setItem('selected', 'no');
            overturn();
            checkCardSequence();
        }, 2000)
    }
}

function checkCardSequence() {
    let counter = 0;
    let places = document.querySelectorAll('.cardPlace');

    for (let place of places) {
        let cards = place.children;
        for (let i = 0; i < cards.length - 1; i++) {
            let lastCard = cards[i].lastChild;
            if (lastCard.className === 'back-face-hidden') {
                if (parseInt(cards[i].dataset.value) === parseInt(cards[i + 1].dataset.value) + 1) {
                    counter++;
                } else {
                    counter = 0;
                }
            }
        }
        if (counter === 12) {
            replaceCompletedCards(place);
            break;
        } else {
            counter = 0;
        }
    }
    overturn();
}

function replaceCompletedCards(place) {
    let completedDeck = document.querySelector('#completedDeck');
    for (let i = 0; i < 13; i++) {
        let lastChild = place.lastChild;
        completedDeck.appendChild(lastChild)
    }
}


function main() {
    putCardsIntoDeck();
    sessionStorage.setItem('selected', 'no');
    document.querySelector('#cardDeck').addEventListener('click', addNextHand);
    window.addEventListener('load', displayCards);
}

main()