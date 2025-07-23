/**
 * @fileOverview This file contains the TitleEISC component, which displays the title of the EISC Metaverse along with the Univalle logo.
 */

import "./styles-title-eisc.css";

/**
 * TitleEISC component.
 * Renders the title of the EISC Metaverse along with the Univalle logo.
 *
 * @returns {JSX.Element} The JSX.Element containing the title and logo.
 */
export default function TitleEISC() {
  return (
    <div className="container-title-eisc">
      <div className="logos">
        <img
          className="logo-univalle"
          src={"./univalle.svg"}
          alt="Logo Universidad del Valle"
        />
        <img
          className="logo-camaleon"
          src={"./camaleon.svg"}
          alt="Logo Camaleon"
        />
      </div>
      <span className="span-title">EduVerse</span>
    </div>
  );
}
