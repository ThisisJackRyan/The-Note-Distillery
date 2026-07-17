"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAuthUser } from "@/firebase/firebaseFunctions";

const features = [
  {
    title: "Extract",
    text: "Handwritten or printed, your notes become clean, editable text in seconds.",
  },
  {
    title: "Distill",
    text: "Complex equations and dense pages are refined into structured content.",
  },
  {
    title: "Recall",
    text: "Everything is searchable, so the note you need is never more than a keystroke away.",
  },
];

const contributors = [
  "Jonas Bronson",
  "Benton Diebold",
  "Jack Ryan",
  "Matt Wilson",
];

// Subtle reveal-on-scroll wrapper
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const { user } = useAuthUser();

  return (
    <div className="bg-gray-900 text-white">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        {/* faint accent glow */}
        <div className="pointer-events-none absolute left-1/2 top-16 -z-10 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-blue-600/10 blur-[100px]" />

        <div className="mx-auto max-w-5xl px-6 pt-24 pb-28 text-center lg:pt-32">
          <p className="animate-fade-in-up mb-6 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
            Intelligent OCR for your notes
          </p>
          <h1 className="animate-fade-in-up delay-100 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Welcome to the Note Distillery
          </h1>
          <p className="animate-fade-in-up delay-100 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-400">
            Upload a photo of any page and watch it turn into clean, editable
            text — even complex math. Spend your hours learning instead of
            transcribing.
          </p>
          <div className="animate-fade-in-up delay-200 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={user ? "/zone" : "/signup"}
              className="group inline-flex items-center gap-2 rounded-md bg-blue-600 px-7 py-3 text-base font-medium text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/30"
            >
              {user ? "Enter The Zone" : "Get started"}
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="/upload"
              className="rounded-md px-7 py-3 text-base font-medium text-gray-300 transition-colors duration-200 hover:text-white"
            >
              Upload a page
            </Link>
          </div>

          <div className="animate-fade-in-up delay-200 group relative mt-20">
            {/* soft glow beneath the image */}
            <div className="pointer-events-none absolute -inset-x-8 -bottom-8 top-8 -z-10 rounded-3xl bg-blue-600/10 blur-2xl transition-opacity duration-500 group-hover:opacity-80" />
            <Image
              src="/pexels-cristian-rojas-7260636.jpg"
              alt="Notes being refined into clean text"
              width={960}
              height={620}
              className="mx-auto w-full rounded-xl ring-1 ring-white/10 shadow-2xl shadow-black/40 transition-transform duration-500 group-hover:-translate-y-1"
              priority
            />
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-10 sm:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="border-t border-gray-800 pt-6">
                <span className="font-mono text-sm text-blue-400">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-lg font-medium text-white">
                  {f.title}
                </h3>
                <p className="mt-3 leading-relaxed text-gray-400">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Maximize Your Learning ---------- */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Maximize your learning
          </h2>
          <span className="mx-auto mt-5 block h-px w-10 bg-blue-500/70" />
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Note Distillery turns the messiest notebooks into clean, structured,
            searchable notes. Spend less time recopying and more time actually
            understanding the material.
          </p>
        </Reveal>
      </section>

      {/* ---------- Parallax: Organize With Ease ---------- */}
      <section className="relative flex h-[70vh] items-center justify-center bg-cover bg-fixed bg-center bg-[url('/pexels-rdne-5759789.jpg')] md:bg-[url('/pexels-vanessa-garcia-6326185.jpg')]">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/80" />
        <h2 className="relative px-6 text-center text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Organize with ease
        </h2>
      </section>

      {/* ---------- Streamline Your Workflow ---------- */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Streamline your workflow
          </h2>
          <span className="mx-auto mt-5 block h-px w-10 bg-blue-500/70" />
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Your notes stay accessible, organized, and ready for action. Whether
            you&apos;re a student, professional, or lifelong learner, the tools
            are built to help you reach your goals.
          </p>
        </Reveal>
      </section>

      {/* ---------- Login CTA ---------- */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <Reveal>
          <div className="rounded-2xl border border-gray-800 bg-gray-800/40 px-8 py-16 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to transform your notes?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
              {user
                ? "Head back into The Zone and pick up where you left off."
                : "Log in to begin your journey with Note Distillery."}
            </p>
            <Link
              href={user ? "/zone" : "/login"}
              className="group mt-10 inline-flex items-center gap-2 rounded-md bg-blue-600 px-7 py-3 text-base font-medium text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/30"
            >
              {user ? "Enter The Zone" : "Log in"}
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ---------- Contributors ---------- */}
      <footer className="border-t border-gray-800">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
            Contributors
          </h2>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-gray-300">
            {contributors.map((name) => (
              <li
                key={name}
                className="transition-colors duration-200 hover:text-white"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
