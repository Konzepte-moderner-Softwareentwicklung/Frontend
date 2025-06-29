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
import { Textarea } from "@/components/ui/textarea";
import { ContactOptions } from "./ContactOptions";

interface DriverApplicationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    startDate: Date;
    endDate: Date;
    seats: string;
    storageWidth: number | null;
    storageHeight: number | null;
    storageDepth: number | null;
    storageWeight: number | null;
    description: string;
    info: string;
    restrictions: string;
    infoCar: string;
    isPhone: boolean;
    isEmail: boolean;
    isChat: boolean;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    onSeatsChange: (seats: string) => void;
    onStorageWidthChange: (width: number | null) => void;
    onStorageHeightChange: (height: number | null) => void;
    onStorageDepthChange: (depth: number | null) => void;
    onStorageWeightChange: (weight: number | null) => void;
    onDescriptionChange: (description: string) => void;
    onInfoChange: (info: string) => void;
    onRestrictionsChange: (restrictions: string) => void;
    onInfoCarChange: (infoCar: string) => void;
    onPhoneChange: (checked: boolean) => void;
    onEmailChange: (checked: boolean) => void;
    onChatChange: (checked: boolean) => void;
    onSubmit: () => void;
}

export function DriverApplicationDialog({
    open,
    onOpenChange,
    startDate,
    endDate,
    seats,
    storageWidth,
    storageHeight,
    storageDepth,
    storageWeight,
    description,
    info,
    restrictions,
    infoCar,
    isPhone,
    isEmail,
    isChat,
    onStartDateChange,
    onEndDateChange,
    onSeatsChange,
    onStorageWidthChange,
    onStorageHeightChange,
    onStorageDepthChange,
    onStorageWeightChange,
    onDescriptionChange,
    onInfoChange,
    onRestrictionsChange,
    onInfoCarChange,
    onPhoneChange,
    onEmailChange,
    onChatChange,
    onSubmit,
}: DriverApplicationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Als Fahrer melden</DialogTitle>
                    <DialogDescription>
                        Bitte ergänze die fehlenden Angaben.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Allgemein</label>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                placeholder="StartDatum"
                                type="date"
                                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                                onChange={(e) => onStartDateChange(new Date(e.target.value))}
                            />
                            <Input
                                placeholder="EndDatum"
                                type="date"
                                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                                onChange={(e) => onEndDateChange(new Date(e.target.value))}
                            />
                        </div>
                        <Input
                            placeholder="Sitzplätze"
                            type="number"
                            value={seats}
                            onChange={(e) => onSeatsChange(e.target.value)}
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lagerraum von Fahrzeug (in Meter)</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Input
                                placeholder="Breite"
                                type="number"
                                value={storageWidth ?? ""}
                                onChange={(e) => onStorageWidthChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                            />
                            <Input
                                placeholder="Höhe"
                                type="number"
                                value={storageHeight ?? ""}
                                onChange={(e) => onStorageHeightChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                            />
                            <Input
                                placeholder="Tiefe"
                                type="number"
                                value={storageDepth ?? ""}
                                onChange={(e) => onStorageDepthChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                            />
                            <Input
                                placeholder="Gewicht in kg"
                                type="number"
                                value={storageWeight ?? ""}
                                onChange={(e) => onStorageWeightChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                            />
                        </div>
                    </div>

                    <ContactOptions
                        isPhone={isPhone}
                        isEmail={isEmail}
                        isChat={isChat}
                        onPhoneChange={onPhoneChange}
                        onEmailChange={onEmailChange}
                        onChatChange={onChatChange}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Textarea
                            placeholder="Beschreibung"
                            value={description}
                            onChange={(e) => onDescriptionChange(e.target.value)}
                        />
                        <Textarea
                            placeholder="Infos/Hinweise (Einzelne Hinweise mit ; trennen)"
                            value={info}
                            onChange={(e) => onInfoChange(e.target.value)}
                        />
                        <Textarea
                            placeholder="Einschränkungen (Einzelne Einschränkungen mit ; trennen)"
                            value={restrictions}
                            onChange={(e) => onRestrictionsChange(e.target.value)}
                        />
                        <Textarea
                            placeholder="Infos über Fahrzeug/Anhänger (Einzelne Infos mit ; trennen)"
                            value={infoCar}
                            onChange={(e) => onInfoCarChange(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onSubmit}>Speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 