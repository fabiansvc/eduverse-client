import { Text, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useMemo } from "react";
import { socketServer } from "../../../services/socket-server";
import { RigidBody } from "@react-three/rapier";
import { Quaternion, Vector3 } from "three";
import useAvatarStore from "../../../stores/avatar-store";

/**
 * User Component
 * @param {Object} props - Props for the User component
 * @param {Object} props.avatar - Avatar object containing avatar information
 * @returns {JSX.Element} User component
 */
const User = ({ avatar }) => {
  const userRef = useRef();
  const rigidBodyUserRef = useRef();

  const position = useMemo(
    () => new Vector3(avatar.position.x, avatar.position.y, avatar.position.z),
    [avatar.position]
  );

  const rotation = useMemo(
    () =>
      new Quaternion(
        avatar.rotation[0],
        avatar.rotation[1],
        avatar.rotation[2],
        avatar.rotation[3]
      ),
    [avatar.rotation]
  );

  const url = useMemo(() => {
    const parametersAvatar = {
      quality: "medium",
      meshLod: 1,
      textureSizeLimit: 512,
      useDracoMeshCompression: true,
    };

    return `${avatar?.avatarUrl}?${Object.entries(parametersAvatar)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")}`;
  }, [avatar?.avatarUrl]);

  const { nodes, materials } = useGLTF(url);
  const height = useMemo(
    () => nodes.Wolf3D_Avatar.geometry.boundingBox.max.y,
    [nodes]
  );
  const gender = useMemo(() => (height > 1.8 ? "male" : "female"), [height]);

  const { animations } = useGLTF(
    gender === "male"
      ? "/assets/animations/manAnimations.glb"
      : "/assets/animations/womanAnimations.glb"
  );

  const { actions } = useAnimations(animations, userRef);

  useEffect(() => {
    if (actions[avatar.animation]) {
      actions[avatar.animation].reset().fadeIn(0.5).play();
      return () => {
        actions[avatar.animation]?.fadeOut(0.5);
      };
    }
  }, [avatar.animation, actions]);

  useFrame(() => {
    if (rigidBodyUserRef.current) {
      rigidBodyUserRef.current.setTranslation(position, true);
      userRef.current.rotation.setFromQuaternion(rotation);
    }
  });

  return (
    <RigidBody ref={rigidBodyUserRef} colliders={false}>
      <group ref={userRef} scale={0.9} dispose={null}>
        <primitive object={nodes.Hips} />
        <skinnedMesh
          name="Wolf3D_Avatar"
          geometry={nodes.Wolf3D_Avatar.geometry}
          material={materials.Wolf3D_Avatar}
          skeleton={nodes.Wolf3D_Avatar.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Avatar.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Avatar.morphTargetInfluences}
        />
        {nodes.Wolf3D_Avatar_Transparent && (
          <skinnedMesh
            geometry={nodes.Wolf3D_Avatar_Transparent.geometry}
            material={materials.Wolf3D_Avatar_Transparent}
            skeleton={nodes.Wolf3D_Avatar_Transparent.skeleton}
          />
        )}
        <Text
          fontSize={0.05}
          color="black"
          position={[0, 1.9, 0]}
          textAlign="center"
        >
          {avatar.nickname}
        </Text>
      </group>
    </RigidBody>
  );
};

/**
 * Users Component
 * @returns {JSX.Element} Users component
 */
export default function Users() {
  const avatars = useAvatarStore((state) => state.avatars);

  return avatars?.map(
    (avatar, index) =>
      socketServer?.id !== avatar?.id &&
      avatar?.avatarUrl && (
        <Suspense key={index} fallback={null}>
          <User key={index} avatar={avatar} />
        </Suspense>
      )
  );
}
