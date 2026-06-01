import { useEffect, useRef } from "react";
import { useDeviceInfo, rafThrottle } from "../hooks/useMobile";

const ProjectGlobe = () => {
  const canvasRef = useRef(null);
  const device = useDeviceInfo();

  useEffect(() => {
    // On mobile: skip the canvas animation entirely
    if (device.isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const dpr = Math.min(window.devicePixelRatio, device.isTablet ? 1.5 : 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Reduce particles on tablet
    const particleCount = device.isTablet ? 140 : 280;
    const particles = [];
    const sphereRadius = Math.min(width, height) * 0.38;
    
    // Mouse coordinates relative to canvas — cached rect
    let mouse = { x: -1000, y: -1000, active: false };
    let cachedRect = canvas.getBoundingClientRect();

    // Initialize particles in 3D sphere shape
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.acos(Math.random() * 2 - 1);
      const phi = Math.random() * Math.PI * 2;

      particles.push({
        x: sphereRadius * Math.sin(theta) * Math.cos(phi),
        y: sphereRadius * Math.sin(theta) * Math.sin(phi),
        z: sphereRadius * Math.cos(theta),
        baseX: 0,
        baseY: 0,
        baseZ: 0,
        color: Math.random() > 0.4 ? "#BE123C" : "#F5F5F5",
        size: Math.random() * 1.5 + 0.8,
      });
      particles[i].baseX = particles[i].x;
      particles[i].baseY = particles[i].y;
      particles[i].baseZ = particles[i].z;
    }

    // Rotation angles
    let angleX = 0.0025;
    let angleY = 0.0035;

    const rotateX = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = point.y * cos - point.z * sin;
      const z = point.z * cos + point.y * sin;
      point.y = y;
      point.z = z;
    };

    const rotateY = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = point.x * cos - point.z * sin;
      const z = point.z * cos + point.x * sin;
      point.x = x;
      point.z = z;
    };

    // Throttle mousemove with RAF guard + use cached rect
    const handleMouseMove = rafThrottle((e) => {
      mouse.x = e.clientX - cachedRect.left;
      mouse.y = e.clientY - cachedRect.top;
      mouse.active = true;
    });

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Reduce max connections on tablet
    const maxConnections = device.isTablet ? 1 : 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        rotateX(p, angleX);
        rotateY(p, angleY);

        const fov = 600;
        const cameraDistance = sphereRadius * 2.3;
        const scale = fov / (fov + p.z + cameraDistance);
        
        let projX = p.x * scale + cx;
        let projY = p.y * scale + cy;

        // Mouse reaction
        if (mouse.active) {
          const dx = projX - mouse.x;
          const dy = projY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;

          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            projX += (dx / dist) * force * 15;
            projY += (dy / dist) * force * 15;
          }
        }

        projected.push({
          x: projX,
          y: projY,
          z: p.z,
          size: p.size * scale * 2.2,
          color: p.color,
          alpha: (p.z + sphereRadius) / (sphereRadius * 2),
        });
      }

      // Draw connection lines
      ctx.lineWidth = 0.45;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.z < -20) continue;

        let connections = 0;
        for (let j = i + 1; j < projected.length; j++) {
          if (connections >= maxConnections) break;
          
          const p2 = projected[j];
          if (p2.z < -20) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            const alpha = (1 - dist / 65) * p1.alpha * 0.28;
            ctx.strokeStyle = p1.color === "#BE123C" ? `rgba(190, 18, 60, ${alpha})` : `rgba(245, 245, 245, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw particles on top
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        if (p.z > sphereRadius * 0.5) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = p.color === "#BE123C" ? `rgba(190, 18, 60, ${p.alpha * 0.95})` : `rgba(245, 245, 245, ${p.alpha * 0.9})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Subtle outer halo ring
      ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius + 15, 0, Math.PI * 2);
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const newDpr = Math.min(window.devicePixelRatio, device.isTablet ? 1.5 : 2);
      canvas.width = width * newDpr;
      canvas.height = height * newDpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(newDpr, newDpr);
      // Refresh cached rect
      cachedRect = canvas.getBoundingClientRect();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [device.isMobile, device.isTablet]);

  // Mobile: render a lightweight static SVG placeholder
  if (device.isMobile) {
    return (
      <div className="project-globe-wrapper">
        <svg viewBox="0 0 200 200" className="project-globe-canvas" style={{ width: '100%', height: '100%', opacity: 0.6 }}>
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(190, 18, 60, 0.15)" strokeWidth="1" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(190, 18, 60, 0.08)" strokeWidth="0.5" />
          {/* Scattered dots */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const r = 30 + Math.random() * 50;
            return (
              <circle
                key={i}
                cx={100 + Math.cos(angle) * r}
                cy={100 + Math.sin(angle) * r}
                r={1 + Math.random() * 1.5}
                fill={i % 3 === 0 ? "rgba(190, 18, 60, 0.5)" : "rgba(245, 245, 245, 0.3)"}
              />
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <div className="project-globe-wrapper">
      <canvas ref={canvasRef} className="project-globe-canvas" />
    </div>
  );
};

export default ProjectGlobe;
