// Client Side Renderer
import { useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

const CSRenderer = () => {
  const TargetRef = useRef(null!);
  const store = {};
  const futureProps = {
    fbxuri: '/test.fbx',
  };
  useEffect(() => {
    console.log('Ref: ', TargetRef);
    console.log('Dom: ', TargetRef.current);
    const Target: HTMLDivElement = TargetRef.current;
    console.log('width: ', Target.clientWidth);
    console.log('width: ', Target.offsetWidth);
    const appendClildren = [];
    dat();
    init();
    function init() {
      const Renderer = new THREE.WebGLRenderer();
      Renderer.setPixelRatio(window.devicePixelRatio);
      Renderer.domElement.width = Target.clientWidth;
      Target.appendChild(Renderer.domElement);
      animate();
    }
    function dat() {
      const root = new GUI({ autoPlace: false });
      Target.appendChild(root.domElement);
      appendClildren.push(root.domElement);
    }
    function DoAppendChildren() {
      console.log('appendClildren: ', appendClildren);
    }
    function animate() {
      requestAnimationFrame(animate);
      //console.log('Target clientWidth: ', Target.clientWidth);
    }
    function resizeRendererToDisplaySize();
    console.log('Dom afterthree: ', TargetRef.current);
  }, []);
  return <Box sx={{ width: '100%' }} ref={TargetRef}></Box>;
};

export default CSRenderer;
