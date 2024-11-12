import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (row, col, value) => {
    if (/^[1-9]$/.test(value) || value === '') {
      const newBoard = board.map(row => [...row]);
      newBoard[row][col] = value;
      setBoard(newBoard);
    }
  };

  const isValid = () => {
    const rows = Array.from({ length: 9 }, () => new Set());
    const cols = Array.from({ length: 9 }, () => new Set());
    const boxes = Array.from({ length: 9 }, () => new Set());

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = board[row][col];
        if (value === '') continue;

        const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        if (rows[row].has(value) || cols[col].has(value) || boxes[boxIndex].has(value)) {
          return false;
        }

        rows[row].add(value);
        cols[col].add(value);
        boxes[boxIndex].add(value);
      }
    }
    return true;
  };

  const solveSudoku = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === '') {
          for (let num = 1; num <= 9; num++) {
            board[row][col] = num.toString();
            if (isValid() && solveSudoku(board)) {
              return true;
            }
            board[row][col] = '';
          }
          return false;
        }
      }
    }
    return true;
  };
  const handleValidate = () => {
    if (isValid()) {
      setErrorMessage('The board is valid.');
    } else {
      setErrorMessage('The board is invalid.');
    }
  };

  const handleSolve = () => {
    const newBoard = board.map(row => [...row]);
    if (isValid()) {
      if (solveSudoku(newBoard)) {
        setBoard(newBoard);
        setErrorMessage('');
      } else {
        setErrorMessage('No solution exists for the current board.');
      }
    } else {
      setErrorMessage('The board is invalid.');
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill().map(() => Array(9).fill('')));
    setErrorMessage('');
  };

  return (
    <div className="App">
      <h1>Sudoku Solver</h1>
      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              maxLength="1"
              value={cell}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              className="cell"
            />
          ))
        )}
      </div>
      <div className="buttons">
        <button onClick={handleValidate}>Validate</button>
        <button onClick={handleSolve}>Solve</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default App;
