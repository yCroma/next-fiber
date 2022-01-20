// Client Side Renderer
import { useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI, GUIController } from 'dat.gui';
import clone from 'clone';

const CSRenderer = ({
  fbxurl,
  mode,
  settings,
  settingsRef,
  CommentClipRef,
  newCommentClipRef,
}: {
  fbxurl: string;
  mode: string;
  settings?: Object;
  settingsRef?: Object;
  CommentClipRef?: Object;
  newCommentClipRef?: Object;
}) => {
  const TargetRef = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    const Target: HTMLDivElement = TargetRef.current;
    // initialization
    const width = Target.clientWidth | 400;
    const height = Target.clientHeight | 300;
    // Scene
    const Scene: THREE.Scene = new THREE.Scene();
    Scene.background = new THREE.Color(0xf0f0f0);
    // Renderer
    const Renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    /**
     * レンダラーは必ずsetSizeしてください
     * 挙動が不安定になります
     */
    Renderer.setSize(width, height);
    Renderer.setPixelRatio(window.devicePixelRatio);
    Target.appendChild(Renderer.domElement);
    // Camera
    const Camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      45,
      width / height,
      1,
      1000
    );
    Camera.position.set(0, 10, 50);
    Scene.add(Camera);
    // OrbitControls
    const Controls: OrbitControls = new OrbitControls(
      Camera,
      Renderer.domElement
    );
    Controls.target = new THREE.Vector3(0, 5, 0);
    Controls.update();
    // Lights
    // HemisphereLight
    const HemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    // DirectionalLight
    const DirectionalLight = new THREE.DirectionalLight(0xffffff);
    // AmbientLight
    const AmbientLight = new THREE.AmbientLight(0xffffff, 0);
    // Array Lights
    const Lights: [
      THREE.HemisphereLight,
      THREE.DirectionalLight,
      THREE.AmbientLight
    ] = [HemisphereLight, DirectionalLight, AmbientLight];
    Lights.forEach((light: THREE.Light) => {
      Scene.add(light);
    });
    // Clock
    const Clock: THREE.Clock = new THREE.Clock();
    // Model
    const Model: {
      model?: THREE.Group;
      mixer?: THREE.AnimationMixer;
      animations?: THREE.AnimationClip[];
      actions?: THREE.AnimationAction[];
      loaded: boolean;
    } = LoadModel(fbxurl);
    // Helpers
    // axesHelper
    const axesHelper = new THREE.AxesHelper(1000);
    Scene.add(axesHelper);
    // cameraHelper
    const cameraHelper = new THREE.CameraHelper(Camera);
    // Scene.add(cameraHelper);

    // adds
    // preset
    const Settings = settings || {
      clips: clone(DefaultClip),
      presets: clone(DefaultPreset),
    };
    /**
     * 方針：
     * 1. .listen()が適応できない値はParamsを介して操作する
     * 2. Paramsに関連する値はonChange毎にupdateすること(.listen()でないと自動で更新されないから)
     * 3. action, preset 共に初期値のindexは0
     * 4. modelに関するもの(actions等)は、watchModelLoad()で初期化
     * 5. clip の初期値はdefault。このクリップは削除もさせない
     *    理由は、datGUIの勝手なソーティングで初期値がずらされ
     *    ることを避けるため
     */
    const Params = {
      preset: Settings['clips'][Object.keys(Settings['clips'])[0]]['preset'],
      presets: Settings!['presets'],
      clip: 'default',
      clips: Settings['clips'],
      actions: [0],
      controllers: {
        animation: {
          action: 0,
          time: 0,
          start: 0,
          end: 0,
          velocity: 0,
        },
        camera: {
          position: {
            reset: resetPosition,
          },
          lookat: {
            x: 0,
            y: 5,
            z: 0,
            reset: resetTarget,
          },
        },
        model: {
          velocity: 1.0,
          scale: 1.0,
        },
      },
      parameters: {
        background: `#${Scene.background.getHexString()}`,
        lights: {
          HemisphereLight: {
            skyColor: `#${HemisphereLight.color.getHexString()}`,
            groundColor: `#${HemisphereLight.groundColor.getHexString()}`,
            intensity: HemisphereLight.intensity,
          },
          DirectionalLight: {
            color: `#${DirectionalLight.color.getHexString()}`,
            intensity: DirectionalLight.intensity,
          },
          AmbientLight: {
            color: `#${AmbientLight.color.getHexString()}`,
            intensity: AmbientLight.intensity,
          },
        },
      },
      helpers: {
        axes: true,
        camera: false,
      },
      editors: {
        clips: {
          addClip: addClip,
          addName: '',
          updateClip: updateClip,
          removeClip: removeClip,
        },
        presets: {
          addPreset: addPreset,
          addName: '',
          updatePreset: updatePreset,
          removePreset: removePreset,
        },
      },
    };
    // dat.GUI
    const root = new GUI({ autoPlace: false });
    const editGUI = new GUI({ autoPlace: false });
    Target.appendChild(root.domElement);
    root.domElement.style.position = 'absolute';
    root.domElement.style.top = '2px';
    root.domElement.style.right = `2px`;
    if (mode === 'edit' || mode === 'upload') {
      Target.appendChild(editGUI.domElement);
      editGUI.domElement.style.position = 'absolute';
      editGUI.domElement.style.top = '2px';
      editGUI.domElement.style.left = `2px`;
    }
    // folders
    // h1(hierarky 1)
    const folder1 = root.addFolder('controllers');
    const folder2 = root.addFolder('clips');
    const folder3 = root.addFolder('presets');
    const folder4 = root.addFolder('helpers');
    const folder5 = editGUI.addFolder('editor');
    // h2(hierarky 2)
    // controllers
    const folder11 = folder1.addFolder('animation');
    const folder12 = folder1.addFolder('camera');
    const folder13 = folder1.addFolder('model');
    // clips
    const ClipController = folder2
      .add(Params, 'clip', Object.keys(Params.clips))
      .onChange(AdaptClip);
    const folder21 = folder2.addFolder('parameter');
    // presets
    const PresetController = folder3
      .add(Params, 'preset', Object.keys(Params.presets))
      .onChange(AdaptPreset);
    const folder31 = folder3.addFolder('parameter');
    // editor
    const folder51 = folder5.addFolder('clips');
    const folder52 = folder5.addFolder('presets');
    // h3(hierarky 3)
    // controllers
    const folder120 = folder12.addFolder('position');
    const folder121 = folder12.addFolder('lookAt');
    // h4(hierarky 4)
    // presets
    folder31.addColor(Params.parameters, 'background').onChange((value) => {
      Scene.background = new THREE.Color(value);
    });
    const folder311 = folder31.addFolder('lights');
    const folder3111 = folder311.addFolder('hemisphereLight');
    const folder3112 = folder311.addFolder('directionalLight');
    const folder3113 = folder311.addFolder('ambientLight');
    /**
     * モデルの読み込みの影響を受けるため、
     * watchModelLoad()内部で宣言している
     */
    // Lights
    // HemisphereLight
    folder3111
      .addColor(Params.parameters.lights.HemisphereLight, 'skyColor')
      .onChange((value) => {
        Params.parameters.lights.HemisphereLight.skyColor = value;
        HemisphereLight.color = new THREE.Color(value);
      });
    folder3111
      .addColor(Params.parameters.lights.HemisphereLight, 'groundColor')
      .onChange((value) => {
        Params.parameters.lights.HemisphereLight.groundColor = value;
        HemisphereLight.groundColor = new THREE.Color(value);
      });
    folder3111
      .add(Params.parameters.lights.HemisphereLight, 'intensity', 0, 4, 0.1)
      .onChange((value) => {
        Params.parameters.lights.HemisphereLight.intensity = value;
        HemisphereLight.intensity = value;
      });
    // DirectionalLight
    folder3112
      .addColor(Params.parameters.lights.DirectionalLight, 'color')
      .onChange((value) => {
        Params.parameters.lights.DirectionalLight.color = value;
        DirectionalLight.color = new THREE.Color(value);
      });
    folder3112
      .add(Params.parameters.lights.DirectionalLight, 'intensity', 0, 4, 0.1)
      .onChange((value) => {
        Params.parameters.lights.DirectionalLight.intensity = value;
        DirectionalLight.intensity = value;
      });
    // AmbientLight
    folder3113
      .addColor(Params.parameters.lights.AmbientLight, 'color')
      .onChange((value) => {
        Params.parameters.lights.AmbientLight.color = value;
        AmbientLight.color = new THREE.Color(value);
      });
    folder3113
      .add(Params.parameters.lights.AmbientLight, 'intensity', 0, 4, 0.1)
      .onChange((value) => {
        Params.parameters.lights.AmbientLight.intensity = value;
        AmbientLight.intensity = value;
      });

    // Controllers
    // Camera
    // position
    folder120.add(Camera.position, 'x').listen();
    folder120.add(Camera.position, 'y').listen();
    folder120.add(Camera.position, 'z').listen();
    folder120.add(Params.controllers.camera.position, 'reset');
    // lookAt
    folder121
      .add(Params.controllers.camera.lookat, 'x', -500, 500, 1)
      .onChange((value: number) => {
        const vector3 = new THREE.Vector3(
          value,
          Params.controllers.camera.lookat.y,
          Params.controllers.camera.lookat.z
        );
        Controls.target = vector3;
        Controls.update();
      });
    folder121
      .add(Params.controllers.camera.lookat, 'y', -100, 100, 1)
      .onChange((value: number) => {
        const vector3 = new THREE.Vector3(
          Params.controllers.camera.lookat.x,
          value,
          Params.controllers.camera.lookat.z
        );
        Controls.target = vector3;
        Controls.update();
      });
    folder121
      .add(Params.controllers.camera.lookat, 'z', -180, 180, 1)
      .onChange((value: number) => {
        const vector3 = new THREE.Vector3(
          Params.controllers.camera.lookat.x,
          Params.controllers.camera.lookat.y,
          value
        );
        Controls.target = vector3;
        Controls.update();
      });
    // lookat reset
    folder121.add(Params.controllers.camera.lookat, 'reset');

    // scale
    folder13
      .add(Params.controllers.model, 'scale', 0, 2.0, 0.1)
      .onChange((value: number) => {
        if (Model['model']) {
          Model['model'].scale.set(1, 1, 1);
          Model['model'].scale.multiplyScalar(value);
        }
      });
    // Clips
    // action
    folder21
      .add(Params['controllers']['animation'], 'action', [0])
      .onChange((value: number) => {
        /**
         * TASK:
         * 複数のアニメーションの切り替え
         */
      });
    // start
    const ClipStartController = folder21
      .add(Params.controllers.animation, 'start')
      .min(Params.controllers.animation.start)
      .max(Params.controllers.animation.end)
      .step(0.001)
      .onChange(() => {
        datUpdateDisplayWithRecursive(folder2);
        datUpdateDisplayWithRecursive(folder51);
      });
    // end
    const ClipEndController = folder21
      .add(Params.controllers.animation, 'end')
      .min(Params.controllers.animation.start)
      .max(Params.controllers.animation.end)
      .step(0.001)
      .onChange(() => {
        datUpdateDisplayWithRecursive(folder2);
        datUpdateDisplayWithRecursive(folder51);
      });

    // Helpers
    // axesHelper
    folder4.add(Params.helpers, 'axes').onChange((value: boolean) => {
      if (value) {
        Scene.add(axesHelper);
      } else {
        Scene.remove(axesHelper);
      }
    });
    // cameraHelper
    folder4.add(Params.helpers, 'camera').onChange((value: boolean) => {
      if (value) {
        Scene.add(cameraHelper);
      } else {
        Scene.remove(cameraHelper);
      }
    });
    // editor
    const editClipController = folder51
      .add(Params, 'clip', Object.keys(Params['clips']))
      .onChange(AdaptClip);
    // action
    folder51
      .add(Params['controllers']['animation'], 'action', [0])
      .onChange((value: number) => {
        /**
         * TASK:
         * 複数のアニメーションの切り替え
         */
      });
    // start
    const editClipStartController = folder51
      .add(Params.controllers.animation, 'start')
      .min(Params.controllers.animation.start)
      .max(Params.controllers.animation.end)
      .step(0.001)
      .onChange(() => {
        datUpdateDisplayWithRecursive(folder2);
        datUpdateDisplayWithRecursive(folder51);
      });
    // end
    const editClipEndController = folder51
      .add(Params.controllers.animation, 'end')
      .min(Params.controllers.animation.start)
      .max(Params.controllers.animation.end)
      .step(0.001)
      .onChange(() => {
        datUpdateDisplayWithRecursive(folder2);
        datUpdateDisplayWithRecursive(folder51);
      });
    folder51.add(Params['editors']['clips'], 'updateClip');
    folder51.add(Params['editors']['clips'], 'removeClip');
    const folder511 = folder51.addFolder('addclip');
    folder511.add(Params['editors']['clips'], 'addName');
    folder511.add(Params['editors']['clips'], 'addClip');
    const editPresetController = folder52
      .add(Params, 'preset', Object.keys(Params['presets']))
      .onChange(AdaptPreset);
    folder52.add(Params['editors']['presets'], 'updatePreset');
    folder52.add(Params['editors']['presets'], 'removePreset');
    const folder521 = folder52.addFolder('addpreset');
    folder521.add(Params['editors']['presets'], 'addName').name('name');
    folder521.add(Params['editors']['presets'], 'addPreset');

    folder1.open();
    folder2.open();
    folder5.open();
    folder51.open();
    folder52.open();
    folder11.open();
    /**
     * アニメーションに関する初期化が最後
     * watchModelLoad()で初期値を適応させている
     */
    watchModelLoad();
    let prevWidth: number, prevHeight: number;
    animate();
    function animate() {
      if (CommentClipRef) {
        const { setClip, commentClip } = CommentClipRef!.current;
        const allowAppend = Object.keys(commentClip).length > 0;
        if (allowAppend && setClip === false) {
          Params['clips']['comment'] = clone(commentClip);
          Params['clip'] = 'comment';
          AdaptClip('comment');
          updateDropdown(ClipController, Params['clips']);
          updateDropdown(editClipController, Params['clips']);
          // reset
          datUpdateDisplayWithRecursive(folder2);
          datUpdateDisplayWithRecursive(folder51);
          CommentClipRef.current!.setClip = true;
        }
      }
      if (newCommentClipRef) {
        const saveCurrent = newCommentClipRef.current.saveClip;
        if (saveCurrent) {
          const newAnimation = {
            action: Params['controllers']['animation']['action'],
            start: Params['controllers']['animation']['start'],
            end: Params['controllers']['animation']['end'],
          };
          const newLookAt = {
            x: Params['controllers']['camera']['lookat']['x'],
            y: Params['controllers']['camera']['lookat']['y'],
            z: Params['controllers']['camera']['lookat']['z'],
          };
          const newPosition = {
            x: Camera['position']['x'],
            y: Camera['position']['y'],
            z: Camera['position']['z'],
          };
          const usePreset = Params['preset'];
          const newClip = {
            animation: clone(newAnimation),
            camera: {
              lookat: clone(newLookAt),
              position: clone(newPosition),
            },
            preset: usePreset,
          };
          newCommentClipRef!.current!.clip = clone(newClip);
        }
      }
      if (settingsRef) {
        settingsRef.current! = {
          clips: clone(Params['clips']),
          presets: clone(Params['presets']),
        };
      }
      requestAnimationFrame(animate);
      if (
        prevWidth !== Target.clientWidth ||
        prevHeight !== Target.clientHeight
      ) {
        Renderer.setSize(Target.clientWidth, Target.clientHeight);
        const _canvas = Renderer.domElement;
        Camera.aspect = _canvas.clientWidth / _canvas.clientHeight;
        Camera.updateMatrix();
        [prevWidth, prevHeight] = [Target.clientWidth, Target.clientHeight];
      }
      if (Model['loaded']) {
        const currentTime =
          Model['actions'][Params.controllers.animation.action].time;
        const startTime = Params['controllers']['animation']['start'];
        const endTime = Params['controllers']['animation']['end'];
        const adjustStart = currentTime - startTime <= 0;
        const dispatchReset = endTime - currentTime <= 0;
        if (adjustStart) {
          Model['mixer']?.setTime(startTime);
        }
        if (dispatchReset) {
          Model['mixer']?.setTime(startTime);
        }
        Model['mixer']?.update(
          Clock.getDelta() * Params.controllers.model.velocity
        );
      }
      Renderer.render(Scene, Camera);
      //console.log('Target clientWidth: ', Target.clientWidth);
    }
    function watchModelLoad() {
      /**
       * Params宣言時では、モデルの読み込みは完了していない
       * よって、モデルの読み込みが完了時に、関連する情報を
       * 初期化する必要がある
       * そのための関数
       */
      const finishLoad = Model['model'] && Model['animations'];
      if (!finishLoad) {
        requestAnimationFrame(watchModelLoad);
      } else {
        console.log('Loaded Model: ', Model);
        Scene.add(Model['model'] as THREE.Group);
        // 初期値の設定
        /**
         * 初期クリップは"default"で確定
         * これは仕様
         */
        const DefaultClip = Params['clips']['default']['animation'];
        Params['actions'] = IndexNums(Model['actions']!);
        Model['actions']![DefaultClip['action']].play();
        if (DefaultClip.end === undefined) {
          /**
           * settings のプロップスがないときは、
           * スコープ外で宣言されているDefaultClip.endを利用する
           * そこのundefined用の初期化
           */
          DefaultClip.end =
            Model['animations']![DefaultClip['action']].duration;
        }
        // AdaptDefaultSettings
        AdaptClip(Params['clip']);
        if (settingsRef) {
          settingsRef!.current = {
            clips: clone(Params['clips']),
            presets: clone(Params['presets']),
          };
        }
        Params.controllers.animation.end = DefaultClip.end;
        // datの初期化
        // for controllers
        // action
        folder11
          .add(Params['controllers']['animation'], 'action', [0])
          .onChange((value: number) => {
            /**
             * TASK:
             * 複数のアニメーションの切り替え
             */
          });
        // pause
        folder11
          .add(Model['actions'][DefaultClip['action']], 'paused')
          .listen();

        // time
        /**
         * TASK:
         * onChangeは動的値の監視に向かない
         * listenでは複数の処理ができない
         * 両方を満たすやり方を模索する
         */
        folder11
          .add(Model['actions'][DefaultClip['action']], 'time')
          .min(0)
          .max(Model['animations'][DefaultClip['action']].duration)
          .step(0.001)
          .listen();
        // velocity
        /**
         * TASK:
         * 速度調整が面倒くさいから、数字を列挙する
         * なお、datGUI側が勝手にソーティングするた
         * め、対策が必要
         */
        folder11.add(Params.controllers.model, 'velocity', 0, 2, 0.01);
        // for clip
        ClipStartController.min(Params.controllers.animation.start).max(
          Params.controllers.animation.end
        );
        ClipEndController.min(Params.controllers.animation.start).max(
          Params.controllers.animation.end
        );
        editClipStartController
          .min(Params.controllers.animation.start)
          .max(Params.controllers.animation.end);
        editClipEndController
          .min(Params.controllers.animation.start)
          .max(Params.controllers.animation.end);
        datUpdateDisplayWithRecursive(folder11);
        datUpdateDisplayWithRecursive(folder21);
        datUpdateDisplayWithRecursive(folder51);
      }
    }
    function resetPosition() {
      const currentClip = clone(Params['clips'][Params['clip']]);
      const ClipPosition = currentClip['camera']['position'];
      Camera.position.set(ClipPosition.x, ClipPosition.y, ClipPosition.z);
      Controls.update();
    }
    function resetTarget() {
      const currentClip = clone(Params['clips'][Params['clip']]);
      const ClipTarget = currentClip['camera']['lookat'];
      Controls.target = new THREE.Vector3(
        ClipTarget.x,
        ClipTarget.y,
        ClipTarget.z
      );
      Controls.update();
      /**
       * JSONは明示的に更新しないと、updateできなかった
       * いじらないよう注意
       */
      Params.controllers.camera.lookat.x = ClipTarget.x;
      Params.controllers.camera.lookat.y = ClipTarget.y;
      Params.controllers.camera.lookat.z = ClipTarget.z;
      datUpdateDisplayWithRecursive(folder121);
    }
    function addClip() {
      const newName = Params['editors']['clips']['addName'];
      const diffname = !(newName in Params['clips']);
      const allowAppend = newName.length > 0;
      if (diffname && allowAppend) {
        const newAnimation = {
          action: Params['controllers']['animation']['action'],
          start: Params['controllers']['animation']['start'],
          end: Params['controllers']['animation']['end'],
        };
        const newLookAt = {
          x: Params['controllers']['camera']['lookat']['x'],
          y: Params['controllers']['camera']['lookat']['y'],
          z: Params['controllers']['camera']['lookat']['z'],
        };
        const newPosition = {
          x: Camera['position']['x'],
          y: Camera['position']['y'],
          z: Camera['position']['z'],
        };
        const usePreset = Params['preset'];
        const newClip = {
          animation: clone(newAnimation),
          camera: {
            lookat: clone(newLookAt),
            position: clone(newPosition),
          },
          preset: usePreset,
        };
        Params['clips'][newName] = clone(newClip);
        // for GUI
        Params['clip'] = newName;
        AdaptClip(Params['clip']);
        updateDropdown(ClipController, Params['clips']);
        updateDropdown(editClipController, Params['clips']);
        // reset
        Params['editors']['clips']['addName'] = '';
        datUpdateDisplayWithRecursive(folder2);
        datUpdateDisplayWithRecursive(folder51);
      }
    }
    function updateClip() {
      const currentClip = Params['clip'];
      const newAnimation = {
        action: Params['controllers']['animation']['action'],
        start: Params['controllers']['animation']['start'],
        end: Params['controllers']['animation']['end'],
      };
      const newLookAt = {
        x: Params['controllers']['camera']['lookat']['x'],
        y: Params['controllers']['camera']['lookat']['y'],
        z: Params['controllers']['camera']['lookat']['z'],
      };
      const newPosition = {
        x: Camera['position']['x'],
        y: Camera['position']['y'],
        z: Camera['position']['z'],
      };
      const usePreset = Params['preset'];
      const newClip = {
        animation: clone(newAnimation),
        camera: {
          lookat: clone(newLookAt),
          position: clone(newPosition),
        },
        preset: usePreset,
      };
      Params['clips'][currentClip] = clone(newClip);
    }
    function removeClip() {
      if (Params['clip'] === 'default') {
        return;
      }
      const currentClip = Params['clip'];
      delete Params['clips'][currentClip];
      // for GUI
      Params['clip'] = 'default';
      AdaptClip(Params['clip']);
      updateDropdown(ClipController, Params['clips']);
      updateDropdown(editClipController, Params['clips']);
      // reset
      datUpdateDisplayWithRecursive(folder2);
      datUpdateDisplayWithRecursive(folder51);
    }
    function addPreset() {
      const newName = Params['editors']['presets']['addName'];
      const diffname = !(newName in Params['presets']);
      const allowAppend = newName.length > 0;
      if (diffname && allowAppend) {
        const background = `#${Scene.background.getHexString()}`;
        const hemisphereLight = {
          skyColor: `#${HemisphereLight.color.getHexString()}`,
          groundColor: `#${HemisphereLight.groundColor.getHexString()}`,
          intensity: HemisphereLight.intensity,
        };
        const directionalLight = {
          color: `#${DirectionalLight.color.getHexString()}`,
          intensity: DirectionalLight.intensity,
        };
        const ambientLight = {
          color: `#${AmbientLight.color.getHexString()}`,
          intensity: AmbientLight.intensity,
        };

        const newPreset = {
          background,
          lights: {
            HemisphereLight: clone(hemisphereLight),
            DirectionalLight: clone(directionalLight),
            AmbientLight: clone(ambientLight),
          },
        };
        Params['presets'][newName] = clone(newPreset);
        // for GUI
        Params['preset'] = newName;
        AdaptPreset(Params['preset']);
        updateDropdown(PresetController, Params['presets']);
        updateDropdown(editPresetController, Params['presets']);
        // reset
        Params['editors']['presets']['addName'] = '';
        datUpdateDisplayWithRecursive(folder3);
        datUpdateDisplayWithRecursive(folder52);
      }
    }
    function updatePreset() {
      const currentPreset = Params['preset'];
      if (Params['presets'][currentPreset]) {
        const background = `#${Scene.background.getHexString()}`;
        const hemisphereLight = {
          skyColor: `#${HemisphereLight.color.getHexString()}`,
          groundColor: `#${HemisphereLight.groundColor.getHexString()}`,
          intensity: HemisphereLight.intensity,
        };
        const directionalLight = {
          color: `#${DirectionalLight.color.getHexString()}`,
          intensity: DirectionalLight.intensity,
        };
        const ambientLight = {
          color: `#${AmbientLight.color.getHexString()}`,
          intensity: AmbientLight.intensity,
        };

        const newPreset = {
          background,
          lights: {
            HemisphereLight: clone(hemisphereLight),
            DirectionalLight: clone(directionalLight),
            AmbientLight: clone(ambientLight),
          },
        };
        // preset の値を更新
        Params['presets'][currentPreset] = clone(newPreset);
      }
    }
    function removePreset() {
      if (Object.keys(Params['presets']).length <= 1) {
        return;
      }
      const currentPreset = Params['preset'];
      if (Params['presets'][currentPreset]) {
        delete Params['presets'][currentPreset];
        updateDropdown(PresetController, Params['presets']);
        updateDropdown(editPresetController, Params['presets']);
        Params['preset'] = Object.keys(Params['presets'])[0];
        AdaptPreset(Params['preset']);
      }
    }
    function AdaptPreset(name: string): void {
      if (Params['presets'][name]) {
        console.log('name: ', name);
        const obj = clone(Params['presets'][name]);
        const PresetBg = obj.background;
        const PresetLightHemi = clone(obj.lights.HemisphereLight);
        const PresetLightDire = clone(obj.lights.DirectionalLight);
        const PresetLightAmb = clone(obj.lights.AmbientLight);
        // adapt
        Scene.background = new THREE.Color(PresetBg);
        Lights[0].color = new THREE.Color(PresetLightHemi.skyColor);
        Lights[0].groundColor = new THREE.Color(PresetLightHemi.groundColor);
        Lights[0].intensity = PresetLightHemi.intensity;
        Lights[1].color = new THREE.Color(PresetLightDire.color);
        Lights[1].intensity = PresetLightDire.intensity;
        Lights[2].color = new THREE.Color(PresetLightAmb.color);
        Lights[2].intensity = PresetLightAmb.intensity;
        // storeを更新
        // uiを更新する
        Params.parameters.background = `#${Scene.background.getHexString()}`;
        Params.parameters.lights.HemisphereLight.skyColor = `#${HemisphereLight.color.getHexString()}`;
        Params.parameters.lights.HemisphereLight.groundColor = `#${HemisphereLight.groundColor.getHexString()}`;
        Params.parameters.lights.HemisphereLight.intensity =
          HemisphereLight.intensity;
        Params.parameters.lights.DirectionalLight.color = `#${DirectionalLight.color.getHexString()}`;
        Params.parameters.lights.DirectionalLight.intensity =
          DirectionalLight.intensity;
        Params.parameters.lights.AmbientLight.color = `#${AmbientLight.color.getHexString()}`;
        Params.parameters.lights.AmbientLight.intensity =
          AmbientLight.intensity;
        datUpdateDisplayWithRecursive(folder3);
        datUpdateDisplayWithRecursive(folder52);
      } else {
        console.error('no preset: ', name);
      }
    }
    function AdaptClip(name: string): void {
      if (Params['clips'][name]) {
        const obj = clone(Params['clips'][name]);
        const ClipPosition = clone(obj['camera']['position']);
        const ClipTarget = clone(obj['camera']['lookat']);
        const PresetName = clone(obj['preset']);
        /**
         * positionはlisten()で直接値が監視されている
         * よって、他の値のように明示的に更新する必要
         * がない
         */
        Camera.position.set(ClipPosition.x, ClipPosition.y, ClipPosition.z);
        Controls.target = new THREE.Vector3(
          ClipTarget.x,
          ClipTarget.y,
          ClipTarget.z
        );
        Controls.update();
        AdaptPreset(PresetName);
        // Params の start, end, camera, clipを適応
        /**
         * object をコピーしない理由は、
         * controllerとclipの値が完全に
         * 一致していないから
         */
        Params.controllers.animation.start = obj['animation']['start'];
        Params.controllers.animation.end = obj['animation']['end'];
        Params.controllers.camera.lookat.x = obj['camera']['lookat']['x'];
        Params.controllers.camera.lookat.y = obj['camera']['lookat']['y'];
        Params.controllers.camera.lookat.z = obj['camera']['lookat']['z'];
        // controller に対して命令
        datUpdateDisplayWithRecursive(folder2);
        datUpdateDisplayWithRecursive(folder51);
      } else {
        console.error('no clip: ', name);
      }
    }
  }, []);
  return (
    <Box
      sx={{ width: '100%', height: '400px', position: 'relative' }}
      ref={TargetRef}
    ></Box>
  );
};

