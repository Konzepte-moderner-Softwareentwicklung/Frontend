import React, { useState } from "react";
import { Switch } from "@/components/ui/switch.jsx"
import {Button} from "@/components/ui/button";

function Home() {
    const [enabled, setEnabled] = useState(false);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Home</h1>
            <div className="flex items-center space-x-4">
                <Switch checked={enabled} onCheckedChange={setEnabled} />
                <Button>OK</Button>
                <span>{enabled ? "Aktiviert" : "Deaktiviert"}</span>
            </div>
        </div>
    );
}
export default Home;
