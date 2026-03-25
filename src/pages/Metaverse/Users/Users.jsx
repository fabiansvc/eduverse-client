import { Text, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useMemo } from "react";
import { socketServer } from "../../../services/socket-server";
import { RigidBody } from "@react-three/rapier";
import { Quaternion, Vector3 } from "three";
import useAvatarStore from "../../../stores/avatar-store";
import { useStreamojiToken } from "../../../hooks/useStreamojiToken";

/**
 * User Component
 * @param {Object} props - Props for the User component
 * @param {Object} props.avatar - Avatar object containing avatar information
 * @returns {JSX.Element} User component
 */
const UserModel = ({ avatar, streamojiToken }) => {
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
      const isStreamoji = avatar.avatarUrl.includes("streamoji");
      if (isStreamoji) {
        try {
          const parsedUrl = new URL(avatar.avatarUrl);
          parsedUrl.searchParams.set("token", streamojiToken);
          return parsedUrl.toString();
        } catch (e) {
          const separator = avatar.avatarUrl.includes("?") ? "&" : "?";
          return `${avatar.avatarUrl}${separator}token=${streamojiToken}`;
        }
      }
      const separator = avatar.avatarUrl.includes("?") ? "&" : "?";
      return `${avatar.avatarUrl}${separator}${Object.entries(parametersAvatar)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&")}`;
    },
    [avatar.avatarUrl, parametersAvatar, streamojiToken]
  );

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
  
const gender = useMemo(() => (nodes?.Streamoji_Hair?.bindMode ? "male" : "female"), [nodes]);

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
          <Text
            fontSize={0.05}
            color="black"
            position={[0, 1.9, 0]}
            textAlign="center"
          >
            {avatar.nickname}
          </Text>
        </group>
      </group>
    </RigidBody>
  );
};

const User = ({ avatar }) => {
  const streamojiToken = useStreamojiToken("viewer_user", "Viewer");
  const isStreamoji = avatar?.avatarUrl?.includes("streamoji");

  if (isStreamoji && !streamojiToken) return null;

  return <UserModel avatar={avatar} streamojiToken={streamojiToken} />;
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
