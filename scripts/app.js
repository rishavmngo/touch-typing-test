//constants
const inputField = document.querySelector('.input_field')
const displayFlag = document.querySelector('.display_flag')
const displayTextCompleted = document.querySelector('.display_text_completed')
const displayTextCurrent = document.querySelector('.display_text_current')
const displayTextRemaining = document.querySelector('.display_text_remaining')
const inputText = 'this is a cow.'.trim()

//initial state
let CompletedWords = ''
const inputArray = inputText.split(' ')

let currentWordIndex = 0
let currentChar = 0

let WRONG = false

const updateRemainingWords = () => {
  let finalText = ''
  for (let i = currentWordIndex + 1; i < inputArray.length; i++) {
    if (i == inputArray.length - 1) finalText += inputArray[i]
    else finalText += inputArray[i] + ' '
  }
  displayTextRemaining.innerText = finalText
}
updateRemainingWords()

const updateCurrentWord = (space) => {
  displayTextCurrent.innerText =
    inputArray[currentWordIndex] + `${space ? ' ' : ''}`
}

updateCurrentWord(true)

function matchWithInput(currentWord, inputValue) {
  if (
    !WRONG &&
    currentWord.length + 1 == inputValue.length &&
    inputValue.slice(-1) == ' '
  ) {
    inputField.value = ''
    CompletedWords += inputArray[currentWordIndex] + ' '
    updateCompletedWords(CompletedWords)
    currentWordIndex++
    updateCurrentWord(true)
    updateRemainingWords()
    return
  }
  for (let i = 0; i < inputValue.length; i++) {
    if (inputValue[i] == currentWord[i]) {
      WRONG = false
    } else {
      WRONG = true
      break
    }
  }

  if (
    !WRONG &&
    currentWord.length == inputValue.length &&
    currentWordIndex == inputArray.length - 1
  ) {
    inputField.value = ''
    displayFlag.innerText = 'Finished'
    inputField.disabled = true
    CompletedWords += inputArray[currentWordIndex]
    updateCompletedWords(CompletedWords)
    currentWordIndex++
    displayTextCurrent.innerText = ''
    displayTextRemaining.innerText = ''
  }
}

const updateCompletedWords = (CompletedWords) => {
  displayTextCompleted.innerText = CompletedWords
}
inputField.addEventListener('input', (e) => {
  const currentWord = inputArray[currentWordIndex]
  const inputValue = e.target.value
  const appendSpace = true
  if (currentWordIndex < inputArray.length) {
    updateCurrentWord(appendSpace)
    matchWithInput(currentWord, inputValue)
    if (WRONG) {
      displayFlag.innerText = 'Wrong'
      inputField.style.backgroundColor = '#cf8a8a'
    } else if (!WRONG && displayFlag.innerText == 'Wrong') {
      displayFlag.innerText = ''
      inputField.style.backgroundColor = ''
    }
  }
})
