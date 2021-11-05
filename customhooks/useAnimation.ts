import { useRef, useEffect } from "react";

/**
 * 引数のcallbackの第一引数はdeltaTime
 */

const useAnimation = (callback: Function) => {
  const animationRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const animate = (time) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
    }
    const deltaTime = (time - previousTimeRef.current) * 0.001;
    callback(deltaTime);
    previousTimeRef.current = time;
    animationRef.current = requestAnimationFrame(animate);
  };
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);
};

export default useAnimation;
