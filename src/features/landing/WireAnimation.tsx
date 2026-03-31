import { useEffect, useRef } from 'react';

interface Wire {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

interface Particle {
  wireIndex: number;
  t: number;
  speed: number;
  size: number;
  opacity: number;
}

/**
 * Full-width decorative circuit wire animation with curvy bezier wires
 * and glowing data particles flowing through them.
 */
export default function WireAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let W = canvas.parentElement?.clientWidth || window.innerWidth;
    let H = 200;

    function resize() {
      W = canvas!.parentElement?.clientWidth || window.innerWidth;
      H = 200;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.scale(dpr, dpr);
      generateWires();
    }

    const colors = [
      'rgba(138, 180, 248, 0.5)',
      'rgba(129, 201, 149, 0.5)',
      'rgba(197, 138, 249, 0.5)',
      'rgba(253, 214, 99, 0.5)',
      'rgba(242, 139, 130, 0.5)',
    ];

    const glowColors = [
      '#8ab4f8',
      '#81c995',
      '#c58af9',
      '#fdd663',
      '#f28b82',
    ];

    let wires: Wire[] = [];
    let particles: Particle[] = [];

    function generateWires() {
      wires = [];
      particles = [];
      const wireCount = Math.max(5, Math.floor(W / 200));

      for (let i = 0; i < wireCount; i++) {
        const startX = (W / (wireCount + 1)) * (i + 1) + (Math.random() - 0.5) * 60;
        const pointCount = 3 + Math.floor(Math.random() * 3);
        const points: { x: number; y: number }[] = [];

        for (let j = 0; j < pointCount; j++) {
          points.push({
            x: startX + (Math.random() - 0.5) * 150,
            y: (H / (pointCount - 1)) * j,
          });
        }

        wires.push({
          points,
          color: colors[i % colors.length],
          width: 1.5 + Math.random(),
        });

        // Multiple particles per wire
        const particleCount = 2 + Math.floor(Math.random() * 2);
        for (let p = 0; p < particleCount; p++) {
          particles.push({
            wireIndex: i,
            t: Math.random(),
            speed: 0.002 + Math.random() * 0.003,
            size: 2 + Math.random() * 2,
            opacity: 0.6 + Math.random() * 0.4,
          });
        }
      }
    }

    function getCatmullRomPoint(
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number },
      t: number,
    ) {
      const t2 = t * t;
      const t3 = t2 * t;
      return {
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      };
    }

    function getPointOnWire(wire: Wire, t: number) {
      const pts = wire.points;
      const totalSegments = pts.length - 1;
      const segment = Math.min(Math.floor(t * totalSegments), totalSegments - 1);
      const localT = t * totalSegments - segment;

      const p0 = pts[Math.max(0, segment - 1)];
      const p1 = pts[segment];
      const p2 = pts[Math.min(pts.length - 1, segment + 1)];
      const p3 = pts[Math.min(pts.length - 1, segment + 2)];

      return getCatmullRomPoint(p0, p1, p2, p3, localT);
    }

    function drawWire(wire: Wire) {
      if (!ctx) return;
      ctx.beginPath();
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const pt = getPointOnWire(wire, i / steps);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = wire.color;
      ctx.lineWidth = wire.width;
      ctx.stroke();
    }

    let frameId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Draw wires
      wires.forEach(drawWire);

      // Draw particles
      particles.forEach(particle => {
        particle.t += particle.speed;
        if (particle.t > 1) particle.t -= 1;

        const wire = wires[particle.wireIndex];
        if (!wire) return;
        const pt = getPointOnWire(wire, particle.t);
        const gColor = glowColors[particle.wireIndex % glowColors.length];

        // Glow
        const grad = ctx.createRadialGradient(
          pt.x, pt.y, 0,
          pt.x, pt.y, particle.size * 4,
        );
        grad.addColorStop(0, gColor + 'aa');
        grad.addColorStop(1, gColor + '00');
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = gColor;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      frameId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden" style={{ height: 200 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