export default CSRenderer;
const DefaultPreset = {
  default: {
    background: '#f0f0f0',
    lights: {
      HemisphereLight: {
        skyColor: '#ffffff',
        groundColor: '#444444',
        intensity: 1,
      },
      DirectionalLight: {
        color: '#ffffff',
        intensity: 1,
      },
      AmbientLight: {
        color: '#ffffff',
        intensity: 0,
      },
    },
  },
  White: {
    background: '#ffffff',
    lights: {
      HemisphereLight: {
        skyColor: '#d6d6d6',
        groundColor: '#f7f7f7',
        intensity: 0.8,
      },
      DirectionalLight: {
        color: '#ffffff',
        intensity: 1,
      },
      AmbientLight: {
        color: '#ffffff',
        intensity: 0,
      },
    },
  },
  Gray: {
    background: '#b5b5b5',
    lights: {
      HemisphereLight: {
        skyColor: '#ffffff',
        groundColor: '#444444',
        intensity: 1,
      },
      DirectionalLight: {
        color: '#ffffff',
        intensity: 1,
      },
      AmbientLight: {
        color: '#ffffff',
        intensity: 0,
      },
    },
  },
  Black: {
    background: '#000000',
    lights: {
      HemisphereLight: {
        skyColor: '#ffffff',
        groundColor: '#666666',
        intensity: 1,
      },
      DirectionalLight: {
        color: '#ffffff',
        intensity: 1,
      },
      AmbientLight: {
        color: '#ffffff',
        intensity: 0,
      },
    },
  },
  Ambient: {
    background: '#e5e5e5',
    lights: {
      HemisphereLight: {
        skyColor: '#ffffff',
        groundColor: '#444444',
        intensity: 0,
      },
      DirectionalLight: {
        color: '#ffffff',
        intensity: 0.7,
      },
      AmbientLight: {
        color: '#ffffff',
        intensity: 1,
      },
    },
  },
};

