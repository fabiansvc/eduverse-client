import { Text, useGLTF } from "@react-three/drei";
import React, { useEffect, useState, useCallback } from "react";

/**
 * Component representing the guide for the metaverse navigation tutorial.
 * This component provides instructions for navigating the metaverse.
 * @param {Object} props - Component props.
 * @param {boolean} props.startTutorial - Indicates whether the tutorial should start.
 * @param {function} props.setStartTutorial - Function to control the tutorial state.
 * @returns {JSX.Element} The guide component.
 */
export default function Guide({ startTutorial, setStartTutorial, ...props }) {
  const { nodes, materials } = useGLTF("./assets/models/Guide.glb");
  const [currentGretting, setCurrentGretting] = useState(0);
  const [currentGuide, setCurrentGuide] = useState(0);
  const [currentEnd, setCurrentEnd] = useState(0);
  const [text, setText] = useState("");

  // Arrays containing the tutorial messages
  const grettings = [
    `¡Hola!, soy Alu`,
    `Bienvenido al Metaverso de la\nEscuela de Ingeniería de\nSistemas y Computación`,
    `Mi propósito es enseñarle\ncómo navegar en el metaverso`,
    `¡Vamos a empezar!`,
  ];

  const guide = [
    `Para ver a su alrededor\nmanten presionado\nel "clic izquierdo"\n del mouse y muévalo`,
    `Para ir hacia adelante\npresione la tecla "W"\no la flecha "arriba"`,
    `Para ir hacia atrás\npresione la tecla "S"\n o la flecha "abajo"`,
    `Para ir hacia la izquierda\npresione la tecla "A"\n o la flecha "izquierda"`,
    `Para ir hacia la derecha\npresione la tecla "D"\n o la flecha "derecha"`,
    `Para navegar en el metaverso\npresiona en simultaneo\nalguna tecla y mueve el mouse`,
  ];

  const end = [
    `¡Felicidades!, ya sabe\ncomo navegar en el metaverso`,
    `Recuerda que para ver\nde nuevo este tutorial\nvisitame en este lugar`,
    `¡Nos vemos!`,
  ];

  useEffect(() => {
    if (startTutorial) {
      if (currentGretting < grettings.length) {
        setText(grettings[currentGretting]);
        const timeout = setTimeout(
          () => setCurrentGretting((prev) => prev + 1),
          3500
        );
        return () => clearTimeout(timeout);
      } else if (currentGuide < guide.length) {
        setText(guide[currentGuide]);
      } else if (currentEnd < end.length) {
        setText(end[currentEnd]);
        const timeout = setTimeout(
          () => setCurrentEnd((prev) => prev + 1),
          3500
        );
        return () => clearTimeout(timeout);
      } else {
        setStartTutorial(false);
        setCurrentGretting(0);
        setCurrentGuide(0);
        setCurrentEnd(0);
        setText("");
      }
    }
  }, [
    startTutorial,
    currentGretting,
    currentGuide,
    currentEnd,
    grettings,
    guide,
    end,
    setStartTutorial,
  ]);

  const handleBackClick = useCallback(() => {
    setCurrentGuide((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleNextClick = useCallback(() => {
    setCurrentGuide((prev) => Math.min(prev + 1, guide.length));
  }, [guide.length]);

  return (
    <group {...props} dispose={null}>
      <group>
        <group>
          <mesh
            geometry={nodes.Guide_1.geometry}
            material={materials.boardGray}
          />
          <mesh geometry={nodes.Guide_2.geometry} material={materials.board} />
        </group>
        {currentGuide > 0 && currentGuide < guide.length && (
          <group onClick={handleBackClick}>
            <mesh
              geometry={nodes.ButtonBack_1.geometry}
              material={materials.buttonRed}
            />
            <mesh
              geometry={nodes.ButtonBack_2.geometry}
              material={materials.iconButton}
            />
          </group>
        )}
        {currentGretting === grettings.length &&
          currentGuide < guide.length && (
            <group onClick={handleNextClick}>
              <mesh
                geometry={nodes.ButtonNext_1.geometry}
                material={materials.iconButton}
              />
              <mesh
                geometry={nodes.ButtonNext_2.geometry}
                material={materials.buttonRed}
              />
            </group>
          )}
      </group>
      <Text
        fontSize={0.1}
        color="black"
        position={[0, 0, 0.05]}
        textAlign="center"
      >
        {text}
      </Text>
    </group>
  );
}

// Preload the guide model for optimization
useGLTF.preload("./assets/models/Guide.glb");
