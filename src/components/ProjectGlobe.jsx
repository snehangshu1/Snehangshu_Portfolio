import { useEffect, useRef } from "react";

const ProjectGlobe = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Dotted Globe Particles
    const particles = [];
    const particleCount = 280;
    const sphereRadius = Math.min(width, height) * 0.38;
    
    // Mouse coordinates relative to canvas
    let mouse = { x: -1000, y: -1000, active: false };

    // Initialize particles in 3D sphere shape
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.acos(Math.random() * 2 - 1); // 0 to PI
      const phi = Math.random() * Math.PI * 2;       // 0 to 2*PI

      particles.push({
        x: sphereRadius * Math.sin(theta) * Math.cos(phi),
        y: sphereRadius * Math.sin(theta) * Math.sin(phi),
        z: sphereRadius * Math.cos(theta),
        baseX: 0,
        baseY: 0,
        baseZ: 0,
        color: Math.random() > 0.4 ? "#BE123C" : "#F5F5F5", // Red vs White
        size: Math.random() * 1.5 + 0.8,
      });
      // Save initial coordinates
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

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Center coordinates
      const cx = width / 2;
      const cy = height / 2;

      // Project and draw particles
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Rotate particles in 3D
        rotateX(p, angleX);
        rotateY(p, angleY);

        // Perspective projection
        const fov = 600;
        const cameraDistance = sphereRadius * 2.3;
        const scale = fov / (fov + p.z + cameraDistance);
        
        let projX = p.x * scale + cx;
        let projY = p.y * scale + cy;

        // Mouse reaction (warp points near mouse)
        if (mouse.active) {
          const dx = projX - mouse.x;
          const dy = projY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;

          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            // Pull or push points slightly
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
          alpha: (p.z + sphereRadius) / (sphereRadius * 2), // Fade back points
        });
      }

      // Draw connection lines first (glowing network structure)
      ctx.lineWidth = 0.45;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.z < -20) continue; // Only draw connections for points on front-side for clarity

        let connections = 0;
        for (let j = i + 1; j < projected.length; j++) {
          if (connections >= 2) break; // Limit connections per node for premium look
          
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
        
        // Premium glow effect for prominent particles
        if (p.z > sphereRadius * 0.5) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = p.color === "#BE123C" ? `rgba(190, 18, 60, ${p.alpha * 0.95})` : `rgba(245, 245, 245, ${p.alpha * 0.9})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0; // Reset shadow

      // Draw a subtle outer halo ring
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
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="project-globe-wrapper">
      <canvas ref={canvasRef} className="project-globe-canvas" />
    </div>
  );
};

export default ProjectGlobe;
