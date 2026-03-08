import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import "./Body.css";

// ── Typing Effect ─────────────────────────────────────────────────────────
const TypingEffect = ({ textArray, typingSpeed = 100, pauseTime = 2000 }) => {
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping]       = useState(true);
  const [textIndex, setTextIndex]     = useState(0);

  useEffect(() => {
    let timeout;
    if (isTyping && currentText.length < textArray[textIndex].length) {
      timeout = setTimeout(() => {
        setCurrentText(prev => prev + textArray[textIndex][currentText.length]);
      }, typingSpeed);
    } else if (isTyping && currentText.length === textArray[textIndex].length) {
      timeout = setTimeout(() => setIsTyping(false), pauseTime);
    } else if (!isTyping && currentText.length > 0) {
      timeout = setTimeout(() => {
        setCurrentText(prev => prev.slice(0, -1));
      }, typingSpeed / 2);
    } else if (!isTyping && currentText.length === 0) {
      setIsTyping(true);
      setTextIndex(prev => (prev + 1) % textArray.length);
    }
    return () => clearTimeout(timeout);
  }, [currentText, isTyping, textArray, textIndex, typingSpeed, pauseTime]);

  return (
    <span className="typing-effect">
      {currentText}
      <span className="typing-cursor">|</span>
    </span>
  );
};

// ── 3D: Helix Orbs ────────────────────────────────────────────────────────
function HelixOrbs() {
  const group = useRef(null);
  const count = 40;
  const positions = useMemo(() => Array.from({ length: count }, (_, i) => {
    const t = (i / count) * Math.PI * 4;
    return new THREE.Vector3(Math.cos(t) * 2.8, (i / count) * 6 - 3, Math.sin(t) * 2.8);
  }), []);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.15;
  });
  return (
    <group ref={group}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06 + (i % 3) * 0.03, 16, 16]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#06b6d4" : "#f59e0b"}
            emissive={i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#06b6d4" : "#f59e0b"}
            emissiveIntensity={0.6} roughness={0.1} metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function CoreSphere() {
  const meshRef = useRef(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.1;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1, 128, 128]}>
        <MeshDistortMaterial color="#7c3aed" distort={0.45} speed={2.5} roughness={0} metalness={0.9} emissive="#4c1d95" emissiveIntensity={0.3} />
      </Sphere>
    </Float>
  );
}

function OrbitRing({ radius, color, speed, tilt }) {
  const ref = useRef(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed; });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.015, 16, 120]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.1} metalness={1} />
    </mesh>
  );
}

function Particles() {
  const ref = useRef(null);
  const count = 300;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [[0.49, 0.23, 0.93], [0.02, 0.71, 0.83], [0.96, 0.62, 0.04]];
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
    }
    return [pos, col];
  }, []);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.04;
      ref.current.rotation.x = clock.getElapsedTime() * 0.02;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]}   intensity={2}   color="#7c3aed" />
      <pointLight position={[-5, -5, 5]} intensity={1.5} color="#06b6d4" />
      <pointLight position={[0, 5, -5]}  intensity={1}   color="#f59e0b" />
      <Stars radius={30} depth={30} count={800} factor={3} fade speed={1} />
      <Particles />
      <CoreSphere />
      <HelixOrbs />
      <OrbitRing radius={1.8} color="#06b6d4" speed={0.6}  tilt={Math.PI / 6}   />
      <OrbitRing radius={2.2} color="#7c3aed" speed={-0.4} tilt={Math.PI / 3}   />
      <OrbitRing radius={2.6} color="#f59e0b" speed={0.3}  tilt={Math.PI / 2.2} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.6} minPolarAngle={Math.PI / 3} />
    </>
  );
}

// ── Social links data ─────────────────────────────────────────────────────
const SOCIALS = [
  { label: "GitHub",   href: "https://github.com/utkarsh037",             icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )},
  { label: "LinkedIn", href: "https://linkedin.com/in/utkarshbharti",      icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )},
  { label: "Twitter",  href: "https://twitter.com/utkarsh_codes",          icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )},
  { label: "Email",    href: "mailto:bhartiutkarsh180@gmail.com",           icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  )},
];

// ── Main Body Component ───────────────────────────────────────────────────
function Body() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!loading) setTimeout(() => setVisible(true), 100);
  }, [loading]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader-ring">
          <div /><div /><div /><div />
        </div>
        <p className="loader-text">Initializing<span className="loader-dots">...</span></p>
      </div>
    );
  }

  return (
    <main className="body">
      <section className="hero-section">

        {/* ── Left: Clean text content ── */}
        <div className={`hero-text ${visible ? "hero-text--visible" : ""}`}>

          {/* Status pill */}
          <div className="hero-status">
            <span className="status-dot" />
            Available for work
          </div>

          {/* Name — big, clean, no box */}
          <h1 className="hero-name">
            <span className="hero-name-line">Utkarsh</span>
            <span className="hero-name-line hero-name-last">Bharti</span>
          </h1>

          {/* Typing role */}
          <div className="hero-role">
            <TypingEffect
              textArray={[
                "Full Stack Developer",
                "Blockchain Engineer",
                "AI Researcher",
                "Civil Eng turned Coder",
              ]}
              typingSpeed={80}
              pauseTime={2200}
            />
          </div>

          {/* Short bio */}
          <p className="hero-bio">
            Building scalable apps, smart contracts & AI systems — 
            one commit at a time. Based in Bengaluru 🇮🇳
          </p>

          {/* CTA buttons */}
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate("/projects")}>
              View Projects
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn-secondary" onClick={() => navigate("/contact")}>
              Contact Me
            </button>
          </div>

          {/* Social icons */}
          <div className="hero-socials">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="social-icon" title={s.label}>
                {s.icon}
              </a>
            ))}
            <span className="socials-divider" />
            <span className="socials-label">Find me online</span>
          </div>

          {/* Scroll hint */}
          <div className="hero-scroll-hint">
            <div className="scroll-mouse">
              <div className="scroll-wheel" />
            </div>
            <span>Scroll to explore</span>
          </div>
        </div>

        {/* ── Right: 3D Canvas ── */}
        <div className="hero-canvas">
          <Canvas
            camera={{ position: [0, 0, 7], fov: 55 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent", width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
          {/* Fade edge */}
          <div className="canvas-fade-left" />
        </div>

      </section>
    </main>
  );
}

export default Body;