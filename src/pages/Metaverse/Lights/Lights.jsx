import { Environment } from "@react-three/drei";

/**
 * Component for setting up lights and environment in the scene.
 * @returns {JSX.Element} The JSX.Element containing the lights and environment setup.
 */
export default function Lights() {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={1} />
      {/* Environment setup */}
      <Environment
        preset={null} // No preset
        files="/assets/environment/storm4K.hdr" // Environment files
        background={true} // Apply environment to background
        ground={{
          // Ground settings
          height: 10,
          radius: 1500,
          scale: 160,
        }}
      />
    </>
  );
}
