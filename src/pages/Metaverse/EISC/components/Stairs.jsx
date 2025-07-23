import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

/**
 * Component representing the stairs of the Escuela de Ingeniería de Sistemas y Computación (EISC) building.
 * @param {Object} props - The props passed to the component.
 * @returns {JSX.Element} The JSX.Element containing the stairs model.
 */
export default function Stairs (props)  {
  const { nodes, materials } = useGLTF("/assets/models/Stairs.glb");

  return (
    <group {...props} dispose={null}>
      <group>
        <RigidBody type="fixed" colliders="trimesh" name="stairs">
          <mesh
            geometry={nodes.StairsFrontFirstFloorEntry.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsFrontFirstFloorOut.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsFrontSecondFloorEntry.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsFrontSecondFloorOut.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsFrontThirdFloorEntry.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsFrontThirdFloorOut.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsFrontFourthFloorEntry.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsFrontFourthFloorOut.geometry}
            material={materials.floor}
          />
        </RigidBody>
        <RigidBody type="fixed" colliders="trimesh" name="stairs">
          <mesh
            geometry={nodes.StairsFrontFirstFloorBetween.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsFrontSecondFloorBetween.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsFrontThirdFloorBetween.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsFrontFourthFloorBetween.geometry}
            material={materials.floor}
          />
        </RigidBody>
        <RigidBody type="fixed" colliders="trimesh" name="stairs">
          <mesh
            geometry={nodes.StairsBackFirstFloorEntry.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsBackFirstFloorOut.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsBackSecondFloorEntry.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsBackSecondFloorOut.geometry}
            material={materials.floor}
          />

          <mesh
            geometry={nodes.StairsBackThirdFloorEntry.geometry}
            material={materials.floor}
          />

          <mesh
            geometry={nodes.StairsBackThirdFloorOut.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsBackFourthFloorEntry.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsBackFourthFloorOut.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsBackFirstFloorBetween.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsBackSecondFloorBetween.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsBackThirdFloorBetween.geometry}
            material={materials.floor}
          />
          <mesh
            geometry={nodes.StairsBackFourthFloorBetween.geometry}
            material={materials.floor}
          />
        </RigidBody>
        <RigidBody type="fixed" colliders="trimesh">
          <mesh
            geometry={nodes.StairsMiddle.geometry}
            material={materials.brown}
          />
        </RigidBody>
      </group>
    </group>
  );
}

useGLTF.preload("/assets/models/Stairs.glb");
