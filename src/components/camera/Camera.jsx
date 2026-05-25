import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Billboard } from '@react-three/drei';
import s from './camera.module.css';
import { supabase, BUCKET } from '../../lib/supabase';

// ─── Shutter sound ────────────────────────────────────────────────────────────
function playShutter() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const ch  = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++)
      ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.018));
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    src.connect(filter);
    filter.connect(ctx.destination);
    src.start();
    setTimeout(() => ctx.close(), 300);
  } catch { /* silently skip */ }
}

// ─── Fetch album from Supabase ────────────────────────────────────────────────
async function fetchAlbum() {
  const { data, error } = await supabase.storage.from(BUCKET).list('', {
    limit: 100, offset: 0, sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error || !data?.length) return [];
  return data
    .filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f.name))
    .map(f => supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl);
}

// ─── Load a URL as a Three.js texture (disposable) ───────────────────────────
function usePhotoTexture(url) {
  const [tex, setTex] = useState(null);
  useEffect(() => {
    if (!url) { setTex(null); return; }
    let alive = true;
    new THREE.TextureLoader().load(url, (t) => {
      if (!alive) { t.dispose(); return; }
      t.colorSpace = THREE.SRGBColorSpace;
      setTex(t);
    });
    return () => { alive = false; };
  }, [url]);
  return tex;
}

// ─── Single 3-D photo frame ───────────────────────────────────────────────────
function PhotoFrame({ url, position, scale = 1, onClick, isDark, active = false }) {
  const tex = usePhotoTexture(url);
  const [hovered, setHovered] = useState(false);
  const TEAL = '#00BFA6';
  const w = 1.8 * scale, h = 1.35 * scale, d = 0.055 * scale;

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (onClick) document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Frame body */}
      <mesh castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={active ? '#182622' : (isDark ? '#1E1E1E' : '#ECECEC')}
          roughness={0.45} metalness={0.14}
        />
      </mesh>

      {/* Teal glow border on active frame */}
      {active && (
        <mesh>
          <boxGeometry args={[w + 0.048, h + 0.048, d * 0.28]} />
          <meshStandardMaterial color={TEAL} transparent opacity={0.22} roughness={0.4} />
        </mesh>
      )}

      {/* Photo surface */}
      <mesh position={[0, 0, d / 2 + 0.001]}>
        <planeGeometry args={[w * 0.875, h * 0.875]} />
        <meshBasicMaterial
          map={tex}
          color={tex ? '#ffffff' : (isDark ? '#0A1A14' : '#0D201A')}
          toneMapped={false}
        />
      </mesh>

      {/* Hover shimmer on clickable side frames */}
      {hovered && onClick && (
        <mesh position={[0, 0, d / 2 + 0.003]}>
          <planeGeometry args={[w * 0.875, h * 0.875]} />
          <meshBasicMaterial color={TEAL} transparent opacity={0.13} />
        </mesh>
      )}

      {/* Glossy surface sheen */}
      <mesh position={[0, 0, d / 2 + 0.002]}>
        <planeGeometry args={[w * 0.875, h * 0.875]} />
        <meshPhysicalMaterial
          transparent opacity={0.06}
          roughness={0} metalness={0}
          transmission={0.1}
        />
      </mesh>

      {url && !tex && (
        <Text
          position={[0, 0, d / 2 + 0.06]}
          fontSize={0.075 * scale}
          color={TEAL}
          anchorX="center"
          anchorY="middle"
        >
          loading…
        </Text>
      )}
    </group>
  );
}

