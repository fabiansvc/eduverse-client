import { useMemo } from "react";
import "./styles-footer.css";


/**
 * Component for displaying a footer.
 * @returns {JSX.Element} The JSX.Element containing the footer.
 */
export default function Footer() {
  const teachers = useMemo(
    () => [
      {
        name: "Ing. Fabian Stiven Valencia Cordoba",
        email: "fabian.cordoba@correounivalle.edu.co",
      },
      {
        name: "Paola Johanna Rodriguez Carrillo PhD",
        email: "paola.rodriguez@correounivalle.edu.co",
      },
      {
        name: "Javier Mauricio Reyes Vera PhD",
        email: "javier.reyes@correounivalle.edu.co",
      },
    ],
    []
  );

  return (
    <footer className="footer">
      <div>
        <h4>Creado por los Profesores de la Universidad del Valle:</h4>
        <ul>
          {teachers.map((teacher) => (
            <li key={teacher.email}>
              <a href={`mailto:${teacher.email}`}>
                <span>{teacher.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4>&copy; Universidad del Valle - 2024</h4>
        <a 
          href="https://eisc.univalle.edu.co/index.php/grupos-investigacion/camaleon" 
          target="_blank">Grupo de investigación Camaleón</a>
      </div>
    </footer>
  );
}
