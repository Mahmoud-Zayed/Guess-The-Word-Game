// Setting Game Name
let gameName = "Game The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
    "footer"
).innerHTML = `${gameName} Game Created By Elzero Web School`;

// Setting Game Options
let numberOfTrys = 6;
let numberOfLetters = 4;
let currentTry = 1;
let numberOfHints = 3;

// Manage Words
let wordToGuess = "";
const words = ["Ship", "Tour", "Look", "Site", "Pink", "Main", "Tell", "Only"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput() {
    const inputsContainer = document.querySelector(".inputs");
    // Create Main Try Div
    for (let i = 1; i <= numberOfTrys; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;
        if (i !== 1) {
            tryDiv.classList.add("disabled-inputs");
        }
        // Create Inputs
        for (let j = 1; j <= numberOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlenght", "1");
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }

    // Focus On Input In First Try Element
    inputsContainer.children[0].children[1].focus();

    // Disable All Inputs Except First One
    const inputsInDisabledDiv = document.querySelectorAll(
        ".disabled-inputs input"
    );
    inputsInDisabledDiv.forEach(input => (input.disabled = true));

    // Convert Input To UpperCase
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
            // Next input
            const nextInput = inputs[index + 1];
            if (nextInput) {
                nextInput.focus();
            }
        });

        input.addEventListener("keydown", function (event) {
            const currentIndex = Array.from(inputs).indexOf(event.target);
            if (event.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if (nextInput < inputs.length) {
                    inputs[nextInput].focus();
                }
            }
            if (event.key === "ArrowLeft") {
                const prevInput = currentIndex - 1;
                if (prevInput >= 0) {
                    inputs[prevInput].focus();
                }
            }
        });
    });
}

const guessButton = document.querySelector(".check");

guessButton.addEventListener("click", handleGusses);
console.log(wordToGuess);
function handleGusses() {
    let successGuess = true;
    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(
            `#guess-${currentTry}-letter-${i}`
        );
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        // Game Logic
        if (letter === actualLetter) {
            inputField.classList.add("yes-in-place");
        } else if (wordToGuess.includes(letter) && letter !== "") {
            inputField.classList.add("not-in-place");
            successGuess = false;
        } else {
            inputField.classList.add("no");
            successGuess = false;
        }
    }

    // Check if User win or lose
    if (successGuess) {
        messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
        if (numberOfHints === 3) {
            messageArea.innerHTML = `<p>Congratz You Didn't Use Hints</p>`;
        }

        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach(tryDiv => tryDiv.classList.add("disabled-inputs"));
        // Disable Guess Button
        guessButton.disabled = true;
        getHintButton.disabled = true;
    } else {
        document
            .querySelector(`.try-${currentTry}`)
            .classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(
            `.try-${currentTry} input`
        );
        currentTryInputs.forEach(input => (input.disabled = true));

        currentTry++;

        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach(input => (input.disabled = false));

        let el = document.querySelector(`.try-${currentTry}`);
        if (el) {
            document
                .querySelector(`.try-${currentTry}`)
                .classList.remove("disabled-inputs");
            el.children[1].focus();
        } else {
            // Disable Guess Button
            guessButton.disabled = true;
            getHintButton.disabled = true;
            messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
        }
    }
}

function getHint() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    }
    if (numberOfHints === 0) {
        getHintButton.disabled = true;
    }
    const enabeldInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnapeledInputs = Array.from(enabeldInputs).filter(
        input => input.value === ""
    );
    if (emptyEnapeledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnapeledInputs.length);
        const randomInput = emptyEnapeledInputs[randomIndex];
        const indexToFill = Array.from(enabeldInputs).indexOf(randomInput);
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}

function handleBackspace(event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        // console.log(currentIndex);
        if (currentIndex > 0) {
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            currentInput.value = "";
            prevInput.value = "";
            prevInput.focus();
        }
    }       
}

document.addEventListener("keydown", handleBackspace);

window.onload = function () {
    generateInput();
};