// ─── 3-D photo gallery (Billboard so it always faces the viewer) ──────────────
function PhotoGallery({ photos, photoIndex, onPrev, onNext, isDark }) {
  const TEAL = '#00BFA6';

  if (!photos.length) {
    return (
      <Billboard>
        <Text fontSize={0.18} color={TEAL} anchorX="center" anchorY="middle">album empty</Text>
        <Text position={[0, -0.28, 0]} fontSize={0.1} color="#666" anchorX="center" anchorY="middle">
          shoot to add photos
        </Text>
      </Billboard>
    );
  }

  const prev = photoIndex > 0            ? photos[photoIndex - 1] : null;
  const curr = photos[photoIndex]        ?? null;
  const next = photoIndex < photos.length - 1 ? photos[photoIndex + 1] : null;

  return (
    <Billboard>
      {/* Previous */}
      {prev && (
        <PhotoFrame
          url={prev.url}
          position={[-1.96, 0, -0.22]}
          scale={0.6}
          onClick={onPrev}
          isDark={isDark}
        />
      )}

      {/* Current (main) */}
      <PhotoFrame
        url={curr?.url}
        position={[0, 0, 0]}
        scale={1}
        isDark={isDark}
        active
      />

      {/* Next */}
      {next && (
        <PhotoFrame
          url={next.url}
          position={[1.96, 0, -0.22]}
          scale={0.6}
          onClick={onNext}
          isDark={isDark}
        />
      )}

      {/* Left arrow */}
      {prev && (
        <group
          position={[-2.88, 0, 0]}
          onClick={onPrev}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <mesh>
            <circleGeometry args={[0.22, 32]} />
            <meshBasicMaterial color={TEAL} transparent opacity={0.88} />
          </mesh>
          <Text position={[0, 0, 0.02]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
            ◀
          </Text>
        </group>
      )}

      {/* Right arrow */}
      {next && (
        <group
          position={[2.88, 0, 0]}
          onClick={onNext}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <mesh>
            <circleGeometry args={[0.22, 32]} />
            <meshBasicMaterial color={TEAL} transparent opacity={0.88} />
          </mesh>
          <Text position={[0, 0, 0.02]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
            ▶
          </Text>
        </group>
      )}

      {/* Counter */}
      <Text
        position={[0, -1.14, 0]}
        fontSize={0.11}
        color={TEAL}
        anchorX="center"
        anchorY="middle"
      >
        {photoIndex + 1} / {photos.length}
      </Text>
    </Billboard>
  );
}

// ─── Canon S90 PowerShot body ─────────────────────────────────────────────────
function S90Body({ isDark, shutterFired }) {
  const TEAL   = '#00BFA6';
  const H      = Math.PI / 2;
  const body   = '#252525';
  const bodyDk = '#1A1A1A';
  const lensBlk = '#0E0E0E';
  const metal  = { roughness: 0.24, metalness: 0.55 };
  const rubber = { roughness: 0.86, metalness: 0.06 };

  return (
    <group position={[0, -0.08, 0]}>
      {/* Main body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.1, 1.92, 0.76]} />
        <meshStandardMaterial color={body} {...metal} />
      </mesh>

      {/* Top plate */}
      <mesh position={[0, 1.02, -0.01]} castShadow>
        <boxGeometry args={[3.1, 0.08, 0.74]} />
        <meshStandardMaterial color="#2E2E2E" roughness={0.2} metalness={0.65} />
      </mesh>

      {/* Right grip */}
      <mesh position={[1.33, -0.04, 0.02]} castShadow>
        <boxGeometry args={[0.46, 1.92, 0.84]} />
        <meshStandardMaterial color={bodyDk} {...rubber} />
      </mesh>
      {[-0.52, -0.17, 0.18, 0.53].map((y, i) => (
        <mesh key={i} position={[1.33, y, 0.43]}>
          <boxGeometry args={[0.40, 0.052, 0.02]} />
          <meshStandardMaterial color="#0C0C0C" roughness={0.96} metalness={0} />
        </mesh>
      ))}

      {/* Lens housing plate */}
      <mesh position={[-0.42, 0.06, 0.395]}>
        <cylinderGeometry args={[0.80, 0.80, 0.04, 64]} rotation={[H, 0, 0]} />
        <meshStandardMaterial color={bodyDk} roughness={0.22} metalness={0.6} />
      </mesh>

      {/* S90 control ring */}
      <mesh position={[-0.42, 0.06, 0.42]}>
        <torusGeometry args={[0.70, 0.060, 18, 72]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.28} metalness={0.62} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 0.70;
        return (
          <mesh key={i}
            position={[-0.42 + Math.sin(angle) * r, 0.06 + Math.cos(angle) * r, 0.47]}
            rotation={[0, 0, -angle]}>
            <boxGeometry args={[0.022, 0.075, 0.018]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? TEAL : '#777'}
              roughness={0.3} metalness={0.4}
              emissive={i % 3 === 0 ? TEAL : '#000'}
              emissiveIntensity={i % 3 === 0 ? 0.35 : 0} />
          </mesh>
        );
      })}

      {/* Lens barrel outer */}
      <mesh position={[-0.42, 0.06, 0.51]} rotation={[H, 0, 0]}>
        <cylinderGeometry args={[0.58, 0.60, 0.20, 64]} />
        <meshStandardMaterial color={lensBlk} roughness={0.11} metalness={0.88} />
      </mesh>

      {/* Lens barrel inner */}
      <mesh position={[-0.42, 0.06, 0.61]} rotation={[H, 0, 0]}>
        <cylinderGeometry args={[0.44, 0.46, 0.14, 64]} />
        <meshStandardMaterial color="#080808" roughness={0.07} metalness={0.92} />
      </mesh>

      {/* Lens glass */}
      <mesh position={[-0.42, 0.06, 0.68]} rotation={[H, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.05, 64]} />
        <meshPhysicalMaterial color="#001510" roughness={0} metalness={0.04}
          transmission={0.72} thickness={0.8} ior={1.52} />
      </mesh>

      {/* Lens iris */}
      <mesh position={[-0.42, 0.06, 0.70]} rotation={[H, 0, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.02, 32]} />
        <meshStandardMaterial color="#010808" roughness={0.04} metalness={0.1} />
      </mesh>

      {/* Lens highlight */}
      <mesh position={[-0.56, 0.19, 0.70]} rotation={[H, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0} metalness={0} transparent opacity={0.22} />
      </mesh>

      {/* Flash */}
      <mesh position={[-1.12, 0.84, 0.02]} castShadow>
        <boxGeometry args={[0.36, 0.13, 0.70]} />
        <meshStandardMaterial color="#1E1E1E" {...metal} />
      </mesh>
      <mesh position={[-1.12, 0.84, 0.375]}>
        <boxGeometry args={[0.30, 0.085, 0.014]} />
        <meshStandardMaterial
          color={shutterFired ? '#fffff0' : '#0C0C0C'}
          roughness={0.07} metalness={0}
          emissive={shutterFired ? '#fffff0' : '#000'}
          emissiveIntensity={shutterFired ? 4.5 : 0}
          transparent opacity={0.92} />
      </mesh>

      {/* Mode dial */}
      <mesh position={[1.10, 1.04, 0.05]}>
        <cylinderGeometry args={[0.21, 0.21, 0.13, 28]} />
        <meshStandardMaterial color="#202020" {...metal} />
      </mesh>
      <mesh position={[1.10, 1.115, 0.05]}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 24]} />
        <meshStandardMaterial color={TEAL} roughness={0.4} metalness={0.3} transparent opacity={0.82} />
      </mesh>

      {/* Shutter button */}
      <mesh position={[0.57, 1.01, 0.20]}>
        <cylinderGeometry args={[0.10, 0.12, 0.08, 20]} />
        <meshStandardMaterial color="#2C2C2C" roughness={0.22} metalness={0.72} />
      </mesh>

      {/* Power LED */}
      <mesh position={[0.50, 0.74, 0.40]}>
        <sphereGeometry args={[0.050, 16, 16]} />
        <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={3.2} roughness={0.1} />
      </mesh>
      <mesh position={[0.50, 0.74, 0.40]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.4}
          transparent opacity={0.12} roughness={1} />
      </mesh>

      {/* Back LCD */}
      <mesh position={[0.32, -0.04, -0.40]}>
        <boxGeometry args={[1.55, 1.22, 0.01]} />
        <meshStandardMaterial color={isDark ? '#0A1A14' : '#0D1F1E'} roughness={0.28} metalness={0.22}
          emissive={shutterFired ? TEAL : '#001a10'} emissiveIntensity={shutterFired ? 0.5 : 0.08} />
      </mesh>
      <mesh position={[0.32, -0.04, -0.405]}>
        <boxGeometry args={[1.70, 1.37, 0.01]} />
        <meshStandardMaterial color="#181818" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Strap lugs */}
      {[[-1.57, 0.52, 0], [1.57, 0.52, 0]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.064, 0.22, 0.14]} />
          <meshStandardMaterial color={body} {...metal} />
        </mesh>
      ))}

      {/* Tripod mount */}
      <mesh position={[0.20, -0.975, 0.06]}>
        <cylinderGeometry args={[0.060, 0.060, 0.032, 16]} />
        <meshStandardMaterial color="#2C2C2C" {...metal} />
      </mesh>
    </group>
  );
}

