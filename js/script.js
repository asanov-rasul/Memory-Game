const gameNode = document.querySelector('#game_board'),
      victoryMessage = document.querySelector('.victory_message'),
      startGameBtn = document.querySelector('#new_game_btn'),
      minutesBlock = document.querySelector('.minutes'),
      secondsBlock = document.querySelector('.seconds'),
      hundredthsSecondsBlock = document.querySelector('.hundredths_seconds');

let interval;
let minutes = 0;
let seconds = 0;
let milliSeconds = 0;

const cardElements = ['🍇', '🥥', '🍉', '🥝', '🍎', '🍒'];
const cardAmount = 12;
let visibleCards = [];

startGameBtn.addEventListener('click', startGame)
const startTimer = () => {
    milliSeconds++;

    if (milliSeconds <= 99) {
        hundredthsSecondsBlock.innerHTML = milliSeconds;
    }

    if (milliSeconds == 100) {
        hundredthsSecondsBlock.innerHTML = '00'
    }

    if (milliSeconds > 99) {
        seconds++;
        secondsBlock.innerHTML = '0' + seconds;
        milliSeconds = 0;
    }

    if (seconds > 9) {
        secondsBlock.innerHTML = seconds;
    }

    if (seconds > 59) {
        minutes++;
        minutesBlock.innerHTML = '0' + minutes;
        seconds = 0;
        secondsBlock.innerHTML = '0' + seconds
    }

    if (minutes > 9) {
        minutesBlock.innerHTML = minutes
    }
}

function startGame() {
    [gameNode, victoryMessage].forEach(node => node.innerHTML = '');

    generateArray(cardElements, cardAmount).forEach(renderCard);

    document.querySelectorAll('.card').forEach(item => {
        setTimeout(() => {
            item.classList.add('visible')
        },200)
        setTimeout(() => {
            item.classList.remove('visible')
        },1000)
    })
    minutes = 0;
    seconds = 0;
    milliSeconds = 0;

    minutesBlock.innerHTML = '00';
    secondsBlock.innerHTML = '00';
    hundredthsSecondsBlock.innerHTML = '00';
    clearInterval(interval);
    interval = setInterval(startTimer, 10);
}

function generateArray(emojis, cardAmount) {
    const randomArray = [];
    const elementCounts = [];

    for (const emoji of emojis) {
         elementCounts[emoji] = 0;
    }

    while (randomArray.length < cardAmount) {
        const randomIndex = Math.floor(Math.random() * emojis.length);
        const randomElement = emojis[randomIndex];

        if (elementCounts[randomElement] < 2) {
            randomArray.push(randomElement);
            elementCounts[randomElement]++;
        }
    }

    return randomArray
}

function renderCard(emoji) {
    const card = document.createElement('div');
    card.classList.add('card')


    gameNode.appendChild(card)

    const generateCard = `<div class="card_inner">
                <div class="card_front">?</div>
                <div class="card_back">${emoji}</div>
            </div>`

    card.insertAdjacentHTML('beforeend', generateCard);

    card.addEventListener('click', () => {
        handleCardClick(card);
    })
}

function handleCardClick(card) {
    if (card.classList.contains('visible')) {
        return;
    }

    const checkVictory = () => {
        const visibleCardNodes = document.querySelectorAll('.visible');

       const isVictory = visibleCardNodes.length == cardAmount;

        if (isVictory) {
            victoryMessage.innerHTML = `<div class="victory_text">Поздравляю, вы победили!</div>
            <div class="victory_time">
                Ваш результат ${minutes}:${seconds}:${milliSeconds}
            </div>`

            clearInterval(interval);
       }
    }

    card.querySelector('.card_inner').addEventListener('transitionend', checkVictory)

    card.classList.add('visible');

    visibleCards.push(card);

    if (visibleCards.length % 2 !== 0) {
        return
    }

    const [prelastCard, lastCard] = visibleCards.slice(-2);

    if (lastCard.textContent !== prelastCard.textContent) {
        visibleCards = visibleCards.slice(0, visibleCards - 2);

        setTimeout(() => {
            lastCard.classList.remove('visible');
            prelastCard.classList.remove('visible')
        }, 500)
    }
}

startGame();