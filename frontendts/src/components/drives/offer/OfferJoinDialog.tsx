// components/OfferJoinDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function OfferJoinDialog({
                                    open,
                                    onClose,
                                    joinsWithPassenger,
                                    setJoinsWithPassenger,
                                    itemWidth,
                                    setItemWidth,
                                    itemHeight,
                                    setItemHeight,
                                    itemDepth,
                                    setItemDepth,
                                    itemWeight,
                                    setItemWeight,
                                    onJoin,
                                }: any) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Teilnahme bestätigen</DialogTitle>
                    <DialogDescription>
                        Gib bitte an, ob du selbst mitfährst und ob du Gepäck mitnimmst.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={joinsWithPassenger}
                            onChange={(e) => setJoinsWithPassenger(e.target.checked)}
                        />
                        Ich fahre selbst mit
                    </label>

                    <Input
                        placeholder="Breite in m"
                        type="number"
                        value={itemWidth}
                        onChange={(e) => setItemWidth(e.target.value)}
                    />
                    <Input
                        placeholder="Höhe in m"
                        type="number"
                        value={itemHeight}
                        onChange={(e) => setItemHeight(e.target.value)}
                    />
                    <Input
                        placeholder="Tiefe in m"
                        type="number"
                        value={itemDepth}
                        onChange={(e) => setItemDepth(e.target.value)}
                    />
                    <Input
                        placeholder="Gewicht in kg"
                        type="number"
                        value={itemWeight}
                        onChange={(e) => setItemWeight(e.target.value)}
                    />
                </div>

                <DialogFooter>
                    <Button
                        onClick={() => {

                            onJoin();
                            onClose(false);
                        }}
                    >
                        Teilnehmen und bezahlen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