const DefaultClip = {
  default: {
    animation: {
      action: 0,
      start: 0,
      end: undefined,
    },
    camera: {
      lookat: {
        x: 0,
        y: 5,
        z: 0,
      },
      position: {
        x: 0,
        y: 10,
        z: 50,
      },
    },
    preset: Object.keys(DefaultPreset)[0],
  },
};
function datUpdateDisplayWithRecursive(folder: GUI): void {
  // update all folder & __controllers revursively
  /**
   * dat.GUIはlisten()で値の監視と更新を行うことができる。
   * がしかし、今回はすべてをonChangeを用いて処理している。
   * よって、プログラム側から更新する必要がある。
   * onChangeの採用理由としては、カラーコードの見た目を整えるため。
   * （THREE.jsのcolorはデフォルトでrgbを出力する。利用したい
   * 値は16進数であるから、前処理が必要）
   */
  const recursiveUpdate = (gui: GUI) => {
    gui.__controllers.forEach((controller: GUIController) => {
      controller.updateDisplay();
    });
    Object.keys(gui.__folders).forEach((key: string) => {
      recursiveUpdate(gui.__folders[key]);
    });
  };
  recursiveUpdate(folder);
}

function updateDropdown(controller: GUIController, obj: Object) {
  const list = Object.keys(obj);
  console.log('list: ', list);
  let innerHTMLStr = '';
  list.forEach((tag: string) => {
    const menuStr = `<option value= "${tag}"> ${tag} </option>`;
    innerHTMLStr += menuStr;
  });
  if (innerHTMLStr != '')
    controller.domElement.children[0].innerHTML = innerHTMLStr;
}

