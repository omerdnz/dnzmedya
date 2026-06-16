'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CODE_SNIPPETS = [
  "const app = express();",
  "app.use(cors());",
  "await prisma.user.create({",
  "  data: { email, role }",
  "});",
  "export default async function Page() {",
  "  const data = await fetch('/api');",
  "  return <Hero data={data} />;",
  "}",
  "interface Service {",
  "  id: string;",
  "  title: string;",
  "  slug: string;",
  "}",
  "npm run build && deploy",
  "git push origin main",
  "docker compose up -d",
  "SELECT * FROM services",
  "WHERE is_published = true;",
  "const seo = generateMetadata({",
  "  title: 'DNZMEDYA',",
  "  description: '...'",
  "});",
  "motion.div animate={{ opacity: 1 }}",
  "tailwind.config theme.extend",
  "next.config.ts optimizePackageImports",
  "pnpm turbo run build --filter=web",
  "useEffect(() => { init(); }, []);",
  "return res.status(201).json(data);",
  "className='glass rounded-2xl'",
  "transform: translateZ(40px);",
  "await cache.set(key, value, 3600);",
  "logger.info('Request handled');",
];

const COLORS = ['#00CED1', '#D4AF37', '#64748B', '#94A3B8', '#40E8EB', '#F0D060'];

interface FloatingLine {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  color: string;
  size: number;
}

export function CodeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<FloatingLine[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function initLines() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      linesRef.current = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        text: CODE_SNIPPETS[i % CODE_SNIPPETS.length],
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 0.15 + Math.random() * 0.35,
        opacity: 0.04 + Math.random() * 0.08,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 11 + Math.random() * 4,
      }));
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const line of linesRef.current) {
        ctx.font = `${line.size}px 'Courier New', monospace`;
        ctx.fillStyle = line.color;
        ctx.globalAlpha = line.opacity;
        ctx.fillText(line.text, line.x, line.y);

        line.y -= line.speed;
        if (line.y < -20) {
          line.y = h + 20;
          line.x = Math.random() * w;
          line.text = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        }
      }

      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(draw);
    }

    resize();
    initLines();
    draw();

    const onResize = () => {
      resize();
      initLines();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark/95 to-brand-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0C1018_75%)]" />
    </div>
  );
}

export function Grid3DBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 grid-pattern opacity-40"
        style={{
          transform: 'perspective(800px) rotateX(60deg) scale(2)',
          transformOrigin: 'center top',
        }}
      />
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-brand-cyan/5 to-transparent"
      />
    </div>
  );
}

export function ParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-brand-cyan/40"
          style={{
            left: `${(i * 17 + 5) % 100}%`,
            top: `${(i * 23 + 10) % 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + (i % 5),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}
