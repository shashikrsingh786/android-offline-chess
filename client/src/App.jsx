import { useEffect, useRef, useState } from 'react'
import useSound from 'use-sound'

import { io } from 'socket.io-client'

import { bb, bk, bn, bp, bq, br, wb, wk, wn, wp, wq, wr, move, check, capture, castle, gameOver } from './assets'
const icons = { bb, bk, bn, bp, bq, br, wb, wk, wn, wp, wq, wr }
const sounds = { move, check, capture, castle, gameOver }

const socket = await io.connect(`http://${window.location.hostname}:3001`)

function App() {
  const tableEnd = useRef(null)
  let dragged = ""
  const soundboard = {
    move: useSound(sounds.move)[0],
    check: useSound(sounds.check)[0],
    capture: useSound(sounds.capture)[0],
    castle: useSound(sounds.castle)[0],
    gameOver: useSound(sounds.gameOver)[0]
  }

  const [board, setBoard] = useState(Array(8).fill([null, null, null, null, null, null, null, null]))
  const [availableMoves, setAvailableMoves] = useState([])
  const [selectedSquare, setSelectedSquare] = useState('')
  const [turn, setTurn] = useState('')
  const [isCheck, setIsCheck] = useState(false)
  const [isGameOver, setIsGameOver] = useState([false, {
    isCheckmate: false,
    isDraw: false,
    isStalemate: false
  }])
  const [history, setHistory] = useState([])
  const [color, setColor] = useState('')
  const [gameId, setGameId] = useState('')
  const [status, setStatus] = useState('lobby')

  const getMoves = async (square) => {
    if (turn === color[0]) {
      let result = await fetch(`http://${window.location.hostname}:3001/moves?gameId=${gameId}&square=${square}`)
      let data = await result.json()
      let moves = data.moves.map(move => move.to)
      setAvailableMoves(moves)
    }
  }

  useEffect(() => {
    const handlePosition = (data) => {
      setBoard(data.position)
      setTurn(data.turn)
      setIsCheck(data.isCheck)
      setIsGameOver([data.isGameOver, {
        isCheckmate: data.isCheckmate,
        isDraw: data.isDraw,
        isStalemate: data.isStalemate
      }])
      setHistory(data.history)
    }

    const handleTerminate = () => {
      setStatus('lobby')
      setGameId('')
      setBoard(Array(8).fill([null, null, null, null, null, null, null, null]))
      setAvailableMoves([])
      setSelectedSquare('')
      setTurn('')
      setIsCheck(false)
      setIsGameOver([false, {
        isCheckmate: false,
        isDraw: false,
        isStalemate: false
      }])
      setHistory([])
      setColor('')
    }

    socket.on('position', handlePosition)
    socket.on('color', setColor)
    socket.on('status', setStatus)
    socket.on('terminate', handleTerminate)
    socket.on('gameId', setGameId)
    socket.on('disconnect', () => {
      handleTerminate()
    })

    return () => {
      socket.off('position', handlePosition)
      socket.off('color', setColor)
      socket.off('status', setStatus)
      socket.off('terminate', handleTerminate)
      socket.off('disconnect')

    }
  }, [])

  useEffect(() => {
    if (history.length > 0) {
      let lastMove = history[history.length - 1]
      soundboard[lastMove.type]()
    }
    setSelectedSquare('')
    setAvailableMoves([])
  }, [history])

  // Add beforeunload warning for host player
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Only show warning if user is the host (white player) and game is active
      if (color === 'white' && (status === 'waiting' || status === 'ready')) {
        const message = "Are you sure you want to leave? You are the host - leaving will end the game for all players!"
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [color, status])

  const movePiece = (move) => {
    if (turn === color[0]) {
      socket.emit('move', { gameId: gameId, move: move })
    }
  }

  //click
  const handleSquareClick = (e) => {
    let square = e.target.getAttribute('square')

    if (selectedSquare !== square) {
      if (availableMoves.includes(square)) {
        movePiece(`${selectedSquare}${square}`)
      } else {
        setSelectedSquare(square)
        getMoves(square)
      }
    } else {
      setSelectedSquare('')
      setAvailableMoves([])
    }
  }
  //drag and drop
  const handleDragStart = async (e) => {
    dragged = e.target.getAttribute('square')

    let square = dragged
    if (selectedSquare !== square) {
      setSelectedSquare(square)
      getMoves(square)
    }
  }
  const handleDrop = (e) => {
    let square = e.target.getAttribute('square')

    if (availableMoves.includes(square)) {
      movePiece(`${selectedSquare}${square}`)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 select-none'>
      {/* Header */}
      <div className='text-center mb-6'>
        <h1 className='text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
          LAN Chess
        </h1>
        <p className='text-gray-300 text-lg'>Play chess with friends on your local network</p>
      </div>

      {/* Main Game Area */}
      <div className='flex flex-col lg:flex-row gap-6 items-center justify-center w-full max-w-6xl'>
        {chessBoard({ board: board, handleSquareClick: handleSquareClick, handleDragStart: handleDragStart, handleDrop: handleDrop, availableMoves: availableMoves, history: history, isCheck: isCheck, isGameOver: isGameOver, turn: turn, selectedSquare: selectedSquare, color: color})}
        {panel({ history: history, tableEnd: tableEnd, socket: socket, status: status, color: color, gameId: gameId })}
      </div>

      {/* Credits */}
      <div className='mt-8 text-center'>
        <div className='flex items-center justify-center gap-2 text-gray-400 text-sm'>
          <span>Built by</span>
          <a 
            href="https://github.com/shashikumarsingh" 
            target="_blank" 
            rel="noopener noreferrer"
            className='flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium'
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Shashi
          </a>
        </div>
      </div>

      <div className='hidden absolute text-white top-0 left-0'>
        status: {status}<br />
        color: {color}<br />
        gameId: {gameId}<br />
        turn: {turn}
      </div>
    </div>
  )
}

function chessBoard({board, handleSquareClick, handleDragStart, handleDrop, availableMoves, history, isCheck, isGameOver, turn, selectedSquare, color}) {
  let numToLetter = ["a", "b", "c", "d", "e", "f", "g", "h"]

  let boardArr = []

  for(let i = 0; i < board.length; i++) {
    let boardInd = (color === 'white' ? i : 7 - i)
    let row = board[boardInd]

    for(let j = 0; j < board.length; j++) {
      let rowInd = (color === 'white' ? j : 7 - j)
      let square = row[rowInd]

      let bgColor = (rowInd + boardInd) % 2 === 1 ? 'bg-[#739552]' : 'bg-[#EBECD0]'
      let textColor = (rowInd + boardInd) % 2 === 0 ? 'text-[#739552]' : 'text-[#EBECD0]'
      let coord = `${numToLetter[rowInd]}${8 - boardInd}`
      boardArr.push(
        <div onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); }} className={`relative square flex flex-col ${bgColor} ${textColor}`} square={coord} onClick={handleSquareClick}>
          {rowInd === (color === 'white' ? 0 : 7) && <div square={coord} className='absolute text-xs font-semibold left-[3%]'>{8 - boardInd}</div>}
          {boardInd === (color === 'white' ? 7 : 0) && <div square={coord} className='absolute text-xs font-semibold self-end right-[5%] top-[69%]'>{numToLetter[rowInd]}</div>}
          {square != null ?
            <img
              src={icons[`${square.color}${square.type}`]}
              square={coord}
              className='m-auto z-20 h-[90%] w-[90%]'
              onDragStart={handleDragStart}
              draggable="true"
            /> : ""
          }
          {squareUnderlay({ square: square, coord: coord, history: history, availableMoves: availableMoves, isCheck: isCheck, turn: turn, selectedSquare: selectedSquare })}
        </div>
      )
    }
  }

  return (
    <div id="board" className='relative grid-rows-8 grid-cols-8 grid grabbable text-black w-full max-w-[500px] aspect-square shadow-2xl rounded-lg overflow-hidden border-4 border-amber-700'>
      {boardArr}
      {isGameOver[0] && <div className='absolute bg-zinc-800 bg-opacity-80 h-full w-full flex items-center justify-center z-40'>
        <div className='font-light text-white text-center text-2xl md:text-4xl px-4'>
          Game Over: <br/>
          {isGameOver[1].isCheckmate ? 'Checkmate' : isGameOver[1].isDraw ? 'Draw' : isGameOver[1].isStalemate ? 'Stalemate' : ''}
        </div>
      </div>}
    </div>
  )
}

