import { useEffect, useRef, useState, useCallback } from "react";
import {
  useGLTF,
  useAnimations,
  Float,
  Text3D,
  Center,
} from "@react-three/drei";
import Guide from "./components/Guide";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

/**
 * Functional component representing the Alu model.
 * @param {Object} props - Component props.
 * @returns {JSX.Element} The Alu model.
 */
export default function Alu(props) {
  const aluRef = useRef();
  const { nodes, materials, animations } = useGLTF("/assets/models/Alu.glb");
  const { actions } = useAnimations(animations, aluRef);
  const [startTutorial, setStartTutorial] = useState(false);

  /**
   * Handles the click event on the Alu model.
   */
  const onHandleAlu = useCallback(() => {
    setStartTutorial(true);
  }, []);

  useEffect(() => {
    if (actions["Idle"]) {
      actions["Idle"].play();
    }
  }, [actions]);

  return (
    <group ref={aluRef} {...props} dispose={null}>
      <RigidBody type="fixed" colliders={false}>
        <group name="Scene">
          <group name="Armature" scale={0.4}>
            <group name="Allu" onClick={onHandleAlu}>
              {["body", "foot", "eye", "noise"].map((material, index) => (
                <skinnedMesh
                  key={index}
                  name={`Allu_${index + 1}`}
                  geometry={nodes[`Allu_${index + 1}`].geometry}
                  material={materials[material]}
                  skeleton={nodes[`Allu_${index + 1}`].skeleton}
                />
              ))}
            </group>
            <primitive object={nodes.spine} />
          </group>
        </group>
        <CuboidCollider position={[0, 0.5, 0]} args={[0.8, 0.5, 0.5]} />
      </RigidBody>
      <Float distance={0.5} size={0.5} speed={1} factor={0.5} damping={0.5}>
        <Center
          position={[
            0,
            startTutorial ? props.position[1] - 1.2 : props.position[1] + 1.2,
            0,
          ]}
        >
          <Text3D
            bevelEnabled
            bevelSize={0.01}
            bevelThickness={0.01}
            height={0.02}
            lineHeight={1}
            letterSpacing={0.01}
            size={0.1}
            font="/assets/fonts/OpenSansRegular.json"
          >
            {`Haz click en mi para\nempezar el tutorial`}
            <meshStandardMaterial color={"orange"} />
          </Text3D>
        </Center>
      </Float>
      <Guide
        startTutorial={startTutorial}
        setStartTutorial={setStartTutorial}
        position-y={
          startTutorial ? props.position[1] + 1.5 : props.position[1] - 1.5
        }
      />
    </group>
  );
}

// Preload the Alu model for optimization
useGLTF.preload("/assets/models/Alu.glb");
