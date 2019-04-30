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

        const cardBack = document.createElement('img');
        cardBack.setAttribute("src", "/static/bw_images/gray_back.png");
        cardBack.classList.add('back-face');
        cardDiv.appendChild(cardBack);

        const cardFront = document.createElement('img');
        cardFront.classList.add('front-face');
        cardFront.setAttribute("src", `/static/bw_images/${card}H.png`);
        cardDiv.appendChild(cardFront);
    }
    console.log(cardDeck)
}

function displayCards() {
    let cardPlaces = document.querySelectorAll(".cardPlace");
    let cardDeck = document.querySelector('#cardDeck').children;
    let index = 0;
    let cardDeck2 = Array.from(cardDeck);

    for (let card of cardDeck2) {
        card.className = 'card';
        cardPlaces[index].appendChild(card);

        if (index === 9) {
            index = 0;
        } else {
            index++;
        }
    }
}

putCardsIntoDeck();


displayCards();
