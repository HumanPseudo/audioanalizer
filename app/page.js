'use client';
import { useEffect, useRef, useState } from 'react';
import AudioMotionAnalyzer from 'audiomotion-analyzer';

export default function Home() {
  const containerRefs = useRef([]);
  const audioRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const visualizerModes = ['default', 'bars', 'radial', 'dualbars', 'energy']; // Various modes for visualization

  useEffect(() => {
    const analyzers = [];

    if (audioRef.current) {
      visualizerModes.forEach((mode, index) => {
        if (containerRefs.current[index]) {
          const audioMotion = new AudioMotionAnalyzer(containerRefs.current[index], {
            source: audioRef.current,
            mode: mode === 'bars' ? 2 : mode === 'radial' ? 10 : mode === 'dualbars' ? 4 : 0,
            radial: mode === 'radial',
          });
          analyzers.push(audioMotion);
        }
      });
    }

    return () => {
      analyzers.forEach(analyzer => analyzer.destroy()); // Clean up when component unmounts
    };
  }, [audioFile]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setAudioFile(fileURL);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold mb-8">Audio Visualizer with Multiple Modes</h1>

      {/* Audio Player */}
      <audio id="audio" ref={audioRef} controls className="mb-4">
        {audioFile && <source src={audioFile} type="audio/mpeg" />}
        Your browser does not support the audio element.
      </audio>

      {/* File Upload Input */}
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="mb-8"
      />

      {/* Visualizer Windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {visualizerModes.map((mode, index) => (
          <div key={mode} className="visualizer-window" style={{ width: '100%', height: '300px', backgroundColor: '#000' }}>
            <h2 className="text-white text-center mb-2 capitalize">{mode} Visualizer</h2>
            <div
              id={`container-${index}`}
              ref={el => (containerRefs.current[index] = el)}
              style={{ width: '100%', height: '250px' }}
            ></div>
          </div>
        ))}
      </div>
    </main>
  );
}