//highights squares and displays moves on the board
function squareUnderlay({ square, coord, history, availableMoves, isCheck, turn, selectedSquare }) {
  let availableMove = null
  let bg = ''
  if (availableMoves.includes(coord)) {
    if (square != null) {
      availableMove = <div style={{
        border: '4px solid black',
        borderRadius: '50%',
        height: '100%',
        width: '100%',
        opacity: '0.2'
      }}
        square={coord}
      />
    } else {
      availableMove = <div square={coord} className='rounded-full bg-black bg-opacity-20 h-[40%] w-[40%]' />
    }
  }

  if (history.length > 0) {
    let lastMove = history[history.length - 1]
    if (coord === lastMove.from || coord === lastMove.to) {
      bg = 'bg-yellow-300 bg-opacity-65'
    }
  }

  if (selectedSquare === coord && square != null) {
    bg = 'bg-yellow-300 bg-opacity-65'
  }

  if (square != null && square.type === 'k' && isCheck && square.color === turn) {
    bg = 'bg-red-600 bg-opacity-70'
  }

  return (
    <div square={coord} className={`absolute ${bg} z-10 w-full h-full flex items-center justify-center`}>
      {availableMove}
    </div>
  )
}

function controlPanel({ history, tableEnd, socket, status, gameId }) {
  return (
    <div className='w-full max-w-sm bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-2xl'>
      {/* Game Status */}
      <div className='text-center mb-6'>
        <h2 className='text-xl font-bold text-white mb-2'>Game Controls</h2>
        {status === 'waiting' && (
          <div className='bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-3'>
            <div className='flex items-center justify-center gap-2 text-yellow-300'>
              <div className='animate-spin rounded-full h-4 w-4 border-2 border-yellow-300 border-t-transparent'></div>
              <span className='text-sm font-medium'>Waiting for opponent...</span>
            </div>
          </div>
        )}
        {status === 'ready' && (
          <div className='bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-3'>
            <div className='text-green-300 text-sm'>
              <div className='flex items-center justify-center gap-2 mb-1'>
                <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                <span className='font-medium'>Connected</span>
              </div>
              <p className='text-xs text-green-400'>Room: <span className='font-mono font-bold'>{gameId}</span></p>
            </div>
          </div>
        )}
      </div>

      {/* Game Actions */}
      <div className='space-y-3'>
        <div className='grid grid-cols-2 gap-3'>
          <button 
            className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg'
            onClick={() => socket.emit('undo', gameId)}
          >
            <div className='flex items-center justify-center gap-2'>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Undo
            </div>
          </button>
          <button
            className='bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg'
            onClick={() => socket.emit('reset', gameId)}
          >
            <div className='flex items-center justify-center gap-2'>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </div>
          </button>
        </div>
        <button
          className='w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg'
          onClick={() => socket.emit('leave', gameId)}
        >
          <div className='flex items-center justify-center gap-2'>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Leave Game
          </div>
        </button>
      </div>
    </div>
  )
}

