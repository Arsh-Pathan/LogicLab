import { useEffect, useRef } from 'react';

/**
 * Animated SVG hero visual showing logic gate nodes with
 * flowing signal pulses along circuit connections.
 */
export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 520;
    const H = 480;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    // Gate node definitions
    const nodes = [
      { x: 80, y: 80, label: 'INPUT', color: '#8ab4f8', w: 80, h: 36 },
      { x: 80, y: 160, label: 'INPUT', color: '#8ab4f8', w: 80, h: 36 },
      { x: 240, y: 120, label: 'AND', color: '#81c995', w: 70, h: 40 },
      { x: 80, y: 280, label: 'INPUT', color: '#8ab4f8', w: 80, h: 36 },
      { x: 240, y: 260, label: 'NOT', color: '#f28b82', w: 70, h: 40 },
      { x: 400, y: 190, label: 'OR', color: '#c58af9', w: 70, h: 40 },
      { x: 400, y: 320, label: 'XOR', color: '#fdd663', w: 70, h: 40 },
      { x: 80, y: 360, label: 'CLK', color: '#fdd663', w: 80, h: 36 },
    ];

    // Wire connections: [fromIdx, toIdx]
    const wires: [number, number][] = [
      [0, 2], [1, 2], [2, 5], [3, 4], [4, 5], [3, 6], [7, 6],
    ];

    // Signal pulses
    interface Pulse {
      wire: number;
      t: number;
      speed: number;
    }
    const pulses: Pulse[] = wires.map((_, i) => ({
      wire: i,
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
    }));

    let frameId: number;
    let time = 0;

    function getNodeCenter(n: typeof nodes[0]) {
      return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
    }

    function drawRoundedRect(
      cx: CanvasRenderingContext2D,
      x: number, y: number, w: number, h: number, r: number,
    ) {
      cx.beginPath();
      cx.moveTo(x + r, y);
      cx.lineTo(x + w - r, y);
      cx.quadraticCurveTo(x + w, y, x + w, y + r);
      cx.lineTo(x + w, y + h - r);
      cx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      cx.lineTo(x + r, y + h);
      cx.quadraticCurveTo(x, y + h, x, y + h - r);
      cx.lineTo(x, y + r);
      cx.quadraticCurveTo(x, y, x + r, y);
      cx.closePath();
    }

    function draw() {
      if (!ctx) return;
      time += 1;
      ctx.clearRect(0, 0, W, H);

      // Draw wires
      wires.forEach(([from, to]) => {
        const a = getNodeCenter(nodes[from]);
        const b = getNodeCenter(nodes[to]);
        const midX = (a.x + b.x) / 2;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(midX, a.y, midX, b.y, b.x, b.y);
        ctx.strokeStyle = 'rgba(138, 180, 248, 0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw pulses
      pulses.forEach(pulse => {
        pulse.t += pulse.speed;
        if (pulse.t > 1) pulse.t = 0;

        const [from, to] = wires[pulse.wire];
        const a = getNodeCenter(nodes[from]);
        const b = getNodeCenter(nodes[to]);
        const midX = (a.x + b.x) / 2;

        // Cubic bezier interpolation
        const t = pulse.t;
        const t2 = 1 - t;
        const px =
          t2 * t2 * t2 * a.x +
          3 * t2 * t2 * t * midX +
          3 * t2 * t * t * midX +
          t * t * t * b.x;
        const py =
          t2 * t2 * t2 * a.y +
          3 * t2 * t2 * t * a.y +
          3 * t2 * t * t * b.y +
          t * t * t * b.y;

        const sourceColor = nodes[from].color;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = sourceColor;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(px, py, 2, px, py, 10);
        grad.addColorStop(0, sourceColor + '60');
        grad.addColorStop(1, sourceColor + '00');
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const breathe = Math.sin(time * 0.02 + i * 1.5) * 0.05 + 0.95;
        ctx.save();
        ctx.globalAlpha = breathe;

        // Shadow
        ctx.shadowColor = node.color + '30';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;

        // Body
        drawRoundedRect(ctx, node.x, node.y, node.w, node.h, 8);
        ctx.fillStyle = '#2d2d2d';
        ctx.fill();
        ctx.strokeStyle = node.color + '60';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Label
        ctx.fillStyle = node.color;
        ctx.font = '600 11px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x + node.w / 2, node.y + node.h / 2);

        ctx.restore();
      });

      frameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        style={{ width: 520, height: 480 }}
        className="rounded-xl"
      />
      {/* Soft vignette around edges */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 60px 40px var(--bg-app)',
        }}
      />
    </div>
  );
}
