import { WORDS } from "./words.js"

const keyboardButtonTags = document.getElementsByClassName("keyboard-button")
const NUMBER_OF_GUESSES = 6
const rows = []
const correctString = WORDS[Math.floor(Math.random() * WORDS.length)]
let currentGuess = []
let remainingGuesses = NUMBER_OF_GUESSES
let nextLetterIndex = 0
console.log(correctString)

const gameBoard = document.querySelector("#game-board")

function initializeGameBoard() {
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("section")
        row.classList.add("row-letter")

        for (let j = 0;  j < 5; j++) {
            let box = document.createElement("section")
            box.classList.add("box-letter")
            row.appendChild(box)
        }

        gameBoard.appendChild(row)
        rows.push(row)
    }
}

initializeGameBoard()

document.addEventListener("keyup", event => {
    if (remainingGuesses != 0) {
        let pressedKey = String(event.key)
        switch(pressedKey) {
            case "Backspace":
                deleteLetter()
                break;
            case "Enter":
                checkGuess()
                break;
            default:
                const found = pressedKey.match(/[a-z]/gi)
                if (!found || found.length > 1) {
                    return
                } else {
                    insertLetter(pressedKey)
                }
                break;
        }
    }
})

function getRow() {
    return rows[NUMBER_OF_GUESSES - remainingGuesses]
}

function insertLetter(pressedKey) {
    if (nextLetterIndex == 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = getRow()
    let box = row.children[nextLetterIndex]
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetterIndex += 1
}

function deleteLetter() {
    if (nextLetterIndex > 0) {
        let row = getRow()
        let box = row.children[nextLetterIndex - 1]
        box.textContent = ""
        box.classList.remove("filled-box")
        currentGuess.pop()
        nextLetterIndex -= 1
    }
}

function checkGuess() {
    if (currentGuess.length < 5) {
        alert("Not enough letters!")
    } else if (!WORDS.includes(currentGuess.join(""))) {
        alert("Word not in list!")
    } else {
        let row = getRow()
        let correctArray = Array.from(correctString)

        for (let i = 0; i < 5; i++) {
            let box = row.children[i]
            let letter = currentGuess[i]
            let letterPosition = correctArray.indexOf(letter)
            let letterColor = ""
            if (letterPosition == -1) {
                letterColor = "grey"
            } else {
                if (currentGuess[i] == correctArray[i]) {
                    letterColor = "green"
                } else {
                    letterColor = "yellow"
                }
                correctArray[letterPosition] = "#"
            }

            let delay = 250 * i
            // setTimeout(() => {
                box.style.backgroundColor = letterColor
                shadeKeyBoard(letter, letterColor)
            // }, delay)
        }

        if (currentGuess.join("") == correctString) {
            alert("Correct guess! Game over!")
            remainingGuesses = 0
            return
        } else {
            remainingGuesses -= 1
            currentGuess = []
            nextLetterIndex = 0

            if (remainingGuesses == 0) {
                alert(`Game over! The correct word is ${correctString}!`)
            }
        }
    }
}

function shadeKeyBoard(letter, color) {
    for (const button of keyboardButtonTags) {
        if (button.textContent == letter) {
            let oldColor = button.style.backgroundColor
            button.style.backgroundColor = color
            if (oldColor == "green" || (oldColor == "yellow" && color == "gray")) {
                button.style.backgroundColor = oldColor
            }
            break
        }
    }
}

document.getElementById("keyboard-cont").addEventListener("click", event => {
    const target = event.target
    if (target.classList.contains("keyboard-button")) {
        let key = target.textContent
        if (key == "Del") {
            key = "Backspace"
        }
        document.dispatchEvent(new KeyboardEvent("keyup", { "key": key }))
    }
})