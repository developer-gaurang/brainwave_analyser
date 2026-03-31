"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export default function CheckoutButton() {
    const [isLaunching, setIsLaunching] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleLaunch = async () => {
        setIsLaunching(true);
        setStatus("idle");
        try {
            const response = await fetch("/api/launch");
            const data = await response.json();
            if (data.status === "success") {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Launch Error:", error);
            setStatus("error");
        } finally {
            setIsLaunching(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLaunch}
                disabled={isLaunching}
                className="w-full py-4 px-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-bold text-lg shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Rocket className={cn("w-6 h-6", isLaunching && "animate-pulse")} />
                {isLaunching ? "INITIALIZING..." : status === "success" ? "LAUNCHED" : "INITIALIZE STREAMLIT"}
            </motion.button>

            {status === "success" && (
                <p className="text-sm text-green-400 font-medium">Streamlit is starting in a new window!</p>
            )}
            {status === "error" && (
                <p className="text-sm text-red-400 font-medium">Error launching. Is the server running?</p>
            )}
        </div>
    );
}

// Utility to merge classes (re-defined here to avoid hook issues if not using utils)
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
