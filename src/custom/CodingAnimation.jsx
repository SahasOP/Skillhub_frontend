import React, { useState, useEffect, useCallback } from 'react';
import { Code, Brain, Zap } from 'lucide-react';

const CodingAnimation = () => {
  const [particles, setParticles] = useState([]);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Code blocks with different categories
  const codeSnippets = [
    { id: 1, text: 'const learning = new Knowledge();', category: 'basics', color: 'text-emerald-400' },
    { id: 2, text: 'async function master() {', category: 'advanced', color: 'text-blue-400' },
    { id: 3, text: '<Innovation />',  category: 'components', color: 'text-purple-400' },
    { id: 4, text: 'while(practicing) {', category: 'logic', color: 'text-yellow-400' },
    { id: 5, text: '} // Keep coding', category: 'basics', color: 'text-pink-400' }
  ];

  // Initialize and manage background particles
  useEffect(() => {
    const createParticles = () => Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * 400,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3
    }));

    setParticles(createParticles());

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
        y: (particle.y + particle.speedY + 400) % 400,
        opacity: Math.sin(Date.now() / 1000 + particle.id) * 0.3 + 0.5
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Initialize code blocks with orbital movement
  useEffect(() => {
    const initializeCodeBlocks = () => {
      return codeSnippets.map((snippet, index) => ({
        ...snippet,
        angle: (index * Math.PI * 2) / codeSnippets.length,
        radius: 150,
        speed: 0.001 + Math.random() * 0.002,
        scale: 1
      }));
    };

    setCodeBlocks(initializeCodeBlocks());

    const interval = setInterval(() => {
      setCodeBlocks(prev => prev.map(block => ({
        ...block,
        angle: block.angle + block.speed,
        scale: 0.9 + Math.sin(Date.now() / 1000 + block.id) * 0.1
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Mouse movement effect
  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  return (
    <div 
      className="relative w-full h-96 bg-slate-900 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="border border-blue-500/20 rounded"
              style={{
                transform: `rotate(${Math.sin(Date.now() / 2000 + i) * 10}deg)`,
                opacity: Math.sin(Date.now() / 1000 + i) * 0.5 + 0.5
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating particles with connections */}
      <svg className="absolute inset-0 w-full h-full">
        {particles.map((particle, i) => (
          <React.Fragment key={particle.id}>
            <circle
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              className="fill-blue-400"
              style={{ opacity: particle.opacity }}
            />
            {particles.slice(i + 1).map((p2, j) => {
              const distance = Math.hypot(particle.x - p2.x, particle.y - p2.y);
              return distance < 100 ? (
                <line
                  key={`${i}-${j}`}
                  x1={particle.x}
                  y1={particle.y}
                  x2={p2.x}
                  y2={p2.y}
                  className="stroke-blue-400"
                  style={{ opacity: (100 - distance) / 500 }}
                />
              ) : null;
            })}
          </React.Fragment>
        ))}
      </svg>

      {/* Orbital code blocks */}
      {codeBlocks.map((block) => {
        const x = window.innerWidth / 2 + Math.cos(block.angle) * block.radius;
        const y = 200 + Math.sin(block.angle) * block.radius;
        return (
          <div
            key={block.id}
            className={`absolute font-mono ${block.color} transition-transform duration-300`}
            style={{
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${block.scale})`,
              textShadow: '0 0 10px currentColor'
            }}
          >
            {block.text}
          </div>
        );
      })}

      {/* Interactive icons */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 flex items-center justify-center">
            <Code 
              className="w-12 h-12 text-blue-400 animate-pulse" 
              style={{ 
                filter: 'drop-shadow(0 0 10px currentColor)',
                transformOrigin: 'center',
                transform: `rotate(${Math.sin(Date.now() / 1000) * 10}deg)`
              }}
            />
          </div>
          <Brain 
            className="absolute top-0 left-0 w-8 h-8 text-purple-400 animate-bounce" 
            style={{ animationDuration: '3s' }}
          />
          <Zap 
            className="absolute bottom-0 right-0 w-8 h-8 text-yellow-400 animate-bounce" 
            style={{ animationDuration: '2.5s' }}
          />
        </div>
      </div>

      {/* Mouse follower effect */}
      <div
        className="absolute w-8 h-8 pointer-events-none"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%)',
          transition: 'all 0.1s ease-out'
        }}
      />

      {/* Progress indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-12 h-1 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
            style={{
              opacity: Math.sin(Date.now() / 1000 + i) * 0.5 + 0.5,
              transform: `scaleX(${Math.sin(Date.now() / 1500 + i) * 0.2 + 0.8})`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CodingAnimation;