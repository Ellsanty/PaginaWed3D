/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { AUDIO_BASE64 } from './assets/audioData.ts';

interface Slide {
  id: string;
  tag: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  bullets?: { title: string; desc: string }[];
}

const SLIDES: Slide[] = [
  {
    id: 'inicio',
    tag: 'LIFEQUEST · UNIVERSIDAD DE LA COSTA',
    title: 'Santiago José Penso Peña',
    subtitle: 'Técnico en Desarrollo de Software',
    paragraphs: [
      'Visión integral de crecimiento personal, disciplina atlética y maestría tecnológica para transformar retos en logros tangibles.',
    ],
  },
  {
    id: 'identidad',
    tag: '01 · Autoconocimiento & Resiliencia',
    title: 'Identidad & Carácter',
    paragraphs: [
      'La construcción de mi identidad es un proceso dinámico de constante disciplina. En el fútbol (mediocampista y lateral), aprendí el valor de la perseverancia táctica y la visión de juego.',
    ],
    bullets: [
      {
        title: 'Superación de Adversidades',
        desc: 'Tras el confinamiento por la pandemia, enfrenté un periodo de sobrepeso que superé con nutrición consciente y entrenamiento estricto.',
      },
      {
        title: 'Filosofía de Vida',
        desc: 'Convertí la disciplina deportiva en la fórmula para tolerar la frustración tanto en lo personal como frente a la resolución de errores de código.',
      },
    ],
  },
  {
    id: 'trayectoria',
    tag: '02 · Formación Tecnológica',
    title: 'Trayectoria & Carrera',
    paragraphs: [
      'Mi proyecto profesional está estructurado de forma métrica para responder a las exigencias de la industria tecnológica global:',
    ],
    bullets: [
      {
        title: 'Corto Plazo (18 Años)',
        desc: 'Graduación como Técnico en Desarrollo de Software e inserción laboral inmediata como Programador Junior.',
      },
      {
        title: 'Mediano Plazo',
        desc: 'Homologación directa hacia la carrera de Ingeniería de Sistemas en la Universidad de la Costa (CUC).',
      },
      {
        title: 'Educación Financiera',
        desc: 'Inversión en la bolsa de valores y acciones de empresas para construir múltiples fuentes de ingresos y libertad económica.',
      },
    ],
  },
  {
    id: 'proyeccion',
    tag: '03 · Movilidad Internacional',
    title: 'Proyección Global',
    paragraphs: [
      'Estrategia de expansión profesional e internacionalización para alcanzar metas de alto rendimiento:',
    ],
    bullets: [
      {
        title: 'Mercado Internacional',
        desc: 'Inserción inicial en el mercado laboral de Estados Unidos para acelerar la acumulación de capital y experiencia.',
      },
      {
        title: 'Establecimiento en Canadá',
        desc: 'Radicación permanente enfocado en excelente calidad de vida, seguridad y un sistema de salud público robusto.',
      },
      {
        title: 'Plurilingüismo',
        desc: 'Dominio del Inglés técnico e internacional, complementado con el estudio del Portugués como desarrollo personal y cultural.',
      },
    ],
  },
  {
    id: 'estilo-de-vida',
    tag: '04 · Sueños & Superación',
    title: 'Logro & Estilo de Vida',
    paragraphs: [
      'Inspirado en la excelencia, el éxito tangible representa el testimonio directo del trabajo honesto, la constancia y el estudio:',
    ],
    bullets: [
      {
        title: 'Ingeniería Automotriz',
        desc: 'Pasión por deportivos de alto rendimiento (Porsche, Mustang, Ferrari) y camionetas de alta gama (Cadillac, el vehículo de mis sueños).',
      },
      {
        title: 'Viajes & Familia',
        desc: 'Conocer el mundo (visitar el Spotify Camp Nou en Barcelona, Río de Janeiro), formar un hogar con 3 hijos y asegurar una vejez tranquila y digna para mis padres.',
      },
    ],
  },
  {
    id: 'eje-cuc',
    tag: '05 · Articulación Humanística',
    title: 'Sinergia con el Software',
    paragraphs: [
      'En el desarrollo de software, la depuración de errores (debugging) requiere paciencia, pensamiento crítico y mantener la cabeza fría ante el fallo.',
      'Esta misma lógica rige la vida: los errores no son fracasos sino excepciones temporales que se resuelven mediante el análisis crítico, la resiliencia y la refactorización de decisiones para aportar soluciones de valor a la sociedad.',
    ],
  },
];

