import React, { useEffect } from 'react';

export const SparkCursor: React.FC = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Número de chispas por clic
      const sparkCount = 12;

      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';

        // Posición exacta del clic
        spark.style.left = `${e.clientX}px`;
        spark.style.top = `${e.clientY}px`;

        // Dirección y distancia aleatoria de cada chispa
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 60 + 20; // Distancia del destello
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        // Asignar variables CSS personalizadas para la animación
        spark.style.setProperty('--tx', `${tx}px`);
        spark.style.setProperty('--ty', `${ty}px`);

        // Colores aleatorios de soldadura (fuego / chispas eléctricas)
        const colors = ['#FFD700', '#FF4500', '#FFA500', '#00FFFF', '#FFFFFF'];
        spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        document.body.appendChild(spark);

        // Limpiar el elemento DOM cuando termina la animación
        setTimeout(() => {
          spark.remove();
        }, 600);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return null;
};