function gameJoinPanel({ socket, status, color, gameId }) {
  return (
    <div className='w-full max-w-sm bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-2xl'>
      {/* Header */}
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-white mb-2'>Game Lobby</h2>
        <p className='text-gray-400 text-sm'>Enter a room code to join or create a game</p>
      </div>

      {/* Room Input */}
      <div className='space-y-4'>
        <div className='relative'>
          <input 
            required 
            id="roomInput" 
            className='w-full py-3 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200' 
            type='text' 
            placeholder='Enter room code...' 
          />
        </div>
        
        <button
          className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg'
          onClick={() => {
            if(!document.getElementById('roomInput').reportValidity()) {
              return
            }
            socket.emit('join', document.getElementById('roomInput').value)
          }}
        >
          <div className='flex items-center justify-center gap-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Join Game
          </div>
        </button>

        {status === 'fail' && (
          <div className='bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3'>
            <div className='text-red-300 text-sm text-center'>
              <div className='flex items-center justify-center gap-2'>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className='font-medium'>Failed to join room</span>
              </div>
              <p className='text-xs text-red-400 mt-1'>Please check the room code and try again</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className='mt-6 p-4 bg-slate-700 bg-opacity-50 rounded-lg'>
        <h3 className='text-white font-medium mb-2 text-sm'>How to play:</h3>
        <ul className='text-gray-400 text-xs space-y-1'>
          <li>• Enter any room code to create or join a game</li>
          <li>• Share the code with your friend</li>
          <li>• First player gets white pieces</li>
          <li>• Enjoy your chess match!</li>
        </ul>
      </div>
    </div>
  )
}

//render the correct panel based on the game status
function panel({ history, tableEnd, socket, status, color, gameId }) {
  //note tableEnd is a ref, i didnt want to rename it cuz id have to refactor :)
  if (status === 'lobby' || status === 'fail') {
    return (gameJoinPanel({ socket: socket, status: status, color: color, gameId: gameId }))
  } else {
    return (controlPanel({ history: history, tableEnd: tableEnd, socket: socket, status: status, gameId: gameId }))
  }
}

export default App
