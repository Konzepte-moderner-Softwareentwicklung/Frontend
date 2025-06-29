interface ErrorDisplayProps {
    onBackClick: () => void;
}

export function ErrorDisplay({ onBackClick }: ErrorDisplayProps) {
    return (
        <div className="min-h-screen bg-cyan-100 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={onBackClick}
                    className="mb-6 px-4 py-2 bg-white text-blue-600 rounded shadow hover:bg-blue-50 transition"
                >
                    ← Zurück
                </button>

                <div className="bg-white p-6 rounded-2xl shadow text-center">
                    <h1 className="text-xl font-bold text-red-600 mb-4">
                        Die Fahrt konnte nicht geladen werden.
                    </h1>
                    <p className="text-gray-600">
                        Bitte überprüfe den Link oder versuche es später erneut.
                    </p>
                </div>
            </div>
        </div>
    );
} 