import { useCallback, useEffect, useRef, useState } from "react";
import { SkipForward, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CinematicIntro({ source }: { source: string }) {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismiss = useCallback(() => {
    setFading(true);
    timeoutRef.current = setTimeout(() => setVisible(false), 600);
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("petpals-cinematic-intro-v3") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      sessionStorage.setItem("petpals-cinematic-intro-v3", "1");
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, dismiss]);

  if (!visible) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Team Beagle opening film" className={`fixed inset-0 z-[100] bg-cinema transition-opacity duration-500 motion-reduce:transition-none ${fading ? "opacity-0" : "opacity-100"}`}>
      <video ref={videoRef} src={source} autoPlay muted={muted} playsInline onEnded={dismiss} onError={dismiss} className="h-full w-full object-contain" />
      <div className="absolute bottom-6 right-6 flex gap-3">
        <Button variant="outline" size="icon" aria-label={muted ? "Enable intro sound" : "Mute intro sound"} title={muted ? "Enable intro sound" : "Mute intro sound"} onClick={() => setMuted((value) => !value)} className="border-cinema-foreground/30 bg-cinema/70 text-cinema-foreground hover:bg-cinema-foreground/10 hover:text-cinema-foreground">
          {muted ? <VolumeX /> : <Volume2 />}
        </Button>
        <Button variant="outline" onClick={dismiss} autoFocus className="border-cinema-foreground/30 bg-cinema/70 text-cinema-foreground hover:bg-cinema-foreground/10 hover:text-cinema-foreground"><SkipForward /> Skip intro</Button>
      </div>
    </div>
  );
}