//constants
const inputField = document.querySelector('.input_field')
const displayFlag = document.querySelector('.display_flag')
const displayTextCompleted = document.querySelector('.display_text_completed')
const displayTextCurrent = document.querySelector('.display_text_current')
const displayTextRemaining = document.querySelector('.display_text_remaining')
const inputText = 'this is a cow. and this is great'.trim()
const cursor = document.querySelector('.cursor')

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

const updateCurrentWord = (space) => {
  displayTextCurrent.innerText =
    inputArray[currentWordIndex] + `${space ? ' ' : ''}`
}

const updateCompletedWords = (CompletedWords) => {
  displayTextCompleted.innerText = CompletedWords
}

updateRemainingWords()
// updateCurrentWord(true)

const updateCursorPos = (currentWord, input = '') => {
  displayTextCurrent.innerHTML = ''
  let inputLength = input.length == 0 ? -1 : input.length
  for (let i = 0; i < currentWord.length; i++) {
    if (i < input.length && currentWord[i] == input[i])
      displayTextCurrent.innerHTML += `<span class="correct">${currentWord[i]}</span>`
    else if (i >= input.length) {
      displayTextCurrent.innerHTML += `<span >${currentWord[i]}</span>`
    } else
      displayTextCurrent.innerHTML += `<span class="wrong-char">${currentWord[i]}</span>`

    if (input.length > 0 && currentWord[i] == currentWord[input.length - 1]) {
      const rect = displayTextCurrent.lastChild.getBoundingClientRect()
      cursor.style.top = rect.top
      cursor.style.left = rect.right + 'px'
    }
    if (input.length == 0) {
      const rect = displayTextCurrent.getBoundingClientRect()
      cursor.style.left = rect.left + 'px'
    }
  }
  displayTextCurrent.innerHTML += `<span class="correct"> </span>`
}

updateCursorPos(inputArray[currentWordIndex])
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
    // updateCurrentWord(true)
    updateCursorPos(inputArray[currentWordIndex])
    updateRemainingWords()
    return
  }

  updateCursorPos(currentWord, inputValue)
  for (let i = 0; i < inputValue.length; i++) {
    if (inputValue[i] == currentWord[i]) {
      WRONG = false
    } else {
      WRONG = true
      break
    }
  }

  // updateCursorPos()
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

inputField.addEventListener('input', (e) => {
  const currentWord = inputArray[currentWordIndex]
  const inputValue = e.target.value
  if (currentWordIndex < inputArray.length) {
    // updateCurrentWord(true)
    matchWithInput(currentWord, inputValue)
    if (WRONG && inputValue.length) {
      displayFlag.innerText = 'Wrong'
      inputField.style.backgroundColor = '#cf8a8a'
    } else if (
      (!WRONG && displayFlag.innerText == 'Wrong') ||
      inputValue.length == 0
    ) {
      displayFlag.innerText = ''
      inputField.style.backgroundColor = 'white'
    }
  }
})
