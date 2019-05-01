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
        cardBack.setAttribute("src", "/static/bw_images/gray_back.png");
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
    let index = 0, i = 0;

    while (i < 54) {
        await timer(50);
        let card = cardDeck[i];
        if (i >= 44){
            card = setBackCardHidden(card)
        }
        card.className = 'card';
        cardPlaces[index].appendChild(card);
        index = index === 9 ? 0 : index + 1;
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
        index++
    }
}

function setBackCardHidden(card) {
    let back = card.querySelector('.back-face');
    back.className = 'back-face-hidden';
    return card;
}


let cardDeck = document.querySelector('#cardDeck');
cardDeck.addEventListener('click', addNextHand);
window.addEventListener('load', displayCards);

putCardsIntoDeck();

