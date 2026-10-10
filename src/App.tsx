/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

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

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Manejo Automático y Continuo de Música de Fondo en Bucle (Sin botón de reproducir)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 1.0;

    const playAudio = () => {
      audio.play().catch(() => {});
    };

    // Reproducir de inmediato al cargar la página
    playAudio();

    // Eventos globales para asegurar reproducción continua en la primera interacción si el navegador requirió gesto
    const handleFirstInteraction = () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    };

    const handleEnded = () => {
      // Garantizar repetición instantánea continua en bucle
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener('ended', handleEnded);
    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });

    return () => {
      audio.removeEventListener('ended', handleEnded);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
    };
  }, []);

  // 2. Control del temporizador de diapositivas automáticas (7 segundos)
  const resetSlideTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
  };

  useEffect(() => {
    resetSlideTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goToSlide = (index: number) => {
    const nextIndex = (index + SLIDES.length) % SLIDES.length;
    setCurrentSlide(nextIndex);
    resetSlideTimer();
  };

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToSlide(currentSlide + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToSlide(currentSlide - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  // 3. Fondo Cinemático 3D con Three.js
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070a, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 120, 180);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xdbe3ff, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xdfb260, 1.8);
    sunLight.position.set(100, 80, -100);
    scene.add(sunLight);

    // Sistema de partículas doradas
    const particleCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 550;
      positions[i + 1] = Math.random() * 220;
      positions[i + 2] = (Math.random() - 0.5) * 550;

      // Variación dorada estética
      colors[i] = 0.87 + Math.random() * 0.1;
      colors[i + 1] = 0.70 + Math.random() * 0.1;
      colors[i + 2] = 0.38 + Math.random() * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // Anillos orbitales sutiles
    const ringGeometry = new THREE.TorusGeometry(120, 0.6, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xdfb260,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.3;
    ring.position.y = 40;
    scene.add(ring);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      particles.rotation.y = elapsedTime * 0.028;
      particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05;
      ring.rotation.z = elapsedTime * 0.035;

      // Movimiento vertical de cámara según la diapositiva activa
      const targetY = 120 - currentSlide * 16;
      camera.position.y += (targetY - camera.position.y) * 0.05;

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
      ringGeometry.dispose();
      ringMaterial.dispose();
    };
  }, [currentSlide]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05070a] text-white select-none font-space">
      {/* Audio de Fondo Automático en Bucle Continuo */}
      <audio
        ref={audioRef}
        src="/your-next-opponent-is-you.mp3?v=2"
        autoPlay
        loop
        preload="auto"
        className="hidden"
      />

      {/* Canvas 3D de fondo */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Header Cinemático Superior */}
      <header className="fixed top-0 left-0 w-full px-6 md:px-12 py-5 flex justify-between items-center z-50 backdrop-blur-md bg-[#05070a]/90 border-b border-[#dfb260]/20">
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
                  onClick={() => goToSlide(idx)}
                  className={`text-xs uppercase tracking-[2px] transition-all duration-300 cursor-pointer pb-1 border-b-2 ${
                    currentSlide === idx
                      ? 'text-[#dfb260] border-[#dfb260] font-semibold drop-shadow-[0_0_8px_rgba(223,178,96,0.6)]'
                      : 'text-white/60 border-transparent hover:text-white hover:border-white/30'
                  }`}
                >
                  {slide.id === 'inicio' ? 'Inicio' : slide.title.split('&')[0].trim()}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Contenedor Central de Diapositivas */}
      <main className="fixed inset-0 z-10 flex items-center justify-center px-4 sm:px-8 md:px-14 lg:px-20 pt-20 pb-16 pointer-events-none">
        <div className="w-full max-w-3xl pointer-events-auto">
          {SLIDES.map((slide, index) => {
            const isActive = currentSlide === index;

            return (
              <div
                key={slide.id}
                className={`transition-all duration-700 ease-out transform ${
                  isActive
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 translate-y-8 scale-95 pointer-events-none absolute inset-x-4 sm:inset-x-8 md:inset-x-14 lg:inset-x-20 top-1/2 -translate-y-1/2'
                }`}
              >
                {index === 0 ? (
                  // Hero Slide Inicial
                  <div className="luxury-card p-8 sm:p-12 md:p-14 text-center">
                    <span className="inline-block text-[#dfb260] text-xs sm:text-sm font-semibold tracking-[3px] uppercase mb-4">
                      {slide.tag}
                    </span>
                    <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-normal tracking-[4px] uppercase text-white mb-4 text-shadow">
                      {slide.title}
                    </h2>
                    <p className="text-[#dfb260] text-sm sm:text-lg tracking-[3px] uppercase font-medium mb-6">
                      {slide.subtitle}
                    </p>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-light">
                      {slide.paragraphs[0]}
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => goToSlide(1)}
                        className="px-6 py-2.5 rounded-full border border-[#dfb260] text-black bg-[#dfb260] hover:bg-[#c99e4b] transition-all text-xs uppercase tracking-[2px] font-semibold shadow-[0_0_20px_rgba(223,178,96,0.4)] cursor-pointer"
                      >
                        Comenzar Recorrido →
                      </button>
                    </div>
                  </div>
                ) : (
                  // Diapositivas de Contenido Estructurado
                  <div className="luxury-card p-6 sm:p-10 md:p-12">
                    <span className="inline-block text-[#dfb260] text-xs sm:text-sm font-bold tracking-[3px] uppercase mb-2">
                      {slide.tag}
                    </span>
                    <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-[2px] mb-4 pb-3 border-b border-[#dfb260]/30">
                      {slide.title}
                    </h2>

                    {slide.paragraphs.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-gray-100 text-sm sm:text-base leading-relaxed mb-4 font-normal"
                      >
                        {p}
                      </p>
                    ))}

                    {slide.bullets && (
                      <ul className="space-y-3 mt-4 list-none p-0">
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
                              <span className="text-gray-300 font-light leading-relaxed">
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

      {/* Barra de Progreso y Navegación Inferior */}
      <footer className="fixed bottom-0 left-0 w-full px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between z-40 bg-gradient-to-t from-[#05070a]/95 via-[#05070a]/70 to-transparent">
        <div className="text-[0.72rem] tracking-[2px] uppercase text-white/60 mb-2 sm:mb-0">
          Usa las flechas ← → o espera el avance automático
        </div>

        {/* Controles de diapositivas y selector directo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
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

          <div className="flex items-center gap-1 ml-2">
            <button
              type="button"
              onClick={() => goToSlide(currentSlide - 1)}
              className="p-1.5 rounded-full border border-white/20 bg-black/40 hover:border-[#dfb260] hover:text-[#dfb260] transition-colors cursor-pointer"
              aria-label="Diapositiva anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => goToSlide(currentSlide + 1)}
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
