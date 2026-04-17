import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

// Abstract molecular graph: nodes and bonds
function buildMolecule() {
  // Hand-crafted abstract molecule - evocative, not literal
  const nodes = [
    [0, 0, 0],
    [1.6, 0.8, 0.4],
    [-1.4, 0.9, 0.2],
    [0.2, -1.5, 0.6],
    [1.8, -0.6, -0.8],
    [-0.6, 1.8, -0.4],
    [-1.2, -1.2, -0.6],
    [2.4, 1.6, -0.2],
    [-2.2, 0.2, 1.0],
    [0.4, 2.2, 1.2],
    [1.0, -2.4, -0.4],
    [-0.2, -0.4, -2.0],
    [2.0, 0.0, 1.6],
    [-1.6, -0.6, 1.8],
  ];

  const bonds = [
    [0, 1], [0, 2], [0, 3],
    [1, 4], [1, 7], [1, 12],
    [2, 5], [2, 8],
    [3, 6], [3, 10],
    [4, 10], [4, 11],
    [5, 9], [6, 11],
    [7, 9], [8, 13],
    [9, 12], [10, 11],
    [12, 13], [6, 13],
  ];

  return { nodes, bonds };
}

export default function MoleculeCanvas({ isDark, scrollY }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    const { nodes, bonds } = buildMolecule();

    const accentColor = new THREE.Color('#00BFA6');
    const greyColor = new THREE.Color(isDark ? '#444444' : '#CCCCCC');
    const dimColor = new THREE.Color(isDark ? '#2A2A2A' : '#E5E5E5');

    // Node spheres
    const sphereGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const nodeMeshes = nodes.map((pos, i) => {
      const mat = new THREE.MeshPhongMaterial({
        color: i === 0 ? accentColor : (i % 4 === 0 ? accentColor : greyColor),
        shininess: 80,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...pos);
      scene.add(mesh);
      return mesh;
    });

    // Bond cylinders
    const bondMeshes = bonds.map(([a, b]) => {
      const posA = new THREE.Vector3(...nodes[a]);
      const posB = new THREE.Vector3(...nodes[b]);
      const mid = posA.clone().add(posB).multiplyScalar(0.5);
      const dir = posB.clone().sub(posA);
      const length = dir.length();
      const geo = new THREE.CylinderGeometry(0.025, 0.025, length, 6);
      const mat = new THREE.MeshPhongMaterial({
        color: dimColor,
        transparent: true,
        opacity: 0.6,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(mid);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      scene.add(mesh);
      return mesh;
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.4 : 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight('#00BFA6', isDark ? 1.2 : 0.6);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight2.position.set(-5, -3, 2);
    scene.add(dirLight2);

    // Group for rotation
    const group = new THREE.Group();
    nodeMeshes.forEach(m => group.add(m));
    bondMeshes.forEach(m => group.add(m));
    scene.add(group);

    stateRef.current = { group, renderer, scene, camera };

    // Mouse tracking
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Resize handler
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    let frame;
    let t = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      t += 0.005;

      // Gentle auto-rotation
      group.rotation.y = t * 0.4 + mouse.x * 0.3;
      group.rotation.x = Math.sin(t * 0.2) * 0.15 + mouse.y * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
