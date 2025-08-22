// components/OfferEditDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import toast from "react-hot-toast";
import {getLocationByCity} from "@/pages/drives/drivesService";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";

export function OfferEditDialog({
                                    open,
                                    onClose,
                                    editedOffer,
                                    setEditedOffer,
                                    setOffer,
                                    FromLocationGeoName,
                                    setFromLocationGeoName,
                                    ToLocationGeoName,
                                    setToLocationGeoName,
                                    deleteOffer
                                }: any) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Angebot bearbeiten</DialogTitle>
                    <DialogDescription>Ändere die Daten des Angebots.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <Input
                        placeholder="Titel"
                        value={editedOffer.title}
                        onChange={(e) =>
                            setEditedOffer({...editedOffer, title: e.target.value})
                        }
                    />
                    <Input
                        placeholder="Beschreibung"
                        value={editedOffer.description}
                        onChange={(e) =>
                            setEditedOffer({...editedOffer, description: e.target.value})
                        }
                    />
                    <Input
                        placeholder="Von"
                        value={FromLocationGeoName}
                        onChange={(e) => setFromLocationGeoName(e.target.value)}
                        onBlur={async () => {
                            try {
                                const coords = await getLocationByCity(FromLocationGeoName);
                                setEditedOffer((prev: any) => ({
                                    ...prev,
                                    locationFrom: coords || {latitude: 0, longitude: 0},
                                }));
                            } catch (err) {
                                toast.error(
                                    "Von-Location konnte nicht gesetzt werden. Bitte gültigen Wert eingeben."
                                );
                            }
                        }}
                    />
                    <Input
                        placeholder="Nach"
                        value={ToLocationGeoName}
                        onChange={(e) => setToLocationGeoName(e.target.value)}
                        onBlur={async () => {
                            try {
                                const coords = await getLocationByCity(ToLocationGeoName);
                                setEditedOffer((prev: any) => ({
                                    ...prev,
                                    locationTo: coords || {latitude: 0, longitude: 0},
                                }));
                            } catch (err) {
                                toast.error(
                                    "Nach-Location konnte nicht gesetzt werden. Bitte gültigen Wert eingeben."
                                );
                            }
                        }}
                    />
                    <Input
                        placeholder="Preis in €"
                        type="number"
                        value={editedOffer.price}
                        onChange={(e) =>
                            setEditedOffer({
                                ...editedOffer,
                                price: parseFloat(e.target.value),
                            })
                        }
                    />
                </div>

                <DialogFooter>
                    <Button
                        onClick={() => {
                            setOffer(editedOffer);
                            onClose(false);
                        }}
                    >
                        Speichern
                    </Button>
                    <AlertDialog>
                            <Button variant="destructive">Löschen</Button>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bist du sicher?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Dieses Angebot wird dauerhaft gelöscht und kann nicht wiederhergestellt werden.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => {
                                        deleteOffer(editedOffer.offerId);
                                        onClose(false);
                                    }}
                                >
                                    Ja
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
