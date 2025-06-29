interface PackageInfoSectionProps {
    package: {
        size: {
            width: number;
            height: number;
            depth: number;
        };
        weight: number;
    };
}

export function PackageInfoSection({ package: packageInfo }: PackageInfoSectionProps) {
    return (
        <div className="mb-6">
            <h2 className="font-semibold">Paketinformationen</h2>
            <ul className="list-disc ml-5">
                <li>
                    Größe: {packageInfo.size.width}×
                    {packageInfo.size.height}×
                    {packageInfo.size.depth} cm
                </li>
                <li>Gewicht: {packageInfo.weight} kg</li>
            </ul>
        </div>
    );
} 