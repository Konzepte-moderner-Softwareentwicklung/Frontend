import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Mock user data
  const [user, setUser] = useState({
    vorname: "Max",
    nachname: "Mustermann",
    email: "max@example.com",
    geburtstag: "1995-04-12",
    telefon: "+49 123 4567890",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  });
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEdit = () => {
    setEditUser(user);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditUser(user);
  };

  const handleSave = () => {
    setUser(editUser);
    setEditMode(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditUser(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold mb-10 text-center text-green-800">Einstellungen</h1>
        {/* Profile Info Section */}
        <div className="bg-white rounded-xl shadow-lg border border-green-200 mb-8">
          <div className="px-8 pt-8 pb-4 border-b border-green-100">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={editMode ? editUser.avatar : user.avatar}
                alt="Profilbild"
                className="w-28 h-28 rounded-full border-4 border-green-200 shadow-md object-cover mb-2"
              />
              {editMode && (
                <>
                  <Button
                    size="sm"
                    className="mt-2 bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 font-semibold"
                    variant="outline"
                    onClick={triggerFileInput}
                  >
                    Profilbild ändern
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                </>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-green-900 mb-2">Profilinformationen</h2>
            <p className="text-green-700 mb-4">Verwalte deine persönlichen Daten.</p>
            <div className="space-y-6">
              <div>
                <span className="block text-green-700 font-medium mb-1">Vorname</span>
                {editMode ? (
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                    value={editUser.vorname}
                    onChange={e => setEditUser({ ...editUser, vorname: e.target.value })}
                  />
                ) : (
                  <span className="block text-green-900 font-semibold">{user.vorname}</span>
                )}
              </div>
              <div>
                <span className="block text-green-700 font-medium mb-1">Nachname</span>
                {editMode ? (
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                    value={editUser.nachname}
                    onChange={e => setEditUser({ ...editUser, nachname: e.target.value })}
                  />
                ) : (
                  <span className="block text-green-900 font-semibold">{user.nachname}</span>
                )}
              </div>
              <div>
                <span className="block text-green-700 font-medium mb-1">E-Mail</span>
                {editMode ? (
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                    value={editUser.email}
                    onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                    type="email"
                  />
                ) : (
                  <span className="block text-green-900 font-semibold">{user.email}</span>
                )}
              </div>
              <div>
                <span className="block text-green-700 font-medium mb-1">Geburtstag</span>
                {editMode ? (
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                    value={editUser.geburtstag}
                    onChange={e => setEditUser({ ...editUser, geburtstag: e.target.value })}
                    type="date"
                  />
                ) : (
                  <span className="block text-green-900 font-semibold">{new Date(user.geburtstag).toLocaleDateString()}</span>
                )}
              </div>
              <div>
                <span className="block text-green-700 font-medium mb-1">Telefonnummer</span>
                {editMode ? (
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                    value={editUser.telefon}
                    onChange={e => setEditUser({ ...editUser, telefon: e.target.value })}
                    type="tel"
                  />
                ) : (
                  <span className="block text-green-900 font-semibold">{user.telefon}</span>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              {editMode ? (
                <>
                  <Button className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold border border-green-700" onClick={handleSave}>Speichern</Button>
                  <Button className="flex-1 bg-white text-green-700 border border-green-300 hover:bg-green-50 font-semibold" variant="outline" onClick={handleCancel}>Abbrechen</Button>
                </>
              ) : (
                <Button className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold border border-green-700" onClick={handleEdit}>Bearbeiten</Button>
              )}
            </div>
          </div>
        </div>
        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-lg border border-green-200 mb-8">
          <div className="px-8 pt-8 pb-4 border-b border-green-100">
            <h2 className="text-2xl font-semibold text-green-900 mb-2">Sicherheit</h2>
            <p className="text-green-700 mb-4">Verwalte deine Sicherheitseinstellungen.</p>
            <Button
              className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 font-semibold"
              variant="outline"
              onClick={() => alert('Passkey hinzufügen (Demo)')}
            >
              Passkey hinzufügen
            </Button>
          </div>
        </div>
        {/* Account Actions Section */}
        <div className="bg-white rounded-xl shadow-lg border border-green-200">
          <div className="px-8 pt-8 pb-4">
            <h2 className="text-2xl font-semibold text-green-900 mb-2">Konto</h2>
            <p className="text-green-700 mb-4">Abmelden oder Konto verwalten.</p>
            <Button
              className="w-full bg-white text-green-700 border border-green-300 hover:bg-green-50 font-semibold"
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 