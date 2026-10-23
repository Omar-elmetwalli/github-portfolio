"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  alpha: number;
  speed: number;
  color: string;
}

export default function StreamlineCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse coordinates for gentle interactive disturbance
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    const colors = [
      "rgba(56, 189, 248, 0.45)",  // Sky blue
      "rgba(99, 102, 241, 0.40)",  // Indigo
      "rgba(14, 165, 233, 0.35)",  // Cyan
      "rgba(147, 197, 253, 0.30)", // Light blue
    ];

    const particleCount = Math.min(85, Math.floor((width * height) / 10000));
    const particles: Particle[] = [];

    // Airfoil virtual obstruction center
    const foilX = width * 0.55;
    const foilY = height * 0.52;
    const chord = Math.min(260, width * 0.35);

    function initParticle(p?: Particle): Particle {
      const startY = Math.random() * height;
      const speed = 2.2 + Math.random() * 2.8;
      return {
        x: p ? -Math.random() * 80 : Math.random() * width,
        y: startY,
        vx: speed,
        vy: 0,
        length: 18 + Math.random() * 32,
        alpha: 0.15 + Math.random() * 0.55,
        speed: speed,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(initParticle());
    }

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    }

    function handleMouseLeave() {
      targetMouseX = -1000;
      targetMouseY = -1000;
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Pause when canvas is off-screen using IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Pause when tab is not active
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    function render() {
      if (!ctx) return;

      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;

      // Soft clear with slight persistence for aerodynamic streak effect
      ctx.clearRect(0, 0, width, height);

      // Draw faint aerodynamic velocity field gridlines
      ctx.strokeStyle = "rgba(56, 189, 248, 0.025)";
      ctx.lineWidth = 1;
      const stepY = 38;
      for (let y = 0; y < height; y += stepY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        // Subtle streamline curve around virtual airfoil
        const distY = Math.abs(y - foilY);
        const deflection = distY < 120 ? (1 - distY / 120) * 12 : 0;
        ctx.bezierCurveTo(
          foilX - chord * 0.5,
          y - deflection,
          foilX + chord * 0.5,
          y + deflection * 0.5,
          width,
          y
        );
        ctx.stroke();
      }

      // Draw particles / streamlines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Deflection around virtual airfoil
        const dxFoil = p.x - foilX;
        const dyFoil = p.y - foilY;
        const distFoilSq = dxFoil * dxFoil + dyFoil * dyFoil;

        if (distFoilSq < 14000) {
          const force = (1 - distFoilSq / 14000) * 1.8;
          p.vy += (p.y > foilY ? 1 : -1) * force * 0.4;
        }

        // Deflection from cursor
        const dxMouse = p.x - mouseX;
        const dyMouse = p.y - mouseY;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
        if (distMouseSq < 18000) {
          const mouseForce = (1 - distMouseSq / 18000) * 2.5;
          p.vy += (p.y > mouseY ? 1 : -1) * mouseForce * 0.5;
        }

        // Damping and restoring vertical velocity
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;

        // Draw glowing streamline line
        ctx.beginPath();
        const grad = ctx.createLinearGradient(p.x - p.length, p.y - p.vy * 4, p.x, p.y);
        grad.addColorStop(0, "rgba(56, 189, 248, 0)");
        grad.addColorStop(0.7, p.color);
        grad.addColorStop(1, "rgba(255, 255, 255, 0.85)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.moveTo(p.x - p.length, p.y - p.vy * 3);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Particle head glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();

        // Respawn when off screen
        if (p.x - p.length > width) {
          particles[i] = initParticle(p);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full opacity-60 dark:opacity-75"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
