export default function Kontakt() {

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-300">
        <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Kontakt</h1>

      <p className="mb-4">
        Wenn Sie Fragen zu MyCargonaut haben oder mit uns in Kontakt treten möchten, erreichen Sie uns über folgende Wege:
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Postanschrift</h2>
        <p>
          MyCargonaut<br />
          Max Mustermann<br />
          Musterstraße 123<br />
          12345 Musterstadt<br />
          Deutschland
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">E-Mail</h2>
        <p>
          Allgemeine Anfragen:{' '}
          <br />
          Technischer Support:{' '}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Telefon</h2>
        <p>+49 (0)123 456789</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Kontaktformular</h2>
        <p>
          Alternativ können Sie uns über das Kontaktformular auf unserer Website erreichen.
          {/* Replace with link to your form if available */}
        </p>
      </section>
    </div>
    </div>
  );
};