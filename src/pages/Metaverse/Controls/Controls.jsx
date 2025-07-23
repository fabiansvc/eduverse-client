import { OrbitControls, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { socketServer } from "../../../services/socket-server";
import { useAvatar } from "../../../context/AvatarContext";
import * as THREE from "three";

/**
 * Controls component to manage avatar movement, rotation, and camera control.
 * Uses keyboard inputs and WebSocket to update the avatar state.
 *
 * @component
 * @returns {JSX.Element} The OrbitControls component configured for avatar control.
 */
export default function Controls() {
  const { avatar, setAvatar } = useAvatar();
  const [sub, get] = useKeyboardControls();
  const lastUpdateRef = useRef(0);
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  const rotateQuarternion = useMemo(() => new THREE.Quaternion(), []);
  const rotateAngle = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useEffect(() => {
    const unsubscribe = sub(
      (state) =>
        state.forward || state.backward || state.leftward || state.rightward,
      (pressed) => {
        setAvatar((prevAvatar) => ({
          ...prevAvatar,
          animation: pressed ? "Walking" : "Idle",
        }));
      }
    );
    return unsubscribe;
  }, [sub, setAvatar]);

  useEffect(() => {
    socketServer.emit("upgrade-avatar", { animation: avatar.animation });
  }, [avatar.animation]);

  const sendTransformViaWebSocket = useCallback(
    (elapsedTime) => {
      if (elapsedTime - lastUpdateRef.current >= 0.01) {
        socketServer.emit("upgrade-avatar", {
          position: avatar.body?.translation(),
          rotation: avatar.ref?.quaternion,
        });
        lastUpdateRef.current = elapsedTime;
      }
    },
    [avatar.body, avatar.ref]
  );

  const moveAvatar = useCallback(
    (directionVector) => {
      const currentPosition = avatar.body?.translation();
      if (currentPosition) {
        const newPosition = new THREE.Vector3(
          currentPosition.x + directionVector.x,
          currentPosition.y + directionVector.y,
          currentPosition.z + directionVector.z
        );
        avatar.body.setTranslation(newPosition, true);
      }
    },
    [avatar.body]
  );

  const rotateAvatar = useCallback(
    (directionOffset) => {
      const avatarPosition = avatar.body?.translation();
      if (avatarPosition) {
        const angleYCameraDirection = Math.atan2(
          camera.position.x - avatarPosition.x,
          camera.position.z - avatarPosition.z
        );
        rotateQuarternion.setFromAxisAngle(
          rotateAngle,
          angleYCameraDirection + Math.PI + directionOffset
        );
        avatar.ref.quaternion.rotateTowards(rotateQuarternion, 0.2);
      }
    },
    [avatar.body, avatar.ref, camera.position, rotateQuarternion, rotateAngle]
  );

  const getDirectionOffset = useCallback(
    (forward, backward, leftward, rightward) => {
      if (forward && leftward) return Math.PI / 4;
      if (forward && rightward) return -Math.PI / 4;
      if (backward && leftward) return (3 * Math.PI) / 4;
      if (backward && rightward) return (-3 * Math.PI) / 4;
      if (forward) return 0;
      if (backward) return Math.PI;
      if (leftward) return Math.PI / 2;
      if (rightward) return -Math.PI / 2;
      return 0;
    },
    []
  );

  const getVectorDirection = useCallback(
    (forward, backward, leftward, rightward) => {
      const speed = 0.06; 
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();

      const moveVector = new THREE.Vector3();

      if (forward) moveVector.add(direction.clone().multiplyScalar(speed));
      if (backward) moveVector.add(direction.clone().multiplyScalar(-speed));
      
      const right = new THREE.Vector3()
        .crossVectors(camera.up, direction)
        .normalize();
      if (leftward) moveVector.add(right.clone().multiplyScalar(speed));
      if (rightward) moveVector.add(right.clone().multiplyScalar(-speed));

      return moveVector;
    },
    [camera]
  );

  const moveCamera = useCallback(() => {
    const avatarPosition = avatar.body?.translation();
    if (avatarPosition) {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();
      const offset = direction.clone().negate().multiplyScalar(1);
      camera.position.set(
        avatarPosition.x + offset.x,
        avatarPosition.y + 1.5,
        avatarPosition.z + offset.z
      );
      controlsRef.current.target.set(
        avatarPosition.x,
        avatarPosition.y + 1.25,
        avatarPosition.z
      );
      controlsRef.current.update();
    }
  }, [avatar.body, camera, controlsRef]);

  useFrame((state) => {
    const { forward, backward, leftward, rightward } = get();

    if (!forward && !backward && !leftward && !rightward) return;

    const directionOffset = getDirectionOffset(
      forward,
      backward,
      leftward,
      rightward
    );
    rotateAvatar(directionOffset);

    const directionVector = getVectorDirection(
      forward,
      backward,
      leftward,
      rightward
    );
    moveAvatar(directionVector);

    moveCamera();
    sendTransformViaWebSocket(state.clock.elapsedTime);
  });

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enablePan={false}
      enableZoom={false}
      enableDamping={false}
      dampingFactor={0.2}
      minDistance={1}
      maxDistance={1}
      target={[0, 1.25, 0]}
    />
  );
}
