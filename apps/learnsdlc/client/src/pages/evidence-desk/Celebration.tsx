import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
export default function Celebration({ milestone }: { milestone: string }) {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.15);
  const [reduce, setReduce] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [disabled, setDisabled] = useState(
    () => localStorage.getItem("ed-disable-motion") === "true"
  );
  const trigger = useRef<HTMLButtonElement>(null);
  const snapshot = useRef({ scroll: 0, path: "" });
  const audio = useRef<AudioContext | null>(null);
  function stop() {
    setPlaying(false);
    setPaused(false);
    audio.current?.close().catch(() => {});
    audio.current = null;
    if (window.location.pathname === snapshot.current.path) {
      requestAnimationFrame(() => {
        window.scrollTo(0, snapshot.current.scroll);
        trigger.current?.focus({ preventScroll: true });
      });
    }
  }
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      setReduce(query.matches);
      if (query.matches) {
        setPlaying(false);
        audio.current?.close().catch(() => {});
      }
    };
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!playing || paused || reduce || disabled) return;
    const timer = setInterval(() => setSeconds(v => Math.max(v - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [playing, paused, reduce, disabled]);
  useEffect(() => {
    if (playing && seconds === 0) stop();
  }, [seconds, playing]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && playing) stop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing]);
  useEffect(
    () => () => {
      audio.current?.close().catch(() => {});
    },
    []
  );
  async function cue() {
    if (muted || reduce || disabled) return;
    try {
      const ctx = new AudioContext();
      audio.current = ctx;
      const osc = ctx.createOscillator(),
        gain = ctx.createGain();
      osc.frequency.value = 440;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.12, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
      osc.onended = () => ctx.close().catch(() => {});
    } catch {
      /* The same text and progress remain when sound is unavailable. */
    }
  }
  return (
    <div className="rounded-xl border border-primary/25 bg-card p-5 space-y-4">
      <p className="font-semibold">{milestone}</p>
      <p className="text-sm">
        Your milestone is already recorded. Static, skipped, muted and animated
        choices have identical progress.
      </p>
      <label className="flex gap-3 items-center text-sm">
        <input
          type="checkbox"
          checked={disabled}
          onChange={e => {
            setDisabled(e.target.checked);
            localStorage.setItem("ed-disable-motion", String(e.target.checked));
            if (e.target.checked) stop();
          }}
        />
        Disable decorative motion
      </label>
      {reduce && (
        <p className="text-sm">
          Reduced motion is active: static acknowledgement only.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button
          ref={trigger}
          variant="outline"
          disabled={reduce || disabled}
          onClick={() => {
            snapshot.current = {
              scroll: window.scrollY,
              path: window.location.pathname,
            };
            setSeconds(60);
            setPaused(false);
            setPlaying(true);
          }}
        >
          Play optional 60-second celebration
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (playing) stop();
          }}
        >
          Show static milestone / continue
        </Button>
      </div>
      {playing && (
        <section
          aria-label="Optional decorative celebration"
          className="space-y-4"
        >
          <div
            className={`ed-party ${paused ? "ed-party-paused" : ""}`}
            aria-hidden="true"
          >
            <div className="ed-balloon b1" />
            <div className="ed-balloon b2" />
            <div className="ed-balloon b3" />
            <div className="ed-pool" />
            <div className="ed-mascot tally">
              <span className="ed-eye" />
              <span className="ed-eye" />
            </div>
            <div className="ed-mascot quillfin">
              <span className="ed-eye" />
              <span className="ed-eye" />
            </div>
          </div>
          <p className="text-sm">
            Tally and Quillfin, original fictional evidence mascots, beside a
            diagrammatic pool. {seconds} seconds of optional active playback
            remain.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setPaused(v => !v)}>
              {paused ? "Resume celebration" : "Pause celebration"}
            </Button>
            <Button onClick={stop}>Skip and resume learning</Button>
          </div>
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold">
              Optional soft cue — never autoplay
            </legend>
            <label className="flex gap-3">
              <input
                type="checkbox"
                checked={muted}
                onChange={e => setMuted(e.target.checked)}
              />
              Mute cue
            </label>
            <label className="flex gap-3">
              Volume
              <input
                type="range"
                min="0"
                max="1"
                step=".05"
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
              />
            </label>
            <Button variant="outline" disabled={muted} onClick={cue}>
              Play optional soft cue
            </Button>
          </fieldset>
        </section>
      )}
    </div>
  );
}
