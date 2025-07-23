import EISCFifthFloor from "./components/EISCFifthFloor"
import EISCFirstFloor from "./components/EISCFirstFloor"
import EISCFourthFloor from "./components/EISCFourthFloor"
import EISCSecondFloor from "./components/EISCSecondFloor"
import EISCThirdFloor from "./components/EISCThirdFloor"
import Outside from "./components/Outside"
import Stairs from "./components/Stairs"

/**
 * Component representing the virtual environment of the Escuela de Ingeniería de Sistemas y Computación (EISC) building.
 * This component renders different floors and areas of the building.
 * @returns {JSX.Element} The JSX.Element containing all the components representing the EISC building.
 */
export default function EISC () {
    return (
        <>
            {/* Renders the first floor of the EISC building */}
            <EISCFirstFloor />

            {/* Renders the second floor of the EISC building */}
            <EISCSecondFloor />

            {/* Renders the third floor of the EISC building */}
            <EISCThirdFloor />

            {/* Renders the fourth floor of the EISC building */}
            <EISCFourthFloor />

            {/* Renders the fifth floor of the EISC building */}
            <EISCFifthFloor />

            {/* Renders the stairs component */}
            <Stairs />

            {/* Renders the outside area of the EISC building */}
            <Outside />
        </>
    );
}
