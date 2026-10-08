import { useEffect } from 'react';

/**
 * Hook para manejar los efectos interactivos de quemaduras de canvas y chispas.
 * Extraído de App.tsx para mantener el componente principal limpio y mantenible.
 */
export const useInteractiveEffects = () => {
  useEffect(() => {
    const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500', '#fff', '#FFD700', '#FFA500'];
    let isMouseDown = false;
    let sparkInterval: ReturnType<typeof setInterval> | null = null;
    let lastX = 0;
    let lastY = 0;

    //////////////////////////////////////////////////////////EFECTO DE MACHA NEGRA QUEMADURA
    const createStain = (x: number, y: number) => {
      const stain = document.createElement('div');
      const size = 50 + Math.random() * 40;
      
      // Colores de quemadura (negro, marrón oscuro, gris ceniza)
      const burnColors = [
        'rgba(0,0,0,0.4)',      // ← Negro menos intenso
        'rgba(30,15,5,0.35)',   // ← Marrón más suave
        'rgba(50,25,10,0.3)',   // ← Marrón suave
        'rgba(80,40,15,0.25)',  // ← Marrón claro
        'rgba(20,10,5,0.35)',   // ← Marrón suave
      ];

      stain.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 99998;
        width: ${size}px;
        height: ${size}px;
        border-radius: 45% 55% 50% 50% / 50% 45% 55% 50%;
        background: radial-gradient(
          ellipse at center,
          ${burnColors[0]} 0%,
          ${burnColors[1]} 25%,
          ${burnColors[2]} 45%,
          ${burnColors[3]} 60%,
          ${burnColors[4]} 75%,
          transparent 85%
        );
        filter: blur(1px) contrast(1.2);
        top: ${y - size / 2}px;
        left: ${x - size / 2}px;
        transform: scale(0.3) rotate(${Math.random() * 360}deg);
        transition: all 2.5s ease-out;
        animation: burnEffect 2.5s ease-out forwards;
      `;
      document.body.appendChild(stain);

      // Keyframes para la animación de quemadura
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes burnEffect {
          0% {
            transform: scale(0.3) rotate(0deg);
            opacity: 1;
            filter: blur(1px) contrast(1.2);
          }
          30% {
            transform: scale(1.2) rotate(15deg);
            opacity: 0.9;
            filter: blur(2px) contrast(1.5);
          }
          60% {
            transform: scale(1.5) rotate(25deg);
            opacity: 0.6;
            filter: blur(3px) contrast(1.8);
          }
          100% {
            transform: scale(2) rotate(35deg);
            opacity: 0;
            filter: blur(5px) contrast(2);
          }
        }
      `;
      document.head.appendChild(styleSheet);

      // Crear cenizas que caen
      for (let i = 0; i < 5; i++) {
        createAsh(x, y, size);
      }

      setTimeout(() => {
        stain.remove();
        styleSheet.remove();
      }, 2500);
    };

    // Cenizas que caen desde la quemadura
    const createAsh = (x: number, y: number, stainSize: number) => {
      const ash = document.createElement('div');
      const ashSize = 2 + Math.random() * 4;
      const angle = Math.random() * Math.PI * 2;
      const distance = stainSize / 2 * Math.random();
      const startX = x + Math.cos(angle) * distance;
      const startY = y + Math.sin(angle) * distance;
      const fallDistance = 30 + Math.random() * 50;
      const driftX = (Math.random() - 0.5) * 30;
      
      ash.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 99997;
        width: ${ashSize}px;
        height: ${ashSize}px;
        border-radius: 50%;
        background: rgba(30,20,10,0.7);
        box-shadow: 0 0 4px rgba(50,30,15,0.5);
        top: ${startY}px;
        left: ${startX}px;
      `;
      document.body.appendChild(ash);

      ash.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
          { transform: `translate(${driftX}px, ${fallDistance}px) scale(0.3)`, opacity: 0 },
        ],
        {
          duration: 1000 + Math.random() * 800,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }
      ).onfinish = () => ash.remove();
    };

    // Crear una chispa
    const createSpark = (x: number, y: number) => {
      const spark = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 2 + Math.random() * 4;
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 60;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 20;

      spark.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 99999;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 0 6px ${color}, 0 0 12px ${color}, 0 0 20px ${color};
        top: ${y}px;
        left: ${x}px;
      `;
      document.body.appendChild(spark);

      spark.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 },
        ],
        {
          duration: 400 + Math.random() * 500,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }
      ).onfinish = () => spark.remove();

      // Chispa secundaria (50% probabilidad de crear una extra)
      if (Math.random() > 0.5) {
        const spark2 = document.createElement('div');
        const color2 = ['#FFD700', '#fff', '#FFA500'][Math.floor(Math.random() * 3)];
        const size2 = 1 + Math.random() * 2;
        const angle2 = Math.random() * Math.PI * 2;
        const distance2 = 80 + Math.random() * 50;
        const dx2 = Math.cos(angle2) * distance2;
        const dy2 = Math.sin(angle2) * distance2 - 25;

        spark2.style.cssText = `
          position: fixed;
          pointer-events: none;
          z-index: 99999;
          width: ${size2}px;
          height: ${size2}px;
          border-radius: 50%;
          background: ${color2};
          box-shadow: 0 0 4px ${color2}, 0 0 10px ${color2};
          top: ${y}px;
          left: ${x}px;
        `;
        document.body.appendChild(spark2);

        spark2.animate(
          [
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${dx2}px, ${dy2}px) scale(0)`, opacity: 0 },
          ],
          {
            duration: 300 + Math.random() * 400,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }
        ).onfinish = () => spark2.remove();
      }
    };

    // Ráfaga de chispas
    const burstSparks = (x: number, y: number) => {
      for (let i = 0; i < 20; i++) {
        createSpark(x, y);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      lastX = e.clientX;
      lastY = e.clientY;
      createStain(e.clientX, e.clientY);
      burstSparks(e.clientX, e.clientY);

      sparkInterval = setInterval(() => {
        if (isMouseDown) {
          createSpark(lastX, lastY);
          if (Math.random() > 0.7) {
            createSpark(lastX, lastY);
          }
        }
      }, 30);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMouseDown) {
        lastX = e.clientX;
        lastY = e.clientY;
        createSpark(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      if (sparkInterval) {
        clearInterval(sparkInterval);
        sparkInterval = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      createStain(e.clientX, e.clientY);
      burstSparks(e.clientX, e.clientY);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove); 
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClick);
      if (sparkInterval) clearInterval(sparkInterval);
    };
  }, []);
};
