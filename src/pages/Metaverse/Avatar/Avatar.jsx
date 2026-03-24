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
    () => {
      const isStreamoji = user.avatarUrl.includes("streamoji");
      if (isStreamoji) return user.avatarUrl;
      const separator = user.avatarUrl.includes("?") ? "&" : "?";
      return `${user.avatarUrl}${separator}${Object.entries(parametersAvatar)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&")}`;
    },
    [user.avatarUrl, parametersAvatar]
  );

  // Load avatar model and materials
  const { nodes, materials } = useGLTF(url);

  // Determine gender based on avatar height
  const height = useMemo(() => {
    try {
      if (nodes.Wolf3D_Avatar) {
        if (!nodes.Wolf3D_Avatar.geometry.boundingBox) nodes.Wolf3D_Avatar.geometry.computeBoundingBox();
        return nodes.Wolf3D_Avatar.geometry.boundingBox.max.y;
      }
      if (nodes.Streamoji_Body) {
        if (!nodes.Streamoji_Body.geometry.boundingBox) nodes.Streamoji_Body.geometry.computeBoundingBox();
        return nodes.Streamoji_Body.geometry.boundingBox.max.y;
      }
    } catch (e) {
      console.warn("Could not compute bounding box for avatar height", e);
    }
  }, [nodes]);
  const gender = useMemo(() => (height > 1.07 ? "male" : "female"), [height]);

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

  console.log(nodes);

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
          <group name="Scene">
            <group name="Armature">
              <primitive object={nodes?.Hips} />
              {nodes?.Streamoji_Body?.bindMode && <skinnedMesh
                name="Streamoji_Body"
                geometry={nodes.Streamoji_Body.geometry}
                material={materials.Streamoji_Body}
                skeleton={nodes.Streamoji_Body.skeleton}
              />}
              {nodes?.Streamoji_Outfit_Bottom?.bindMode && <skinnedMesh
                name="Streamoji_Outfit_Bottom"
                geometry={nodes.Streamoji_Outfit_Bottom.geometry}
                material={materials.Streamoji_Outfit_Bottom}
                skeleton={nodes.Streamoji_Outfit_Bottom.skeleton}
              />}
              {nodes?.Streamoji_Outfit_Footwear?.bindMode && <skinnedMesh
                name="Streamoji_Outfit_Footwear"
                geometry={nodes.Streamoji_Outfit_Footwear.geometry}
                material={materials.Streamoji_Outfit_Footwear}
                skeleton={nodes.Streamoji_Outfit_Footwear.skeleton}
              />}
              {nodes?.Streamoji_Outfit_Top?.bindMode && <skinnedMesh
                name="Streamoji_Outfit_Top"
                geometry={nodes.Streamoji_Outfit_Top.geometry}
                material={materials.Streamoji_Outfit_Top}
                skeleton={nodes.Streamoji_Outfit_Top.skeleton}
              />}
            </group>
            {nodes?.EyeLeft?.bindMode && <skinnedMesh
              name="EyeLeft"
              geometry={nodes.EyeLeft.geometry}
              material={materials.Streamoji_Eye}
              skeleton={nodes.EyeLeft.skeleton}
              morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
              morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
            />}
            {nodes?.EyeRight?.bindMode && <skinnedMesh
              name="EyeRight"
              geometry={nodes.EyeRight.geometry}
              material={materials.Streamoji_Eye}
              skeleton={nodes.EyeRight.skeleton}
              morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
              morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
            />}
            {nodes?.Streamoji_Head?.bindMode && <skinnedMesh
              name="Streamoji_Head"
              geometry={nodes.Streamoji_Head.geometry}
              material={materials.Streamoji_Skin}
              skeleton={nodes.Streamoji_Head.skeleton}
              morphTargetDictionary={nodes.Streamoji_Head.morphTargetDictionary}
              morphTargetInfluences={nodes.Streamoji_Head.morphTargetInfluences}
            />}
            {nodes?.Streamoji_Teeth?.bindMode && <skinnedMesh
              name="Streamoji_Teeth"
              geometry={nodes.Streamoji_Teeth.geometry}
              material={materials.Streamoji_Teeth}
              skeleton={nodes.Streamoji_Teeth.skeleton}
              morphTargetDictionary={nodes.Streamoji_Teeth.morphTargetDictionary}
              morphTargetInfluences={nodes.Streamoji_Teeth.morphTargetInfluences}
            />}
            {nodes?.Streamoji_Hair?.bindMode && <skinnedMesh
              name="Streamoji_Hair"
              geometry={nodes.Streamoji_Hair.geometry}
              material={materials.Streamoji_Hair}
              skeleton={nodes.Streamoji_Hair.skeleton}
            />}
          </group>
          <CapsuleCollider
            args={[height / 2 + 0.1, 0.3]}
            position={[0, 1, 0]}
          />
        </group>
      </RigidBody>
    </Suspense>
  );
}
