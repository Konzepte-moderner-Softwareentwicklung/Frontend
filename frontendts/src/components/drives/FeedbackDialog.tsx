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
import { useEffect, useState } from "react";
import { getUserNameFromUserId, sendFeedback } from "@/pages/drives/drivesService.tsx";

interface FeedbackDialogProps {
    isDriver: boolean;
    targetId: string;
    offerId: string;
}

export function FeedbackDialog({offerId,
                                   isDriver,
                                   targetId,
                               }: FeedbackDialogProps) {
    const [open, setOpen] = useState(false);
    const [answers, setAnswers] = useState<{ content: string; value: number }[]>([]);
    const [comment, setComment] = useState("");
    const [targetName, setTargetName] = useState<{ firstName: string; lastName: string } | null>(null);

    useEffect(() => {
        if (targetId) {
            getUserNameFromUserId(targetId).then((result) => {
                setTargetName({ firstName: result.firstName, lastName: result.lastName });
            });
        }
    }, [targetId]);

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
        setAnswers((prev) => {
            const existing = prev.find((a) => a.content === question);
            if (existing) {
                return prev.map((a) =>
                    a.content === question ? { ...a, value: value[0] } : a
                );
            } else {
                return [...prev, { content: question, value: value[0] }];
            }
        });
    };

    const getAnswerValue = (question: string) => {
        const found = answers.find((a) => a.content === question);
        return found ? found.value : 3;
    };

    const handleSave = async () => {
        try {
            // Fehlende Fragen ergänzen
            const completedAnswers = questions.map((q) => {
                const found = answers.find((a) => a.content === q);
                return found ? found : { content: q, value: 3 };
            });

            await sendFeedback(offerId, {
                answers: completedAnswers,
                comment: comment,
                targetId: targetId,
                userId: sessionStorage.getItem("UserID"),
            });

            setOpen(false);
            setAnswers([]);
            setComment("");
        } catch (err) {
            console.error("Fehler beim Senden:", err);
        }
    };


    if (!targetId) return null;

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
                                value={[getAnswerValue(q)]}
                                onValueChange={(value) => handleSliderChange(q, value)}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Aktuelle Bewertung: {getAnswerValue(q)}
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
