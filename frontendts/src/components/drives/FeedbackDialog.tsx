"use client";


import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {useEffect, useState} from "react";
import {getUserNameFromUserId, sendFeedback} from "@/pages/drives/drivesService.tsx";


interface FeedbackDialogProps {
    isDriver: boolean;
    targetId: string;
}

export function FeedbackDialog({
                                   isDriver,
                                   targetId,
                               }: FeedbackDialogProps) {

    const [open, setOpen] = useState(false);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [comment, setComment] = useState("");
    const [targetName, setTargetName] = useState<{ firstName: string; lastName: string } | null>(null);

    useEffect(() => {

        if (targetId) {
            getUserNameFromUserId(targetId).then(function (result){
                setTargetName({firstName: result.firstName, lastName: result.lastName});
            });
        }
    }, [targetId, isDriver]);

    if (!targetId) return null;
    const questions = isDriver
        ? [
            "War der Mitfahrer pünktlich? (+/- 5 Minuten)",
            "Hat sich der Mitfahrer an alle Abmachungen gehalten?",
            "Haben Sie den Mitfahrer gerne mitgenommen?",
        ]
        : [
            "War der Fahrer pünktlich? (+/- 5 Minuten)",
            "Hat sich der Fahrer an alle Abmachungen gehalten?",
            "Haben Sie sich bei der Fahrt wohl gefühlt?",
            "Ist die Fracht unbeschadet angekommen?",
        ];

    const handleSliderChange = (question: string, value: number[]) => {
        setAnswers((prev) => ({ ...prev, [question]: value[0] }));
    };

    const handleSave = async () => {
        try {
            await sendFeedback({
                answers: answers,
                comment: comment,
                targetId: targetId,
                userId:sessionStorage.getItem("UserID")
            });
           //TODO:implement this*/
            console.log("Feedback erfolgreich gesendet");
            setOpen(false);
            setAnswers({});
            setComment("");
        } catch (err) {
            console.error("Fehler beim Senden:", err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Bewerte {isDriver ? `Mitfahrer: ${targetName?.lastName}` : `Fahrer: ${targetName?.firstName} ${targetName?.lastName}`}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isDriver
                            ? `Bewertung für Mitfahrer: ${targetName?.firstName} ${targetName?.lastName}`
                            : `Bewertung für Fahrer: ${targetName?.firstName} ${targetName?.lastName}`}
                    </DialogTitle>
                    <DialogDescription>
                        Bitte bewerte alle Fragen von 1 (schlecht) bis 5 (sehr gut) und gib optional einen Kommentar ab.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {questions.map((q) => (
                        <div key={q}>
                            <label className="block mb-2 text-sm font-medium">{q}</label>
                            <Slider
                                defaultValue={[3]}
                                min={1}
                                max={5}
                                step={1}
                                value={[answers[q] || 3]}
                                onValueChange={(value) => handleSliderChange(q, value)}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Aktuelle Bewertung: {answers[q] || 3}
                            </div>
                        </div>
                    ))}

                    <div>
                        <label className="block mb-2 text-sm font-medium">Kommentar</label>
                        <Textarea
                            placeholder="Ihr Kommentar ..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSave}>Speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
