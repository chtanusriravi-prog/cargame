import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Track } from './types';

const PLAYLIST: Track[] = [
  { id: 1, title: 'MEM_CORRUPTION_01', artist: 'NULL_POINTER', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'SYS.FAULT_X', artist: 'HEX_DUMP', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'FATAL_EXCEPTION', artist: '0xBADF00D', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] flex flex-col font-sans overflow-hidden border-[8px] border-[#ff00ff] relative group selection:bg-[#ff00ff] selection:text-black">
      <div className="absolute inset-0 static-bg z-0"></div>
      
      <header className="h-16 border-b-[6px] border-[#ff00ff] flex items-center justify-between px-6 bg-black relative z-10 shrink-0 tear">
        <h1 className="text-3xl sm:text-4xl font-bold uppercase glitch text-white tracking-widest">
          {'> SYS_OP_SNAKE.EXE'}
        </h1>
        <div className="text-[#ff00ff] text-2xl animate-pulse font-bold bg-black px-2 border-2 border-[#ff00ff]">
          REC [0]
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden flex-col items-center justify-center p-4 relative z-10">
        <SnakeGame />
      </main>

      <div className="w-full z-20 shrink-0 border-t-[6px] border-[#00ffff] tear" style={{ animationDelay: '2s' }}>
        <MusicPlayer tracks={PLAYLIST} />
      </div>

    </div>
  );
}
