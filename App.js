/* eslint-disable no-new-func */
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [isRadians, setIsRadians] = useState(true);
  const [isShiftMode, setIsShiftMode] = useState(false);
  const [memory, setMemory] = useState(0);

  const handleTrigonometric = (func) => {
    return isRadians ? `Math.${func}` : `(x) => Math.${func}(x * Math.PI / 180)`;
  };

  const calculateResult = (expression) => {
    try {
      const processedExpr = expression
        .replace(/sin\(/g, handleTrigonometric('sin') + '(')
        .replace(/cos\(/g, handleTrigonometric('cos') + '(')
        .replace(/tan\(/g, handleTrigonometric('tan') + '(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/\^/g, '**');

      const result = Function(`'use strict'; return (${processedExpr})`)();
      setHistory((prev) => [...prev, { expression, result }]);
      return result.toString();
    } catch {
      return 'Error';
    }
  };

  const handleButtonClick = (value) => {
    const operations = {
      'C': () => setInput(''),
      'AC': () => {
        setInput('');
        setHistory([]);
      },
      '=': () => setInput(calculateResult(input)),
      '±': () => setInput((prev) => (prev.startsWith('-') ? prev.slice(1) : `-${prev}`)),
      'RAD': () => setIsRadians(!isRadians),
      'shift': () => setIsShiftMode(!isShiftMode),
      'MR': () => setInput((prev) => prev + memory),
      'MC': () => setMemory(0),
      'M+': () => setMemory((prev) => prev + parseFloat(calculateResult(input) || 0)),
      'M-': () => setMemory((prev) => prev - parseFloat(calculateResult(input) || 0)),
    };

    if (operations[value]) operations[value]();
    else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(value)) {
      const func = isShiftMode ? `a${value}` : value;
      setInput((prev) => prev + func + '(');
    } else {
      setInput((prev) => prev + value);
    }
  };

  const buttons = [
    ['shift', isShiftMode ? 'DEG' : 'RAD', 'MC', 'MR'],
    ['M+', 'M-', 'C', 'AC'],
    ['sin', 'cos', 'tan', '/'],
    ['log', 'ln', 'sqrt', '*'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '^'],
    ['0', '.', '±', '='],
    ['(', ')', 'π', 'e'],
  ];

  const renderButton = (value) => {
    const buttonClass =
      value === '='
        ? 'equals-btn'
        : value === 'AC' || value === '±'
        ? 'special-btn'
        : ['+', '-', '*', '/'].includes(value)
        ? 'operator-btn'
        : 'number-btn';

    const displayValue =
      isShiftMode && value === 'sin'
        ? 'asin'
        : isShiftMode && value === 'cos'
        ? 'acos'
        : isShiftMode && value === 'tan'
        ? 'atan'
        : value;

    return (
      <button
        key={value}
        className={`button ${buttonClass}`}
        onClick={() => handleButtonClick(value)}
      >
        {displayValue}
      </button>
    );
  };

  return (
    <div className="container">
      <div className="calculator">
        <div className="display-section">
          <div className="mode-indicators">
            <span className={`mode ${isRadians ? 'active' : ''}`}>RAD</span>
            <span className={`mode ${!isRadians ? 'active' : ''}`}>DEG</span>
            <span className={`mode ${isShiftMode ? 'active' : ''}`}>SHIFT</span>
            <span className={`mode ${memory !== 0 ? 'active' : ''}`}>M</span>
          </div>
          <div className="history">
            {history.slice(-3).map((item, index) => (
              <div key={index} className="history-item">
                <span className="expression">{item.expression} =</span>
                <span className="result">{item.result}</span>
              </div>
            ))}
          </div>
          <div className="current-input">
            <span className="input-value">{input || '0'}</span>
          </div>
        </div>
        <div className="buttons-grid">
          {buttons.map((row, rowIndex) => (
            <div key={rowIndex} className="button-row">
              {row.map(renderButton)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
