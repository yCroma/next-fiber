import { useRef, useEffect } from "react";

/**
 * キーフレームアニメーションのカスタムフック
 * callbackに対して、deltaTimeを与える
 * 想定される使用方法は、three.jsのAnimationMixerのupdateメソッドに
 * deltaTimeを与えて、アニメーションを進めること
 */

/**
 * // callback関数は第一引数がdeltaTimeであることを想定している
 * // callback
 * const animate = (deltaTime: DOMHighResTimeStamp) => {
 *   AnimationMixer.update(deltaTime)
 * }
 * // customhook
 * useAnimation(animate)
 */

const useAnimation = (callback: Function, watch: Array<any>) => {
  const animationRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const animate = (time: DOMHighResTimeStamp) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
    }
    const deltaTime = (time - previousTimeRef.current!) * 0.001;
    callback(deltaTime);
    previousTimeRef.current = time;
    animationRef.current = requestAnimationFrame(animate);
  };
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [...watch]);
};

export default useAnimation;
