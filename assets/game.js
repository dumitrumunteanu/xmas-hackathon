const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win'),
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}
var timerConfigured = false

var map = {
    "Uncle Iroh": [
        "Are you so busy fighting you cannot see your own ship has set sail?"
    ],
    "Terminator": [
        "I will be back"
    ],
    "Henry Ford": [
        "The only real mistake is the one from which we learn nothing."
    ],
    "Elbert Hubbard": [
        "Positive anything is better than negative nothing."
    ],
    "William Shakespeare": [
        "To be or not to be"
    ],
    "Bruce Lee": [
        "A fight is not won by one punch or kick. Either learn to endure or.",
        "I am not teaching you anything. I just help you to explore yourself."
    ],
    "J.R.R. Tolkien": [
        "Not all those who wander are lost."
    ]
}

const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        var randomValue = clonedArray[randomIndex]
        randomPicks.push(randomValue[0])
        randomPicks.push(randomValue[1])
        clonedArray.splice(randomIndex, 1)
    }
    console.log('random picks')
    return randomPicks
}

const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }

    var choiches = []
    for (const [key, value] of Object.entries(map)) {
        value.forEach(element => {
            choiches.push([key, element])
        })
    }
    const picks = pickRandom(choiches, (dimensions * dimensions) / 2)
    const items = shuffle([...picks])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    // selectors.board.replaceWith(document.querySelector('.board'))
    const parser = new DOMParser().parseFromString(cards, 'text/html')
    selectors.board.replaceWith(parser.querySelector('.board'))
}

const startGame = () => {
    console.log("reset timer and moves")
    state.gameStarted = true
    // selectors.start.classList.add('disabled')
    state.totalTime = 0
    state.totalFlips = 0
    if (!timerConfigured) {
        timerConfigured = true
        state.loop = setInterval(() => {
            state.totalTime++

            selectors.moves.innerText = `${state.totalFlips} moves`
            selectors.timer.innerText = `time: ${state.totalTime} sec`
        }, 1000)
    }
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')
        var card1Elements = map[flippedCards[0].innerText]
        var card2Elements = map[flippedCards[1].innerText]
        if ((card1Elements !== undefined && card1Elements.includes(flippedCards[1].innerText)) || ((card2Elements !== undefined && card2Elements.includes(flippedCards[0].innerText)))) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `

            clearInterval(state.loop)
        }, 1000)
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}
