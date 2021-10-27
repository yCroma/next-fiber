import type { NextPage } from "next";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const Effect: NextPage = () => {
  const [count, setCount] = useState(0);

  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);

  const animate = (time: DOMHighResTimeStamp) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      setCount((prevCount) => (prevCount + deltaTime * 0.01) % 100);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <>
      <h1>Hello</h1>
      <div>{Math.round(count)}</div>
    </>
  );
};

export default Effect;
