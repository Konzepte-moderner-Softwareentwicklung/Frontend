export default function Impressum() {

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-300">
      <div className="max-w-3xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-4">Impressum</h1>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Angaben gemäß § 5 TMG</h2>
            <p>MyCargonaut<br />
            Max Mustermann<br />
            Musterstraße 123<br />
            12345 Musterstadt<br />
            Deutschland
            </p>
        </section>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
            <p>Telefon: +49 (0)123 456789<br />
            </p>
        </section>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Vertreten durch</h2>
            <p>Max Mustermann</p>
        </section>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Umsatzsteuer-ID</h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE123456789</p>
        </section>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>Max Mustermann<br />
            Musterstraße 123<br />
            12345 Musterstadt
            </p>
        </section>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Haftungsausschluss</h2>
            <p>
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. 
            Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
            </p>
        </section>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Streitschlichtung</h2>
            <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <br />
            Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
            <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
        </section>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">App-Entwicklung und technischer Betrieb</h2>
            <p>
            MyCargonaut wird als Web- und Mobilanwendung kontinuierlich weiterentwickelt. 
            Bei technischen Fragen oder Problemen wenden Sie sich bitte an:{' '}
            </p>
        </section>
        </div>
    </div>
  );
}