const SLIDE_DURATION = 20000; // 20 segundos

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Control de audio manual y automático
  const toggleMusic = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 1.0;
      audio.play()
        .then(() => setIsMusicPlaying(true))
        .catch((err) => console.log('Audio blocked:', err));
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  };

  const startAudio = () => {
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.volume = 1.0;
      audio.play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => {});
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 1.0;

    // Intentar reproducción inmediata al cargar
    audio.play()
      .then(() => setIsMusicPlaying(true))
      .catch(() => {
        // Bloqueado hasta la primera interacción del usuario
        setIsMusicPlaying(false);
      });

    const handleInteraction = () => {
      startAudio();
    };

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', () => setIsMusicPlaying(true));
    audio.addEventListener('pause', () => setIsMusicPlaying(false));

    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });
    window.addEventListener('pointerdown', handleInteraction, { passive: true });

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', () => setIsMusicPlaying(true));
      audio.removeEventListener('pause', () => setIsMusicPlaying(false));
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('pointerdown', handleInteraction);
    };
  }, []);

  // 2. Control de Diapositivas y Barra de Progreso Superior
  const goToSlide = (index: number, isGoingBack = false) => {
    startAudio();
    const nextIndex = (index + SLIDES.length) % SLIDES.length;
    setCurrentSlide(nextIndex);
    setProgress(0);

    if (isGoingBack) {
      // Si la persona le da a la flecha de regresar: se queda ahí hasta que el usuario lo pase
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  };

  useEffect(() => {
    if (isPaused) {
      setProgress(0);
      return;
    }

    const intervalStep = 50; // ms
    const increment = (100 / (SLIDE_DURATION / intervalStep));

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          setCurrentSlide((curr) => (curr + 1) % SLIDES.length);
          return 0;
        }
        return next;
      });
    }, intervalStep);

    return () => clearInterval(progressTimer);
  }, [isPaused, currentSlide]);

  // Navegación por teclado (Espacio = pausar/reanudar, Flechas = cambiar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToSlide(currentSlide + 1, false);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToSlide(currentSlide - 1, true); // Regresar -> Pausar avance automático
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isPaused]);

  // 3. Efecto 3D Interactivo en Tarjetas con el Mouse (Tilt Parallax)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mx = e.clientX / window.innerWidth - 0.5;
      const my = e.clientY / window.innerHeight - 0.5;
      mousePosRef.current = { x: mx, y: my };

      const activeCard = cardContainerRef.current?.querySelector<HTMLElement>(
        '.luxury-card-active'
      );
      if (activeCard) {
        const rx = my * -25;
        const ry = mx * 25;
        activeCard.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(20px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentSlide]);

  // 4. Motor 3D Three.js Avanzado (Torre Central, Anillos Holográficos, Skyline, 2500 Partículas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020408, 0.008);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 40, 140);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xdbe3ff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xdfb260, 3.5);
    sunLight.position.set(100, 150, -100);
    scene.add(sunLight);

    // Torre Central Futurista
    const centralGroup = new THREE.Group();
    const baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2,
      transmission: 0.3,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.9,
    });

    const baseBlock = new THREE.Mesh(new THREE.BoxGeometry(20, 30, 20), baseMat);
    baseBlock.position.y = 15;
    centralGroup.add(baseBlock);

    const midBlock = new THREE.Mesh(new THREE.BoxGeometry(16, 40, 16), glassMat);
    midBlock.position.y = 50;
    centralGroup.add(midBlock);

    const topBlock = new THREE.Mesh(new THREE.BoxGeometry(12, 30, 12), baseMat);
    topBlock.position.y = 85;
    centralGroup.add(topBlock);

    scene.add(centralGroup);

    // Anillos Holográficos que flotan y ondulan
    const rings: THREE.Mesh[] = [];
    const ringGeo = new THREE.TorusGeometry(35, 0.8, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xdfb260,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });

    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 20 + i * 30;
      scene.add(ring);
      rings.push(ring);
    }

    // 24 Edificios Alrededor (Skyline Cyberpunk/Tech)
    const buildings: THREE.Mesh[] = [];
    const bGeo = new THREE.BoxGeometry(12, 70, 12);
    const bMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.4,
    });

    for (let i = 0; i < 24; i++) {
      const b = new THREE.Mesh(bGeo, bMat);
      const angle = (i / 24) * Math.PI * 2;
      const dist = 70 + Math.random() * 90;
      b.position.x = Math.cos(angle) * dist;
      b.position.z = Math.sin(angle) * dist;
      b.position.y = (Math.random() - 0.5) * 20;
      b.scale.y = 0.5 + Math.random() * 1.8;
      scene.add(b);
      buildings.push(b);
    }

    // 2500 Partículas Estelares Doradas
    const particleCount = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 600;
      positions[i + 1] = Math.random() * 300;
      positions[i + 2] = (Math.random() - 0.5) * 600;

      colors[i] = 0.92;
      colors[i + 1] = 0.74;
      colors[i + 2] = 0.45;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      particles.rotation.y = elapsedTime * 0.03;
      centralGroup.rotation.y = elapsedTime * 0.08;

      rings.forEach((r, idx) => {
        r.rotation.z = elapsedTime * (idx % 2 === 0 ? 0.3 : -0.3);
        r.position.y = 20 + idx * 30 + Math.sin(elapsedTime + idx) * 5;
      });

      // Movimiento dinámico de cámara guiado por la diapositiva y el mouse
      const targetCamY = 40 + currentSlide * 25;
      const targetCamX = mousePosRef.current.x * 40;
      const targetCamZ = 140 + mousePosRef.current.y * 30;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(0, targetCamY * 0.6, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      particleMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      baseMat.dispose();
      glassMat.dispose();
      bGeo.dispose();
      bMat.dispose();
    };
  }, [currentSlide]);

  return (
    <div
      onClick={startAudio}
      className="relative w-screen h-screen overflow-hidden bg-[#020408] text-white select-none font-space"
      style={{ perspective: '1200px' }}
    >
      {/* Barra de Progreso Superior Brillante (20 segundos) */}
      <div
        className="fixed top-0 left-0 progress-bar-glow z-50 pointer-events-none"
        style={{ width: `${isPaused ? 0 : progress}%` }}
      />

      {/* Audio de Fondo Automático en Bucle Continuo con múltiples fuentes y Base64 */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        className="hidden"
      >
        <source src="/your-next-opponent-is-you.mp3" type="audio/mpeg" />
        <source src="/Your Next Opponent Is You.mp3" type="audio/mpeg" />
        <source src={AUDIO_BASE64} type="audio/mpeg" />
      </audio>

      {/* Botón Flotante de Control de Música */}
      <button
        type="button"
        onClick={toggleMusic}
        className="fixed bottom-6 right-8 z-50 px-5 py-2.5 rounded-full text-xs uppercase tracking-[2px] cursor-pointer transition-all duration-300 backdrop-blur-xl border border-[#dfb260]/60 shadow-[0_5px_25px_rgba(0,0,0,0.8)] pointer-events-auto flex items-center gap-2.5 bg-[#04080f]/90 hover:bg-[#dfb260] hover:text-black hover:shadow-[0_0_25px_rgba(223,178,96,0.8)] text-[#dfb260]"
        style={{
          boxShadow: isMusicPlaying
            ? '0 0 20px rgba(223, 178, 96, 0.5), inset 0 0 10px rgba(223, 178, 96, 0.2)'
            : '0 0 25px rgba(223, 178, 96, 0.75)',
        }}
        title="Control de música de fondo"
      >
        {isMusicPlaying ? (
          <>
            <span className="font-bold">♫</span>
            <span>Pausar Música</span>
            <span className="inline-flex items-center gap-0.5 ml-1">
              <span className="w-1 h-2 bg-[#dfb260] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-3.5 bg-[#dfb260] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-[#dfb260] animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </>
        ) : (
          <>
            <span className="font-bold animate-pulse">♫</span>
            <span className="font-semibold animate-pulse">Reproducir Música</span>
          </>
        )}
      </button>

      {/* Canvas 3D de fondo */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Header Cinemático Superior con Efecto Glass y Borde Dorado */}
      <header className="fixed top-0 left-0 w-full px-6 md:px-12 py-5 flex justify-between items-center z-50 backdrop-blur-xl bg-[#020408]/85 border-b border-[#dfb260]/20 shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#dfb260]/60 flex items-center justify-center bg-[#dfb260]/10 text-[#dfb260]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="brand">
            <h1 className="font-cinzel text-lg md:text-xl font-bold tracking-[3px] text-white uppercase leading-none">
              Santiago Penso
            </h1>
            <span className="text-[#dfb260] text-[0.7rem] md:text-xs font-space tracking-[2px] block mt-1 uppercase opacity-90">
              Proyecto de Vida · CUC
            </span>
          </div>
        </div>

        {/* Navegación por Diapositivas */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-6 list-none m-0 p-0">
            {SLIDES.map((slide, idx) => (
              <li key={slide.id}>
                <button
                  type="button"
                  onClick={() => goToSlide(idx, false)}
                  className={`nav-link-glow text-xs uppercase tracking-[2px] cursor-pointer pb-1 ${
                    currentSlide === idx ? 'active font-semibold' : 'text-white/70'
                  }`}
                >
                  {slide.id === 'inicio' ? 'Inicio' : slide.title.split('&')[0].trim()}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Contenedor Central de Diapositivas con Perspectiva y Tilt 3D */}
      <main
        ref={cardContainerRef}
        className="fixed inset-0 z-10 flex items-center justify-center px-4 sm:px-8 md:px-14 lg:px-20 pt-20 pb-16 pointer-events-none"
      >
        <div className="w-full max-w-3xl pointer-events-auto">
          {SLIDES.map((slide, index) => {
            const isActive = currentSlide === index;

            return (
              <div
                key={slide.id}
                className={`transition-all duration-700 ease-out transform ${
                  isActive
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-90 pointer-events-none absolute inset-x-4 sm:inset-x-8 md:inset-x-14 lg:inset-x-20 top-1/2 -translate-y-1/2'
                }`}
              >
                {index === 0 ? (
                  // Hero Slide Inicial con Profundidad 3D en Capas
                  <div className={`luxury-card-3d p-8 sm:p-12 md:p-14 text-center ${isActive ? 'luxury-card-active' : ''}`}>
                    <span className="inline-block text-[#dfb260] text-xs sm:text-sm font-semibold tracking-[3px] uppercase mb-4 layer-z-30">
                      {slide.tag}
                    </span>
                    <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-normal tracking-[5px] uppercase text-white mb-4 drop-shadow-[0_5px_30px_rgba(223,178,96,0.4)] layer-z-50">
                      {slide.title}
                    </h2>
                    <p className="text-[#dfb260] text-sm sm:text-lg tracking-[4px] uppercase font-medium mb-6 layer-z-30">
                      {slide.subtitle}
                    </p>
                    <p className="text-[#cbd5e1] text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-light mb-8 layer-z-10">
                      {slide.paragraphs[0]}
                    </p>

                    <div className="layer-z-30 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => goToSlide(1, false)}
                        className="px-8 py-3 rounded-full border border-[#dfb260] text-black bg-[#dfb260] hover:bg-[#c99e4b] transition-all text-xs uppercase tracking-[2px] font-bold shadow-[0_0_25px_rgba(223,178,96,0.5)] cursor-pointer hover:scale-105"
                      >
                        Comenzar Recorrido →
                      </button>
                    </div>
                  </div>
                ) : (
                  // Diapositivas de Contenido Estructurado con Relieve 3D
                  <div className={`luxury-card-3d p-6 sm:p-10 md:p-12 ${isActive ? 'luxury-card-active' : ''}`}>
                    <span className="inline-block text-[#dfb260] text-xs sm:text-sm font-bold tracking-[3px] uppercase mb-2 layer-z-30">
                      {slide.tag}
                    </span>
                    <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-[2px] mb-4 pb-3 border-b border-[#dfb260]/40 layer-z-40">
                      {slide.title}
                    </h2>

                    {slide.paragraphs.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-[#f2f5f9] text-sm sm:text-base leading-relaxed mb-4 font-normal layer-z-10"
                      >
                        {p}
                      </p>
                    ))}

                    {slide.bullets && (
                      <ul className="space-y-3 mt-4 list-none p-0 layer-z-20">
                        {slide.bullets.map((b, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-3 text-sm sm:text-base text-gray-200"
                          >
                            <span className="text-[#dfb260] font-bold text-base leading-none mt-1">✦</span>
                            <div>
                              <strong className="text-white font-semibold mr-1">
                                {b.title}:
                              </strong>
                              <span className="text-[#cbd5e1] font-light leading-relaxed">
                                {b.desc}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer de Navegación Cinemático */}
      <footer className="fixed bottom-0 left-0 w-full px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between z-40 bg-gradient-to-t from-[#020408]/95 via-[#020408]/60 to-transparent">
        <div
          className={`text-[0.72rem] tracking-[2px] uppercase transition-colors duration-300 mb-2 sm:mb-0 ${
            isPaused ? 'text-[#dfb260] font-semibold' : 'text-white/60'
          }`}
        >
          {isPaused
            ? '⏸ En Pausa · Presiona Espacio para continuar'
            : 'Espacio = Pausar/Reanudar | Flechas ← → = Cambiar | Mueve el Mouse = Efecto 3D'}
        </div>

        {/* Controles de Diapositivas */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i, false)}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === i
                    ? 'w-6 bg-[#dfb260] shadow-[0_0_8px_rgba(223,178,96,0.8)]'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <div className="text-[0.75rem] text-[#dfb260] font-mono tracking-widest pl-2">
            0{currentSlide + 1} / 0{SLIDES.length}
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-1.5 rounded-full border border-white/20 bg-black/40 hover:border-[#dfb260] hover:text-[#dfb260] transition-colors cursor-pointer"
              title={isPaused ? 'Reanudar avance automático' : 'Pausar avance automático'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => goToSlide(currentSlide - 1, true)}
              className="p-1.5 rounded-full border border-white/20 bg-black/40 hover:border-[#dfb260] hover:text-[#dfb260] transition-colors cursor-pointer"
              aria-label="Diapositiva anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => goToSlide(currentSlide + 1, false)}
              className="p-1.5 rounded-full border border-white/20 bg-black/40 hover:border-[#dfb260] hover:text-[#dfb260] transition-colors cursor-pointer"
              aria-label="Siguiente diapositiva"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
