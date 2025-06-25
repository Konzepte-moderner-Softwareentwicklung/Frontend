export default function Footer() {
  return (
    <footer className="w-full text-center text-sm text-gray-500 py-4 border-t">
      <div className="flex justify-center space-x-6">
        <a href="/impressum" className="hover:underline">Impressum</a>
        <a href="/agb" className="hover:underline">AGB</a>
        <a href="/kontakt" className="hover:underline">Kontakt</a>
      </div>
    </footer>
  );
}