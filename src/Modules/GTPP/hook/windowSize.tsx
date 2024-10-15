import { useState, useEffect, useMemo } from 'react';

type WindowSize = {
  width: number;
  height: number;
};

export const useWindowSize = (): WindowSize => {
  // Tipando o estado como um objeto com width e height
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      window.addEventListener('resize', handleResize);

      // Chamando handleResize uma vez para definir os valores iniciais
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Usando useMemo para memorizar o objeto windowSize
  const memoizedWindowSize = useMemo(() => windowSize, [windowSize]);

  return memoizedWindowSize;
};
