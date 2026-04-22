import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';

interface MusicPlayerProps {
  tracks: Track[];
}

export function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  const handlePrev = () => setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);

  const handeTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  return (
    <footer className="h-32 sm:h-28 bg-black px-2 sm:px-8 flex flex-col sm:flex-row items-center justify-between w-full select-none relative z-20 pt-2 sm:pt-0 pb-2 sm:pb-0 gap-4 sm:gap-2">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handeTimeUpdate}
        onEnded={handleNext}
        preload="metadata"
      />
      
      {/* Track Info */}
      <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-start text-center sm:text-left">
        <span className="text-[#ff00ff] uppercase text-xl sm:text-2xl glitch">NOW_PLAYING:</span>
        <span className="text-black text-xl sm:text-2xl truncate bg-[#00ffff] px-2 font-bold max-w-full block">
          {currentTrack.title}
        </span>
        <span className="text-[#00ffff] truncate text-lg sm:text-xl">{'>>'} {currentTrack.artist}</span>
      </div>

      {/* Controls & Progress */}
      <div className="flex-1 flex flex-col items-center justify-center sm:border-x-[6px] sm:border-[#ff00ff] px-2 sm:mx-4 w-full h-full max-w-md">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={handlePrev} className="bg-black border-[4px] border-[#00ffff] text-[#00ffff] px-3 py-1 hover:bg-[#00ffff] hover:text-black font-bold text-xl uppercase tracking-widest transition-none">
            [PREV]
          </button>
          <button onClick={togglePlay} className="bg-black border-[4px] border-[#ff00ff] text-[#ff00ff] px-4 py-1 hover:bg-[#ff00ff] hover:text-black text-2xl font-bold uppercase tracking-widest transition-none min-w-[120px]">
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
          <button onClick={handleNext} className="bg-black border-[4px] border-[#00ffff] text-[#00ffff] px-3 py-1 hover:bg-[#00ffff] hover:text-black font-bold text-xl uppercase tracking-widest transition-none">
            [NEXT]
          </button>
        </div>
        <div className="w-full relative flex items-center h-8 border-[4px] border-[#00ffff] bg-black">
          <div className="h-full bg-[#ff00ff]" style={{ width: `${progress}%` }} />
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Status (Right block) */}
      <div className="w-1/3 text-right hidden lg:block">
        <span className="text-[#00ffff] text-3xl block font-bold glitch tracking-widest select-none pointer-events-none">
          VOL: 100%
        </span>
        <span className="text-[#ff00ff] text-xl block mt-1 tracking-widest animate-pulse">
          LINK_ESTABLISHED
        </span>
      </div>
    </footer>
  );
}
