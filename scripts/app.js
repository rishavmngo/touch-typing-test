//constants
import texts from './texts.js'
import { Timer } from './timer.js'
const inputField = document.querySelector('.input_field')
const displayFlag = document.querySelector('.display_flag')
const displayTextCompleted = document.querySelector('.display_text_completed')
const displayTextCurrent = document.querySelector('.display_text_current')
const displayTextRemaining = document.querySelector('.display_text_remaining')
const displayTotalWord = document.querySelector('.totalWord')
const displayWrongWord = document.querySelector('.wrongTyped')
const displayTotalTyped = document.querySelector('.totalTyped')
const displayResultAccuracy = document.querySelector('.result-accuracy')
const displayResultSpeed = document.querySelector('.result-speed')
const random = Math.floor(Math.random() * texts.length)
const inputText = texts[random].trim()
let STARTED = false
const textRecord = {
  totalCharacter: 0,
  totalTypedCharacters: 0,
  totalTypedWrongCharacters: 0,
}
// const cursor = document.querySelector('.cursor')

const timer = new Timer()

//initial state
let CompletedWords = ''
const inputArray = inputText.split(' ')

inputArray.forEach((ch) => {
  textRecord.totalCharacter += ch.length
})

textRecord.totalCharacter += inputArray.length - 1
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

const updateTextRecord = () => {
  displayTotalWord.innerText = textRecord.totalCharacter
  displayTotalTyped.innerText = textRecord.totalTypedCharacters
  displayWrongWord.innerText = textRecord.totalTypedWrongCharacters
}
updateTextRecord()

const calculateWpm = () => {
  const wpm =
    (textRecord.totalTypedCharacters / 5 -
      textRecord.totalTypedWrongCharacters) /
    timer.result()
  return wpm.toFixed(2) + ' WPM'
}
const displayResult = () => {
  const accuracy =
    (textRecord.totalTypedCharacters - textRecord.totalTypedWrongCharacters) *
    (100 / textRecord.totalCharacter)
  displayResultAccuracy.innerText = accuracy.toFixed(1) + ' %'
  displayResultSpeed.innerText = calculateWpm()
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
  // displayTextCurrent.innerHTML = '<div class="cursor"></div>'
  const cursor = document.querySelector('.cursor')

  let inputLength = input.length == 0 ? -1 : input.length
  for (let i = 0; i < currentWord.length; i++) {
    if (i < input.length && currentWord[i] == input[i]) {
      displayTextCurrent.innerHTML += `<span class="correct com">${currentWord[i]}</span>`
    } else if (i >= input.length) {
      displayTextCurrent.innerHTML += `<span class="com">${currentWord[i]}</span>`
    } else
      displayTextCurrent.innerHTML += `<span class="wrong-char com">${currentWord[i]}</span>`

    if (input.length > 0 && i == input.length - 1) {
      const lastEnterd = displayTextCurrent.lastChild
      // lastEnterd.style.marginLeft = '0px'
      lastEnterd.style.borderRight = '1px solid red'
      // lastEnterd.classList.add('c')
    }
    if (input.length == 0 && i == 0) {
      const children = displayTextCurrent.children[0]

      children.style.borderLeft = '1px solid red'
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
    timer.stop()
    STARTED = false
    inputField.value = ''
    displayFlag.innerText = 'Finished'

    displayResult()
    inputField.disabled = true
    CompletedWords += inputArray[currentWordIndex]
    updateCompletedWords(CompletedWords)
    currentWordIndex++
    displayTextCurrent.innerText = ''
    displayTextRemaining.innerText = ''
    // cursor.style.display = 'none'
  }
}

inputField.addEventListener('input', (e) => {
  if (!STARTED) {
    console.log('started')
    timer.start()
    STARTED = true
  }
  const currentWord = inputArray[currentWordIndex]
  const inputValue = e.target.value

  if (!!e.data) {
    textRecord.totalTypedCharacters++
  }

  if (currentWordIndex < inputArray.length) {
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

    if (WRONG) {
      textRecord.totalTypedWrongCharacters++
    }
  }
  updateTextRecord(textRecord)
})