// ─── Full 3-D scene: camera body + gallery ────────────────────────────────────
function CameraScene({ isDark, shutterFired, flipped, photos, photoIndex, onPrev, onNext }) {
  const bodyRef    = useRef();
  const galleryRef = useRef();

  useFrame(() => {
    if (bodyRef.current) {
      const tgt = flipped ? Math.PI : 0;
      let delta = tgt - bodyRef.current.rotation.y;
      while (delta >  Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      bodyRef.current.rotation.y += delta * 0.07;
    }
    if (galleryRef.current) {
      galleryRef.current.position.z = THREE.MathUtils.lerp(
        galleryRef.current.position.z,
        flipped ? 1.6 : -8,
        0.07
      );
    }
  });

  return (
    <>
      {/*
        OrbitControls lives here so it can see the `flipped` prop.
        When viewing the album, disable rotation so pointer-clicks on
        3-D photo frames are not swallowed by a drag gesture.
      */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={14}
        enablePan={false}
        enableRotate={!flipped}
      />

      <group ref={bodyRef}>
        <S90Body isDark={isDark} shutterFired={shutterFired} />
      </group>

      <group ref={galleryRef} position={[0, 0.08, -8]}>
        <PhotoGallery
          photos={photos}
          photoIndex={photoIndex}
          onPrev={onPrev}
          onNext={onNext}
          isDark={isDark}
        />
      </group>

      <ContactShadows
        position={[0, -1.32, 0]}
        opacity={isDark ? 0.45 : 0.24}
        scale={7} blur={2.5} far={3}
      />
    </>
  );
}

// ─── Main Camera component ────────────────────────────────────────────────────
export default function Camera({ isDark, immersive = false }) {
  const [flipped,      setFlipped]      = useState(false);
  const [bootState,    setBootState]    = useState('idle');
  const [shutterFired, setShutterFired] = useState(false);
  const [flashActive,  setFlashActive]  = useState(false);
  const [photos,       setPhotos]       = useState([]);
  const [photoIndex,   setPhotoIndex]   = useState(0);
  const [selfieUrl,    setSelfieUrl]    = useState(null);  // eslint-disable-line

  const streamRef     = useRef(null);
  const bootTimersRef = useRef([]);

  const isReady = bootState === 'ready';

  const stageStyle = {
    background: isDark
      ? 'radial-gradient(circle at 50% 44%, rgba(0,191,166,0.16), transparent 34%), linear-gradient(180deg,#0D0D0D 0%,#071511 100%)'
      : 'radial-gradient(circle at 50% 44%, rgba(0,191,166,0.18), transparent 34%), linear-gradient(180deg,#FFFFFF 0%,#EEFBF8 100%)',
  };

  const loadAlbum = useCallback(() => {
    fetchAlbum()
      .then(urls => setPhotos(urls.map(url => ({ url }))))
      .catch(() => setPhotos([]));
  }, []);

  useEffect(() => { if (flipped) loadAlbum(); }, [flipped, loadAlbum]);

  const triggerFlash = useCallback(() => {
    setShutterFired(true); setFlashActive(true);
    setTimeout(() => setShutterFired(false), 280);
    setTimeout(() => setFlashActive(false),  380);
  }, []);

  const clearBootTimers = useCallback(() => {
    bootTimersRef.current.forEach(clearTimeout);
    bootTimersRef.current = [];
  }, []);

  const startBoot = useCallback(() => {
    if (bootState !== 'idle') return;
    clearBootTimers();
    setBootState('booting');
    setFlipped(false);
    bootTimersRef.current = [
      setTimeout(() => { setFlashActive(true); setShutterFired(true); }, 520),
      setTimeout(() => { setFlashActive(false); setShutterFired(false); }, 820),
      setTimeout(() => setBootState('ready'), 1200),
    ];
  }, [bootState, clearBootTimers]);

  const uploadPhoto = useCallback(async (blob) => {
    const filename = `selfie_${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from(BUCKET).upload(filename, blob, { contentType: 'image/jpeg', upsert: false });
    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
      setSelfieUrl(data.publicUrl);
      setPhotos(prev => [{ url: data.publicUrl }, ...prev]);
    }
  }, []);

  const captureScreenshot = useCallback(async () => {
    try {
      const h2c = (await import('html2canvas')).default;
      const canvas = await h2c(document.body, { useCORS: true, scale: 0.5 });
      const url = canvas.toDataURL('image/jpeg', 0.75);
      setSelfieUrl(url);
      setPhotos(prev => [{ url }, ...prev]);
      setFlipped(true);
      canvas.toBlob(blob => { if (blob) uploadPhoto(blob); }, 'image/jpeg', 0.75);
    } catch { /* ignore */ }
  }, [uploadPhoto]);

  const captureWebcam = useCallback(async () => {
    playShutter(); triggerFlash();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      streamRef.current = stream;
      const video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', '');
      await video.play();
      await new Promise(r => setTimeout(r, 300));
      const canvas = document.createElement('canvas');
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      stream.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      canvas.toBlob(async blob => {
        const url = canvas.toDataURL('image/jpeg', 0.85);
        setSelfieUrl(url);
        setPhotos(prev => [{ url }, ...prev]);
        setFlipped(true);
        if (blob) uploadPhoto(blob);
      }, 'image/jpeg', 0.85);
    } catch { captureScreenshot(); }
  }, [captureScreenshot, triggerFlash, uploadPhoto]);

  const handleShutter = useCallback(() => {
    if (!isReady) { startBoot(); return; }
    captureWebcam();
  }, [captureWebcam, isReady, startBoot]);

  const handleFlip = useCallback(() => {
    if (!isReady) return;
    setFlipped(f => !f);
  }, [isReady]);

  useEffect(() => () => {
    clearBootTimers();
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, [clearBootTimers]);

  const MONO = "'JetBrains Mono', monospace";
  const TEAL = '#00BFA6';

  const btn = (active) => ({
    fontFamily: MONO,
    fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase',
    padding: '9px 18px', borderRadius: 6,
    border: `1px solid ${active ? TEAL : 'rgba(0,191,166,0.28)'}`,
    color: active ? TEAL : 'rgba(0,191,166,0.5)',
    background: active ? 'rgba(0,191,166,0.1)' : 'rgba(0,0,0,0.18)',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.15s',
  });

  return (
    <>
      <div className={`${s.flash} ${flashActive ? s.firing : ''}`} />

      <div
        className={`${s.cameraStage} ${immersive ? s.immersive : ''} ${s[bootState]}`}
        style={{ ...stageStyle, position: 'relative' }}
        onClick={bootState === 'idle' ? startBoot : undefined}
      >
        <div className={s.statusBadge}>
          {bootState === 'idle' ? 'STANDBY' : bootState === 'booting' ? 'POWERING' : 'READY'}
        </div>

        {/* ── Single R3F canvas: camera model + 3D gallery ── */}
        <Canvas
          camera={{ position: [0, 0.4, 6.5], fov: 42 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Environment preset="studio" background={false} />
          <ambientLight intensity={isDark ? 0.7 : 0.9} />
          <directionalLight position={[4, 7, 5]} intensity={1.4} castShadow
            shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-4, 1, -4]} intensity={0.55} color="#c8f0ea" />
          <pointLight position={[-2, 2, 0]} intensity={0.6} color="#00BFA6" />

          <CameraScene
            isDark={isDark}
            shutterFired={shutterFired}
            flipped={flipped}
            photos={photos}
            photoIndex={photoIndex}
            onPrev={() => setPhotoIndex(i => Math.max(0, i - 1))}
            onNext={() => setPhotoIndex(i => Math.min(photos.length - 1, i + 1))}
          />
        </Canvas>

        {/* Shutter button — HTML overlay, top-right */}
        {isReady && !flipped && (
          <div className={s.shutterArea}>
            <button
              className={s.shutterBtn}
              onClick={(e) => { e.stopPropagation(); handleShutter(); }}
              title="Take a selfie"
            />
            <span className={s.shutterLabel}>SHOOT</span>
          </div>
        )}

        {/* Control bar — bottom center */}
        {isReady && (
          <div style={{
            position: 'absolute', bottom: 20, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 8, zIndex: 10, pointerEvents: 'all',
          }}>
            {flipped ? (
              <button style={btn(false)} onClick={(e) => { e.stopPropagation(); handleFlip(); }}>
                ← Camera
              </button>
            ) : (
              <button style={btn(true)} onClick={(e) => { e.stopPropagation(); handleFlip(); }}>
                Album →
              </button>
            )}
          </div>
        )}

        {/* Orbit hint — only on front while ready */}
        {isReady && !flipped && (
          <div style={{
            position: 'absolute', bottom: 20, right: 20,
            fontFamily: MONO, fontSize: '0.48rem', letterSpacing: '0.16em',
            color: `rgba(0,191,166,0.38)`, pointerEvents: 'none',
            textTransform: 'uppercase',
          }}>
            drag to orbit · scroll to zoom
          </div>
        )}
      </div>
    </>
  );
}
