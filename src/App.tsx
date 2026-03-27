/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ChevronDown, Star, Zap, Globe, ArrowRight, Terminal, Copy, Check, Layers, Sparkles, Code2 } from 'lucide-react';

const CodeBlock = ({ code, language = 'tsx' }: { code: string, language?: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#0d0d0d] border border-neutral-800 my-6 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-neutral-500" />
          <span className="text-xs text-neutral-400 font-mono">{language}</span>
        </div>
        <button 
          onClick={handleCopy} 
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors bg-neutral-800/50 hover:bg-neutral-800 px-2 py-1 rounded-md"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto text-[13px] leading-relaxed font-mono text-neutral-300">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default function App() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 600);
          return 100;
        }
        return prev + Math.floor(Math.random() * 12) + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isLoading]);

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const snippets = [
    {
      title: "1. Scroll Progress Bar",
      description: "A fixed indicator at the top of the screen that fills up as the user scrolls down.",
      icon: <Layers className="text-blue-400" />,
      language: "tsx",
      code: `import { motion, useScroll } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 bg-white origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
}`
    },
    {
      title: "2. Fade In On Scroll",
      description: "Elements that smoothly fade and slide up into view when they enter the viewport.",
      icon: <Sparkles className="text-amber-400" />,
      language: "tsx",
      code: `import { motion } from "motion/react";

export function FadeInSection({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}`
    },
    {
      title: "3. Parallax Image Effect",
      description: "Creates a sense of depth by moving an image at a different speed than the scroll.",
      icon: <Layers className="text-purple-400" />,
      language: "tsx",
      code: `import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function ParallaxImage({ src, alt }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Move image down by 20% as user scrolls past
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div ref={ref} className="overflow-hidden relative h-[500px] w-full rounded-2xl">
      <motion.img
        style={{ y }}
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-[140%] object-cover"
      />
    </div>
  );
}`
    },
    {
      title: "4. Custom CSS Scrollbar",
      description: "A sleek, dark-themed scrollbar to replace the default browser scrollbar.",
      icon: <Code2 className="text-emerald-400" />,
      language: "css",
      code: `/* Add to your global CSS file (e.g., index.css) */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #333333;
  border-radius: 5px;
  border: 2px solid #0a0a0a; /* Creates padding effect */
}

::-webkit-scrollbar-thumb:hover {
  background: #555555;
}

html {
  scroll-behavior: smooth;
}`
    }
  ];

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white"
          >
            <div className="w-full max-w-md px-8 flex flex-col items-center">
              <motion.div 
                className="text-[15vw] md:text-[10vw] font-display font-bold leading-none tracking-tighter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {counter}%
              </motion.div>
              <div className="w-full h-[2px] bg-neutral-800 mt-8 overflow-hidden relative">
                <motion.div 
                  className="absolute top-0 left-0 bottom-0 bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: `${counter}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                />
              </div>
              <motion.div 
                className="mt-6 text-neutral-500 uppercase tracking-widest text-xs font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Loading Experience
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
        {/* Progress bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-50"
          style={{ scaleX: scrollYProgress }}
        />

        {/* Hero Section */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            style={{ scale, y }}
          >
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
              alt="Abstract background"
              className="w-full h-full object-cover opacity-30 animate-wavy-bg"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 30 : 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="text-center z-10 px-4 cursor-pointer select-none"
            style={{ opacity }}
            onClick={() => setIsGlowing(!isGlowing)}
          >
            <h1 className={`font-display text-[15vw] md:text-[12vw] leading-none font-bold tracking-tighter uppercase transition-all duration-500 ${isGlowing ? 'glow-text text-white' : ''}`}>
              Modern
            </h1>
            <h1 className={`font-display text-[15vw] md:text-[12vw] leading-none font-bold tracking-tighter uppercase transition-all duration-500 ${isGlowing ? 'glow-text text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-700'}`}>
              Scroll
            </h1>
          </motion.div>

          <motion.div
            className="absolute bottom-10 flex flex-col items-center gap-2 text-neutral-400 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1, y: [0, 10, 0] }}
            transition={{ 
              opacity: { duration: 1, delay: 1 },
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }}
            style={{ opacity }}
          >
            <span className="text-xs uppercase tracking-widest font-medium">Scroll to explore</span>
            <ChevronDown size={20} />
          </motion.div>
        </section>

        {/* Content Section 1 */}
        <motion.section 
          className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10 bg-black"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Fluid motion. <br />
                <span className="text-neutral-500">Seamless design.</span>
              </h2>
              <p className="text-xl text-neutral-400 max-w-md leading-relaxed">
                Experience the web like never before. With hardware-accelerated animations, perfectly tuned easing curves, and a custom scrollbar.
              </p>
            </motion.div>
            <motion.div
              className="aspect-[4/5] bg-neutral-900 rounded-3xl overflow-hidden relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop"
                alt="Architecture"
                className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Horizontal Scroll Illusion Section */}
        <section className="py-32 bg-white text-black overflow-hidden rounded-t-[3rem] md:rounded-t-[5rem] relative z-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
            >
              <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tighter max-w-xl leading-tight">
                Features that matter.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Star, title: "Premium Quality", desc: "Crafted with attention to every single pixel and interaction." },
                { icon: Zap, title: "Lightning Fast", desc: "Optimized for speed, performance, and accessibility." },
                { icon: Globe, title: "Global Reach", desc: "Accessible from anywhere in the world, on any device." }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="p-10 rounded-3xl bg-neutral-100 hover:bg-neutral-200 transition-colors"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                >
                  <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mb-8">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Large Image Parallax */}
        <section className="h-[150vh] relative bg-black">
          <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              <img
                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2564&auto=format&fit=crop"
                alt="Minimalist interior"
                className="w-full h-full object-cover opacity-40"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.h2
              className="font-display relative z-10 text-6xl md:text-9xl font-black tracking-tighter uppercase text-center mix-blend-overlay"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Immersive
            </motion.h2>
          </div>
        </section>

        {/* Developer Snippets Section */}
        <section className="py-32 bg-[#050505] relative z-20 border-t border-neutral-900">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight mb-4">For Developers</h2>
              <p className="text-neutral-400 leading-relaxed max-w-2xl text-lg">
                Love these animations? Grab the code snippets below and drop them directly into your React projects.
              </p>
            </motion.div>

            <div className="space-y-16">
              {snippets.map((snippet, index) => (
                <motion.section 
                  key={index} 
                  className="scroll-mt-24"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800 shadow-inner">
                      {snippet.icon}
                    </div>
                    <h3 className="text-2xl font-medium tracking-tight">{snippet.title}</h3>
                  </div>
                  <p className="text-neutral-400 text-base mb-6 ml-[3.25rem]">{snippet.description}</p>
                  
                  <div className="ml-0 md:ml-[3.25rem]">
                    <CodeBlock code={snippet.code} language={snippet.language} />
                  </div>
                </motion.section>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Bouncing Scroll */}
        <section className="py-32 bg-[#050505] flex flex-col items-center justify-center relative z-20 border-t border-neutral-900">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <p className="text-neutral-500 text-xs mb-8 font-medium tracking-widest uppercase flex items-center gap-3">
              <ArrowRight size={14} className="text-neutral-600" />
              Throw the scroll
              <ArrowRight size={14} className="text-neutral-600 rotate-180" />
            </p>
            <div 
              ref={constraintsRef} 
              className="w-64 sm:w-96 h-2 bg-neutral-900 rounded-full relative shadow-inner"
            >
              <motion.div
                className="w-16 h-4 bg-white rounded-full cursor-grab active:cursor-grabbing absolute top-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                drag="x"
                dragConstraints={constraintsRef}
                dragElastic={0.7}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 12 }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              />
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-neutral-500 text-sm bg-black relative z-10 border-t border-neutral-900">
          <p>&copy; 2026 Modern Scroll. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
