import React from 'react'
import './App.css'
import {clsx} from 'clsx'
import { languages } from './languages'
import { getFarewellText ,getRandomWord } from './utils'

function App() {

  // State Values 
  const [currentWord,SetcurrentWord] = React.useState(() => getRandomWord())
  const [gussedLetters , SetgussedLetters] = React.useState([])


  // Static Values 
  const alphabets = "abcdefghijklmnopqrstuvwxyz"

  // Derived Values
  const numGuessesLeft = (languages.length - 1) 
  const isWrongGusses = gussedLetters.filter((letter) => !currentWord.includes(letter)).length
  const isWon = currentWord.split("").every(letter => gussedLetters.includes(letter))
  const gameLost = isWrongGusses >=  languages.length - 1
  const gameOver = isWon || gameLost
  const lastLetter = gussedLetters[gussedLetters.length - 1]
  const lastIsIncorrect = lastLetter && !currentWord.includes(lastLetter)



  function addLetter(letter){
    SetgussedLetters(prevgussedLetters => prevgussedLetters.includes(letter) ? prevgussedLetters : [...prevgussedLetters,letter])

  }


  const getlanuges = languages.map((lan,index) => {
  const isLost = index < isWrongGusses
    const style = {
      backgroundColor: lan.backgroundColor,
      color: lan.color
    }
    const className = clsx("chip", isLost && "lost")

    return (
      <span 
      className = {className}
      style = {style}
      key = {lan.name}
      >{lan.name} </span>
    )
  })

   


  const getLetters = currentWord.split("").map((letter,index) => ( <span key = {index}>{gussedLetters.includes(letter) ? letter.toUpperCase() : ""}</span>))

  const getKeyboard = alphabets.split("").map((letter) => {

  const isGussed = gussedLetters.includes(letter)
  const isCorrect = isGussed && currentWord.includes(letter)
  const isWrong = isGussed && !currentWord.includes(letter)

  const className = clsx({
      "correct": isCorrect,
      "wrong": isWrong,
  })
  return (
    <button class= {className} key = {letter} disabled={gameOver} aria-disabled={gussedLetters.includes(letter)} aria-label={`Letter ${letter}`} onClick={()=> addLetter(letter)}>{letter.toUpperCase()}</button>
  )})



  const gameStatusClass = clsx("game-status", {
        won: isWon,
        lost: gameLost,
        farewell : !gameOver && lastIsIncorrect
    })

  function startNewGame(){
    SetcurrentWord(getRandomWord())
    SetgussedLetters([])
  }

  function returngamestatus(){
    if (!gameOver && lastIsIncorrect){
       return (
                <p className="farewell-message">
                    {getFarewellText(languages[isWrongGusses - 1].name)}
                </p>
            )
    }

    if (isWon){
      return(
       <>
        <h2>You win!</h2>
        <p>Well done! 🎉</p>
      </>
      )
    }
    
    if (gameLost){
      return (

         <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>

      )
    }
  }

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the
                programming world safe from Assembly!</p>
      </header>
      <section className= {gameStatusClass}>
        {returngamestatus()}
      </section>
      <section className="language-chips">
      {getlanuges}
      </section>
      <section className="word">
        {getLetters}
      </section>

      <section
                className="sr-only"
                aria-live="polite"
                role="status"
            >
                <p>
                    {currentWord.includes(lastLetter) ?
                        `Correct! The letter ${lastLetter} is in the word.` :
                        `Sorry, the letter ${lastLetter} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter =>
                    gussedLetters.includes(letter) ? letter + "." : "blank.")
                    .join(" ")}</p>

            </section>

      <section className="keyboard">
      {getKeyboard}
      </section>
      {gameOver && 
                <button 
                    className="new-game" 
                    onClick={startNewGame}
                >New Game</button>}
    </main>
  )
}

export default App
