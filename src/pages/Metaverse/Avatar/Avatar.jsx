import { useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useMemo, useCallback } from "react";
import { useUser } from "../../../context/UserContext";
import { useAvatar } from "../../../context/AvatarContext";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

/**
 * Component representing the user's avatar in the metaverse.
 * This component displays the user's avatar model and manages its animations.
 * @returns {JSX.Element} The avatar component.
 */
export default function Avatar() {
  const { user, setUser } = useUser();
  const { avatar, setAvatar } = useAvatar();
  const avatarRef = useRef();
  const avatarBodyRef = useRef();

  // Parameters for avatar optimization
  const parametersAvatar = useMemo(
    () => ({
      quality: "medium", // low, medium, high
      meshLod: 1, // 0 - No triangle count reduction is applied (default), 1 - Retain 50% of the original triangle count, 2 - Retain 25% of the original triangle count.
      textureSizeLimit: 512, // Min: 256, Max: 1024 (default)
      useDracoMeshCompression: true,
    }),
    []
  );

  // Append optimization parameters to the avatar URL
  const url = useMemo(
    () =>
      `${user.avatarUrl}?${Object.entries(parametersAvatar)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&")}`,
    [user.avatarUrl, parametersAvatar]
  );

  // Load avatar model and materials
  const { nodes, materials } = useGLTF(url);

  // Determine gender based on avatar height
  const height = useMemo(
    () => nodes.Wolf3D_Avatar.geometry.boundingBox.max.y,
    [nodes]
  );
  const gender = useMemo(() => (height > 1.8 ? "male" : "female"), [height]);

  // Load animations based on gender
  const { animations } = useGLTF(
    gender === "male"
      ? "/assets/animations/manAnimations.glb"
      : "/assets/animations/womanAnimations.glb"
  );

  // Initialize animation actions
  const { actions } = useAnimations(animations, avatarRef);

  // Play selected animation when changed
  useEffect(() => {
    if (avatar.animation) {
      actions[avatar.animation].reset().fadeIn(0.5).play();
      return () => {
        actions[avatar.animation]?.fadeOut(0.5);
      };
    }
  }, [avatar.animation, actions]);

  // Update user and avatar state when avatarRef is available
  useEffect(() => {
    if (avatarRef.current && avatarBodyRef.current) {
      setUser((prevUser) => ({
        ...prevUser,
        gender,
      }));

      setAvatar((prevAvatar) => ({
        ...prevAvatar,
        ref: avatarRef.current,
        body: avatarBodyRef.current,
      }));
    }
  }, [gender, setUser, setAvatar]);

  // Handle collision with stairs
  const onCollisionEnter = useCallback((other) => {
    if (other.rigidBodyObject.name === "stairs") {
      avatarBodyRef.current.setGravityScale(0, true);
    }
  }, []);

  const onCollisionExit = useCallback((other) => {
    if (other.rigidBodyObject.name === "stairs") {
      avatarBodyRef.current.setGravityScale(1, true);
    }
  }, []);

  // Render the avatar component
  return (
    <Suspense fallback={null}>
      <RigidBody
        ref={avatarBodyRef}
        colliders={false}
        position={[0, 3, 0]}
        density={30}
        enabledRotations={[false, false, false]}
        restitution={0}
        friction={1}
        onCollisionEnter={({ other }) => onCollisionEnter(other)}
        onCollisionExit={({ other }) => onCollisionExit(other)}
        gravityScale={0}
      >
        <group ref={avatarRef} scale={0.9} dispose={null}>
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
          <CapsuleCollider
            args={[height / 2 - 0.3, 0.3]}
            position={[0, 1, 0]}
          />
        </group>
      </RigidBody>
    </Suspense>
  );
}
