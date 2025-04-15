import React, { useState, useEffect } from 'react';
import { Timer, RefreshCw } from 'lucide-react';

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
  imageUrl: string;
}

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [moves, setMoves] = useState(0);

  const imageUrls = [
    'https://i.postimg.cc/VL2dNFc9/Asset-2-4x.png',
    'https://i.postimg.cc/s2rxYDxv/Asset-3-4x.png',
    'https://i.postimg.cc/4d430LzG/Asset-4-4x.png',
    'https://i.postimg.cc/JzJtHB1f/Asset-5-4x.png',
    'https://i.postimg.cc/vmtB3FxX/Asset-6-4x.png',
    'https://i.postimg.cc/V67NPqRC/Asset-7-4x.png',
    'https://i.postimg.cc/Fz7HrYWn/Asset-8-4x.png',
    'https://i.postimg.cc/QCwxHjvN/Asset-9-4x.png',
    'https://i.postimg.cc/7PWLBNbv/Asset-10-4x.png',
  ];

  useEffect(() => {
    if (gameStarted) {
      initializePuzzle();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (timer > 0 && gameStarted && !gameCompleted) {
      const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, gameCompleted, gameStarted]);

  const shuffleArray = (array: number[]): number[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializePuzzle = () => {
    const positions = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    const initialPieces: PuzzlePiece[] = positions.map((position, index) => ({
      id: index,
      currentPosition: position,
      correctPosition: index,
      imageUrl: imageUrls[index]
    }));
    
    setPieces(initialPieces);
    setMoves(0);
  };

  const handlePieceClick = (clickedPosition: number) => {
    if (gameCompleted) return;

    const emptyPiece = pieces.find(p => p.id === 8);
    if (!emptyPiece) return;

    const emptyPosition = emptyPiece.currentPosition;

    // Check if the clicked piece is adjacent to the empty space
    const isAdjacent = (
      Math.abs(clickedPosition % 3 - emptyPosition % 3) + 
      Math.abs(Math.floor(clickedPosition / 3) - Math.floor(emptyPosition / 3))
    ) === 1;

    if (isAdjacent) {
      setPieces(prevPieces => {
        const newPieces = [...prevPieces];
        const clickedPiece = newPieces.find(p => p.currentPosition === clickedPosition);
        
        if (clickedPiece) {
          clickedPiece.currentPosition = emptyPosition;
          emptyPiece.currentPosition = clickedPosition;
        }
        
        return newPieces;
      });
      
      setMoves(prev => prev + 1);
      
      // Check if puzzle is solved
      setTimeout(() => {
        const isSolved = pieces.every(piece => piece.currentPosition === piece.correctPosition);
        if (isSolved) {
          setGameCompleted(true);
        }
      }, 100);
    }
  };

  const resetGame = () => {
    setTimer(600);
    setGameCompleted(false);
    initializePuzzle();
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-4 sm:mb-6">
            🎉 Congratulations! 🎉
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-6 sm:mb-8">
            Please Find Our Crew To Collect the Easter Egg
          </p>
          <div className="flex justify-center">
            <img
              src={imageUrls[0]}
              alt="Complete Puzzle"
              className="rounded-lg w-48 sm:w-64 mb-6 sm:mb-8"
            />
          </div>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-4 sm:mb-6">
            Paradigm Mall Easter Puzzle Hunt
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8">
            Solve the puzzle and find our crew!
          </p>
          <button
            onClick={() => setGameStarted(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg sm:text-xl font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all shadow-lg transform hover:scale-105 duration-200"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  const sortedPieces = [...pieces].sort((a, b) => a.currentPosition - b.currentPosition);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 text-gray-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
              <span className="text-lg sm:text-xl font-semibold">
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-gray-600 bg-white px-4 py-2 rounded-lg shadow">
              Moves: {moves}
            </span>
          </div>
          <button
            onClick={resetGame}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-4 py-2 rounded-lg transition-all text-white shadow transform hover:scale-105 duration-200"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            Restart
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="relative bg-white p-4 rounded-lg shadow-lg flex-1">
            <div className="grid grid-cols-3 gap-1 aspect-square">
              {sortedPieces.map((piece) => (
                <div
                  key={piece.id}
                  onClick={() => handlePieceClick(piece.currentPosition)}
                  className={`relative aspect-square cursor-pointer ${
                    piece.id === 8 ? 'bg-gray-200' : 'bg-white'
                  } rounded-md overflow-hidden transition-transform hover:scale-[0.98]`}
                >
                  {piece.id !== 8 && (
                    <img
                      src={piece.imageUrl}
                      alt={`Piece ${piece.id + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Example</h2>
            <img
              src="https://i.postimg.cc/QtVPbZXn/Asset-2-4x.png"
              alt="Example"
              className="w-full max-w-xs rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;