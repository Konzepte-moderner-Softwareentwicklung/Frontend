import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type SearchDialogFields } from "@/pages/drives/drivesService.tsx";

interface EditOfferDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fields: SearchDialogFields;
    onFieldChange: (field: keyof SearchDialogFields, value: any) => void;
    onPackageChange: (field: string, value: number) => void;
    onSubmit: () => void;
}

export function EditOfferDialog({
    open,
    onOpenChange,
    fields,
    onFieldChange,
    onPackageChange,
    onSubmit,
}: EditOfferDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Felder bearbeiten</DialogTitle>
                    <DialogDescription>
                        Bearbeite die Informationen für dein Angebot.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <Input
                        placeholder="Titel"
                        value={fields.title}
                        onChange={(e) => onFieldChange("title", e.target.value)}
                    />
                    <Input
                        placeholder="Beschreibung"
                        value={fields.description}
                        onChange={(e) =>
                            onFieldChange("description", e.target.value)
                        }
                    />
                    <Input
                        placeholder="Startort"
                        value={fields.locationFrom}
                        onChange={(e) =>
                            onFieldChange("locationFrom", e.target.value)
                        }
                    />
                    <Input
                        placeholder="Zielort"
                        value={fields.locationTo}
                        onChange={(e) => onFieldChange("locationTo", e.target.value)}
                    />
                    <Input
                        placeholder="Anzahl Passagiere"
                        type="number"
                        value={fields.passengers}
                        onChange={(e) =>
                            onFieldChange("passengers", Number(e.target.value))
                        }
                    />
                    <Input
                        placeholder="Preis (€)"
                        type="number"
                        value={fields.price}
                        onChange={(e) =>
                            onFieldChange("price", Number(e.target.value))
                        }
                    />

                    <div className="font-semibold mt-2">Paketgröße & Gewicht</div>
                    <Input
                        placeholder="Breite (cm)"
                        type="number"
                        value={fields.package.size.width}
                        onChange={(e) =>
                            onPackageChange("width", parseFloat(e.target.value))
                        }
                    />
                    <Input
                        placeholder="Höhe (cm)"
                        type="number"
                        value={fields.package.size.height}
                        onChange={(e) =>
                            onPackageChange("height", parseFloat(e.target.value))
                        }
                    />
                    <Input
                        placeholder="Tiefe (cm)"
                        type="number"
                        value={fields.package.size.depth}
                        onChange={(e) =>
                            onPackageChange("depth", parseFloat(e.target.value))
                        }
                    />
                    <Input
                        placeholder="Gewicht (kg)"
                        type="number"
                        value={fields.package.weight}
                        onChange={(e) =>
                            onPackageChange("weight", parseFloat(e.target.value))
                        }
                    />
                    <Input
                        placeholder="Weitere Infos"
                        value={fields.info}
                        onChange={(e) => onFieldChange("info", e.target.value)}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
                    <Button onClick={onSubmit}>Speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 