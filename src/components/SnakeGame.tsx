import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';
import { Position } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Position = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

interface SnakeGameProps {
  onScoreChange?: (score: number) => void;
}

export function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('glitchSnakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    if (onScoreChange) onScoreChange(0);
  };

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('glitchSnakeHighScore', score.toString());
    }
    if (onScoreChange) onScoreChange(score);
  }, [score, highScore, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) {
        if (e.key === 'Enter') resetGame();
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
        return;
      }

      const newDirection = { ...direction };
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y !== 1) { newDirection.x = 0; newDirection.y = -1; }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y !== -1) { newDirection.x = 0; newDirection.y = 1; }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x !== 1) { newDirection.x = -1; newDirection.y = 0; }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x !== -1) { newDirection.x = 1; newDirection.y = 0; }
          break;
      }
      setDirection(newDirection);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  const gameLoop = () => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { x: head.x + direction.x, y: head.y + direction.y };

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  useInterval(gameLoop, isPaused || isGameOver ? null : Math.max(INITIAL_SPEED - score, 40));

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto relative z-10 select-none bg-black p-4 border-[6px] border-[#ff00ff]">
      
      {/* Game Grid Container */}
      <div 
        className="w-[min(80vw,450px)] h-[min(80vw,450px)] bg-black relative grid p-0 border-[6px] border-[#00ffff] shadow-[10px_10px_0_#ff00ff] z-10 tear"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
        }}
      >
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`snake-${index}`}
              className={`bg-[#00ffff] border-[2px] border-black flex items-center justify-center ${isHead ? 'z-20 border-white' : 'z-10'}`}
              style={{ gridColumnStart: segment.x + 1, gridRowStart: segment.y + 1 }}
            />
          );
        })}

        <div
          className="bg-[#ff00ff] border-[2px] border-[#00ffff] z-10"
          style={{ 
             gridColumnStart: food.x + 1, 
             gridRowStart: food.y + 1,
             animation: 'glitch 0.2s linear infinite'
          }}
        />

        {/* Grid Overlay Lines - sparse implementation */}
        <div className="absolute inset-0 pointer-events-none grid"
             style={{ 
               gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
               gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
             }}>
           {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
             <div key={i} className="border border-[#00ffff]/10" />
           ))}
        </div>

        {/* Overlays */}
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30">
            {isGameOver ? (
              <>
                <h3 className="text-4xl sm:text-6xl font-bold mb-4 tracking-tighter text-[#ff00ff] glitch uppercase text-center bg-black px-4">
                  FATAL<br/>CRASH
                </h3>
                <p className="text-[#00ffff] mb-8 text-xl sm:text-2xl tracking-widest bg-black px-4 font-bold border-2 border-[#00ffff]">
                  DATA_LOST: <span className="text-white">{score.toString().padStart(4, '0')}</span>
                </p>
                <button
                  onClick={resetGame}
                  className="px-6 py-4 bg-black border-[4px] border-[#ff00ff] text-[#ff00ff] font-bold hover:bg-[#ff00ff] hover:text-black uppercase tracking-[0.2em] text-xl transition-none"
                >
                  [REBOOT_OS]
                </button>
              </>
            ) : (
              <>
                <h3 className="text-4xl sm:text-5xl font-bold text-[#00ffff] mb-8 tracking-widest glitch bg-black p-2 border-2 border-[#00ffff]">
                  SYS.PAUSE
                </h3>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-4 bg-black border-[4px] border-[#00ffff] text-[#00ffff] font-bold hover:bg-[#00ffff] hover:text-black uppercase tracking-[0.2em] text-xl transition-none"
                >
                  [RESUME]
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-8 z-10 justify-between w-full max-w-[min(80vw,450px)] px-4">
        <div className="text-left w-1/2 border-l-[4px] border-[#00ffff] pl-4">
          <div className="text-[#ff00ff] uppercase tracking-[0.3em] font-bold text-xl mb-1">SCORE</div>
          <div className="text-4xl font-bold text-white bg-[#ff00ff] px-2 text-black inline-block">{score.toString().padStart(4, '0')}</div>
        </div>
        <div className="text-right w-1/2 border-r-[4px] border-[#00ffff] pr-4">
          <div className="text-[#00ffff] uppercase tracking-[0.3em] font-bold text-xl mb-1">HIGH_DATA</div>
          <div className="text-4xl font-bold text-[#00ffff]">{highScore.toString().padStart(4, '0')}</div>
        </div>
      </div>

      <div className="mt-6 text-[#ff00ff] text-xl flex flex-col font-bold uppercase tracking-[0.2em] w-full text-center border-t-[4px] border-dashed border-[#00ffff] pt-4 mx-4">
        <span>INPUTS: W_A_S_D</span>
        <span className="text-[#00ffff]">HALT: SPACEBAR</span>
      </div>

    </div>
  );
}
