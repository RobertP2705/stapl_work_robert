"use client";

import { useEffect, useRef } from "react";

export function ArchitecturePreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Animation state
    let frame = 0;
    let animationId: number;

    // Node positions
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(rect.width, rect.height) * 0.35;

    const locations = [
      { x: centerX, y: centerY - radius, label: "L0", color: "#0ea5e9" },
      { x: centerX + radius * 0.87, y: centerY - radius * 0.5, label: "L1", color: "#22c55e" },
      { x: centerX + radius * 0.87, y: centerY + radius * 0.5, label: "L2", color: "#eab308" },
      { x: centerX, y: centerY + radius, label: "L3", color: "#a855f7" },
      { x: centerX - radius * 0.87, y: centerY + radius * 0.5, label: "L4", color: "#ec4899" },
      { x: centerX - radius * 0.87, y: centerY - radius * 0.5, label: "L5", color: "#0ea5e9" },
    ];

    // Particle class for data transfer visualization
    class Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      progress: number;
      speed: number;
      color: string;

      constructor(from: typeof locations[0], to: typeof locations[0]) {
        this.x = from.x;
        this.y = from.y;
        this.targetX = to.x;
        this.targetY = to.y;
        this.progress = 0;
        this.speed = 0.01 + Math.random() * 0.01;
        this.color = from.color;
      }

      update() {
        this.progress += this.speed;
        if (this.progress > 1) this.progress = 1;
        this.x = locations[0].x + (this.targetX - locations[0].x) * this.progress;
        this.y = locations[0].y + (this.targetY - locations[0].y) * this.progress;
      }

      isDone() {
        return this.progress >= 1;
      }
    }

    let particles: Particle[] = [];

    const draw = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw connections
      ctx.strokeStyle = "rgba(100, 116, 139, 0.2)";
      ctx.lineWidth = 1;
      for (let i = 0; i < locations.length; i++) {
        for (let j = i + 1; j < locations.length; j++) {
          ctx.beginPath();
          ctx.moveTo(locations[i].x, locations[i].y);
          ctx.lineTo(locations[j].x, locations[j].y);
          ctx.stroke();
        }
      }

      // Draw data transfer particles
      const pulseAlpha = 0.3 + Math.sin(frame * 0.05) * 0.2;
      
      // Spawn new particles occasionally
      if (frame % 30 === 0) {
        const from = locations[Math.floor(Math.random() * locations.length)];
        const to = locations[Math.floor(Math.random() * locations.length)];
        if (from !== to) {
          particles.push(new Particle(from, to));
        }
      }

      // Update and draw particles
      particles = particles.filter(p => !p.isDone());
      particles.forEach(p => {
        p.update();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Draw location nodes
      locations.forEach((loc, i) => {
        // Outer glow
        const gradient = ctx.createRadialGradient(
          loc.x, loc.y, 0,
          loc.x, loc.y, 30
        );
        gradient.addColorStop(0, `${loc.color}${Math.floor(pulseAlpha * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = "#0f172a";
        ctx.fill();
        ctx.strokeStyle = loc.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "bold 12px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(loc.label, loc.x, loc.y);
      });

      // Draw center label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Distributed", centerX, centerY - 8);
      ctx.fillText("Memory", centerX, centerY + 8);

      frame++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative h-[300px] w-full max-w-[400px] rounded-xl border border-border bg-card/50 p-4">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
