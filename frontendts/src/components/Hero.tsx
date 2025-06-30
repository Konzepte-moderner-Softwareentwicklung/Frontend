import cargonautLogo from '../assets/SVG/semi_androidMyCargonaut.svg';

export default function Hero() {
  return (
      <div className="px-10 py-8 flex flex-row items-start justify-center gap-12 text-left">
          <img
              src={cargonautLogo}
              alt="Hero"
              className="w-[500px] h-auto"
          />
          <div className="max-w-xl text-[14px] leading-snug">
              <p className="mb-3">
                  Entdecke eine völlig neue Art, Transport und Mitfahrgelegenheiten zu verbinden.
                  Ob du als Fahrer freie Kapazitäten in deinem Fahrzeug hast oder als Mitfahrer günstige Fahrten.
              </p>
              <ul className="list-disc pl-4 space-y-1">
                  <li><b>Schnell & Einfach:</b> Registriere dich in wenigen Schritten und finde passende Angebote in deiner Region.</li>
                  <li><b>Flexibel & Individuell:</b> Vom Kleingepäck bis zur Großladung – wähle genau die Person, die zu Budget & Zeitplan passt.</li>
                  <li><b>Zuverlässig & Bewertet:</b> Jede Fahrt wird bewertet – erkenne auf einen Blick, ob alles sicher & pünktlich läuft.</li>
                  <li><b>Gemeinschaft & Nachhaltigkeit:</b> Spare Kosten, lerne neue Leute kennen und reduziere CO₂-Ausstoß.</li>
              </ul>
          </div>
      </div>


  );
}
