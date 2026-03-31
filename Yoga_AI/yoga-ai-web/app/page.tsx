"use client";

import { useState } from "react";
import YogaCanvas from "../components/YogaCanvas";
import LandingPage from "../components/LandingPage";

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <main className="fixed inset-0 bg-black overflow-hidden overscroll-none">
      <YogaCanvas />
    </main>
  );
}
