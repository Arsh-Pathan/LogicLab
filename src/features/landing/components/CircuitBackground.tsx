import { useEffect, useRef } from 'react';

export default function CircuitBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationId: number;

    // Dynamic import — Three.js only loads when this component mounts
    import('three').then((THREE) => {
      if (disposed) return;

      const w = container.clientWidth;
      const h = container.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      camera.position.z = 40;

      const geometry = new THREE.TorusKnotGeometry(12, 3, 200, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0,
        metalness: 0.9,
        roughness: 0.1,
      });

      const core = new THREE.Mesh(geometry, material);
      scene.add(core);

      const originalPositions = geometry.attributes.position.array.slice();

      const particlesCount = 2000;
      const particlesGeom = new THREE.BufferGeometry();
      const partPos = new Float32Array(particlesCount * 3);
      for(let i=0; i<particlesCount * 3; i++) partPos[i] = (Math.random() - 0.5) * 200;
      particlesGeom.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
      const particlesMat = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
      });
      const stars = new THREE.Points(particlesGeom, particlesMat);
      scene.add(stars);

      const light1 = new THREE.PointLight(0x3b82f6, 5, 100);
      light1.position.set(20, 20, 20);
      scene.add(light1);

      const light2 = new THREE.PointLight(0x60a5fa, 3, 100);
      light2.position.set(-20, -20, 10);
      scene.add(light2);

      scene.add(new THREE.AmbientLight(0xffffff, 0.05));

      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const onMouseMove = (e: MouseEvent) => {
        targetX = (e.clientX - window.innerWidth / 2) * 0.001;
        targetY = (e.clientY - window.innerHeight / 2) * 0.001;
      };
      window.addEventListener('mousemove', onMouseMove);

      let time = 0;
      const animate = () => {
        if (disposed) return;
        animationId = requestAnimationFrame(animate);
        time += 0.002;

        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const x = originalPositions[i];
          const y = originalPositions[i+1];
          const z = originalPositions[i+2];

          const noise = Math.sin(x * 0.05 + time * 2) * Math.cos(y * 0.05 + time * 2) * 1.5;
          const factor = 1 + noise * 0.03;

          positions[i] = x * factor;
          positions[i+1] = y * factor;
          positions[i+2] = z * factor;
        }
        geometry.attributes.position.needsUpdate = true;

        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        core.rotation.y = time + mouseX * 2;
        core.rotation.x = mouseY * 2;

        stars.rotation.y -= 0.0001;
        stars.position.y = Math.sin(time) * 2;

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Store cleanup in the disposed flag — cleanup function below uses it
      const originalCleanup = () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', onMouseMove);
        cancelAnimationFrame(animationId);
        geometry.dispose();
        material.dispose();
        particlesGeom.dispose();
        particlesMat.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };

      // Attach cleanup so the effect's return function can call it
      (container as any).__threeCleanup = originalCleanup;
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      const cleanup = (container as any).__threeCleanup;
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 bg-black pointer-events-none"
    />
  );
}
