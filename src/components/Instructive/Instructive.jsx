import "./styles-instructive.css";
import { useRef } from "react";

/**
 * Component for displaying an instructive image.
 * @param {Object} props - The component props
 * @param {boolean} props.isLoading - Indicates if the loading text should be displayed
 * @returns {JSX.Element} The JSX.Element containing the instructive image.
 */
export default function Instructive ({ isLoading = false }) {
  const imgRef = useRef(null);

  return (
    <div className="container-instructive">
      {/* Renders the instructive image */}
      <img
        ref={imgRef}
        src="./assets/instructive/instructive.png"
        alt="instructive"
      />
      {isLoading && (
        <span className="loading-text">
          Cargando<span>.</span><span>.</span><span>.</span>
        </span>
      )}
    </div>
  );
}