function LoadModel(url: string): {
  model?: THREE.Group;
  mixer?: THREE.AnimationMixer;
  animations?: Array<THREE.AnimationClip>;
  actions?: Array<THREE.AnimationAction>;
  loaded: boolean;
} {
  const Loader = new FBXLoader();
  const obj: {
    model?: THREE.Group;
    mixer?: THREE.AnimationMixer;
    animations?: Array<THREE.AnimationClip>;
    actions?: Array<THREE.AnimationAction>;
    loaded: boolean;
  } = {
    model: undefined,
    mixer: undefined,
    animations: undefined,
    actions: undefined,
    loaded: false,
  };
  Loader.load(url, (model: THREE.Group) => {
    const mixer: THREE.AnimationMixer = new THREE.AnimationMixer(model);
    const animations: Array<THREE.AnimationClip> = model.animations;
    const actions: Array<THREE.AnimationAction> = [];
    animations.forEach((animation: THREE.AnimationClip) => {
      actions.push(mixer.clipAction(animation));
    });
    obj['model'] = model;
    obj['mixer'] = mixer;
    obj['animations'] = animations;
    obj['actions'] = actions;
    obj['loaded'] = true;
  });
  return obj;
}
function IndexNums(array: Array<any>): Array<number> {
  /**
   * 戻り値のイメージ：
   * [0, 1, 2, 3, ,,,]
   * 配列の長さ分のindexを代入した配列を返す
   */
  const returnArray = [];
  for (let i: number = 0; i < array.length; i++) {
    returnArray.push(i);
  }
  return returnArray;
}
