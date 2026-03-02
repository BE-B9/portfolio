import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Activity, Check } from 'lucide-react';
import joshHeadshot from './assets/banner_photo.png';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const MagneticButton = ({ children, className = '', variant = 'primary', href }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const btn = buttonRef.current;
        if (!btn) return;

        const xTo = gsap.quickTo(btn, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(btn, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
            xTo(x);
            yTo(y);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            btn.removeEventListener('mousemove', handleMouseMove);
            btn.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const baseClasses = "relative overflow-hidden rounded-[2rem] px-8 py-4 font-sans font-medium hover:scale-[1.03] transition-transform duration-300 ease-magnetic group inline-flex items-center gap-2 cursor-pointer";
    const variants = {
        primary: "bg-accent text-primary",
        secondary: "bg-transparent border border-gray-600 text-white hover:border-accent hover:text-accent transition-colors",
        dark: "bg-primary text-background"
    };

    const Element = href ? 'a' : 'button';

    return (
        <Element
            ref={buttonRef}
            href={href}
            className={`${baseClasses} ${variants[variant]} ${className}`}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            <span className="absolute inset-0 z-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-[2rem]"></span>
        </Element>
    );
};

// ==========================================
// SECTIONS
// ==========================================

const TelemetryTypewriter = () => {
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState('');
    const [lineIndex, setLineIndex] = useState(0);

    // Memoize the messages array so it doesn't cause infinite re-renders
    const messages = React.useMemo(() => [
        "> INCOMING CONNECTION: GMAIL API...",
        "> AUTHENTICATING...",
        "> SUCCESS. READING UNREAD THREADS: 4",
        "> THREAD 1: BOOKING INQUIRY DETECTED.",
        "> PARSING DATES: 2026-05-14 TO 2026-05-15.",
        "> PARSING VENUE: THE TRUMAN, KC.",
        "> PARSING OFFER: $5,000 USD GUARANTEE.",
        "> CHECKING AVAILABILITY... [CLEAR]",
        "> INCOMING CONNECTION: G-CALENDAR API...",
        "> DRAFTING EVENT: HOLD - THE TRUMAN.",
        "> CALCULATING AGENT COMMISSION (10%): $500.",
        "> LOGGING TO DATABASE...",
        "> TRANSACTION COMPLETE. AWAITING NEW EVENTS..."
    ], []);

    useEffect(() => {
        if (lineIndex >= messages.length) {
            const timeout = setTimeout(() => {
                setLines([]);
                setCurrentLine('');
                setLineIndex(0);
            }, 1500); // Wait 1.5 seconds before looping
            return () => clearTimeout(timeout);
        }

        const fullText = messages[lineIndex];

        if (currentLine.length < fullText.length) {
            const timeout = setTimeout(() => {
                setCurrentLine(fullText.slice(0, currentLine.length + 1));
            }, Math.random() * 25 + 15); // Fast typing
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setLines(prev => [...prev, fullText]);
                setCurrentLine('');
                setLineIndex(prev => prev + 1);
            }, 400); // Pause between lines
            return () => clearTimeout(timeout);
        }
    }, [currentLine, lineIndex, messages]);

    return (
        <div className="absolute inset-0 bg-[#050508] z-10 p-6 md:p-8 font-mono text-xs md:text-sm text-accent overflow-hidden rounded-[2rem] border border-white/5 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-accent/20 opacity-90 relative z-20 shrink-0">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <div className="tracking-widest uppercase font-bold text-[10px] md:text-xs">Status: Active</div>
            </div>

            <div className="flex-1 overflow-visible flex flex-col justify-end mask-image-bottom relative z-10">
                <div className="space-y-3 pb-2 opacity-90">
                    {lines.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                    {lineIndex < messages.length && (
                        <div className="flex items-center">
                            <span>{currentLine}</span>
                            <span className="w-1.5 h-3.5 bg-accent ml-1 animate-[pulse_0.7s_infinite]"></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DiagnosticShuffler = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.shuffler-card');

            // Initial positions
            gsap.set(cards, {
                y: i => i * 20,
                scale: i => 1 - (i * 0.05),
                opacity: i => 1 - (i * 0.2),
                zIndex: i => cards.length - i
            });

            // Cycle function
            const cycle = () => {
                const firstCard = cards.shift();
                cards.push(firstCard);

                cards.forEach((card, i) => {
                    gsap.to(card, {
                        y: i * 20,
                        scale: 1 - (i * 0.05),
                        opacity: 1 - (i * 0.2),
                        zIndex: cards.length - i,
                        duration: 0.8,
                        ease: "back.out(1.2)"
                    });
                });
            };

            const interval = setInterval(cycle, 2500);
            return () => clearInterval(interval);
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 bg-[#050508] z-10 flex items-center justify-center overflow-hidden rounded-[2rem] border border-white/5">
            <div className="relative w-full max-w-[280px] h-[200px] mt-12 mx-auto">
                <div className="shuffler-card absolute top-0 left-0 right-0 mx-auto w-[90%] bg-dark border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between h-[120px]">
                    <div className="font-mono text-[10px] text-white/50 border-b border-white/10 pb-2 mb-2">TARGET: ORDER 100,000</div>
                    <div className="font-sans text-sm font-bold text-white">Extracting Line Items</div>
                    <div className="font-mono text-accent text-xs mt-2">Processing...</div>
                </div>
                <div className="shuffler-card absolute top-0 left-0 right-0 mx-auto w-[90%] bg-dark border border-accent/40 rounded-2xl p-4 shadow-xl flex flex-col justify-between h-[120px]">
                    <div className="font-mono text-[10px] text-accent/60 border-b border-accent/20 pb-2 mb-2">CROSS-REF: 3PL INVOICE</div>
                    <div className="font-sans text-sm font-bold text-white">Checking Freight Costs</div>
                    <div className="font-mono text-accent text-xs mt-2">Analyzing Rates...</div>
                </div>
                <div className="shuffler-card absolute top-0 left-0 right-0 mx-auto w-[90%] bg-accent text-primary rounded-2xl p-4 shadow-xl flex flex-col justify-between h-[120px]">
                    <div className="font-mono text-[10px] text-primary/70 border-b border-primary/20 pb-2 mb-2">DISCREPANCY DETECTED</div>
                    <div className="font-sans text-sm font-bold text-primary">Overcharge Flagged</div>
                    <div className="font-drama text-xl font-bold mt-1">+$14.50</div>
                </div>
            </div>
            <div className="absolute top-6 left-6 flex items-center gap-3 z-0">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-bold">Diagnostic Shuffler</div>
            </div>
        </div>
    );
};

const CursorScheduler = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // Reset cursor
            gsap.set('.cursor-svg', { x: 200, y: 150, opacity: 0 });
            gsap.set('.sync-btn', { scale: 1, backgroundColor: 'transparent', color: '#C9A84C' }); // assuming accent is roughly this color, using tailwind classes instead where possible
            gsap.set('.data-row', { width: "0%" });

            tl.to('.cursor-svg', { opacity: 1, duration: 0.3 })
                .to('.cursor-svg', { x: 185, y: 28, duration: 1, ease: 'power2.inOut' })
                .to('.cursor-svg', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
                .to('.sync-btn', { backgroundColor: '#C9A84C', color: '#050508', duration: 0.2 }, "-=0.2") // Note: The color logic works best if we toggle classes but inline is fine
                .to('.data-row', { width: "100%", duration: 1.5, stagger: 0.2, ease: 'power2.out' })
                .to('.cursor-svg', { x: 200, y: 150, duration: 1, ease: 'power2.in' })
                .to('.cursor-svg', { opacity: 0, duration: 0.3 })
                .to('.sync-btn', { backgroundColor: 'transparent', color: '#C9A84C', duration: 0.3 }, "+=1");

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 bg-[#050508] z-10 flex flex-col justify-center items-center overflow-hidden rounded-[2rem] border border-white/5 p-8 text-accent">
            <div className="w-full max-w-[260px] bg-dark border border-white/10 rounded-[1.5rem] p-5 relative shadow-2xl overflow-hidden mt-6">
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="font-sans font-bold text-sm text-white">Job Costing</div>
                    <div className="sync-btn font-mono text-[9px] border border-accent/50 rounded-full px-2 py-1 uppercase tracking-wider transition-colors inline-block text-center" style={{ color: '#C9A84C' }}>Sync ADP</div>
                </div>

                <div className="space-y-4 relative z-10">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-full bg-white/5 h-6 rounded-md overflow-hidden flex items-center px-2">
                            <div className="data-row h-1.5 bg-accent rounded-full" style={{ width: '0%' }}></div>
                        </div>
                    ))}
                </div>

                <svg className="cursor-svg absolute top-0 left-0 w-6 h-6 text-white drop-shadow-md z-20" viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="1">
                    <path d="M4 2l16 11-6.5 2 4.5 7.5-3.5 1.5-4.5-7.5-4.5 4z" />
                </svg>
            </div>

            <div className="absolute top-6 left-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/40"></div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-bold">Costing Dashboard Sync</div>
            </div>
        </div>
    );
};

const RpaExtractor = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            gsap.set('.rpa-folder', { opacity: 0.3, x: -10 });
            gsap.set('.rpa-file', { opacity: 0, height: 0, marginTop: 0 });
            // Using a simple state-like approach with text manipulation via GSAP might be tricky, instead we fade text blocks
            gsap.set('.rpa-msg-1', { display: 'inline', opacity: 1 });
            gsap.set('.rpa-msg-2, .rpa-msg-3', { display: 'none', opacity: 0 });

            tl.to('.rpa-folder', { opacity: 1, x: 0, duration: 0.4, stagger: 0.3, ease: 'power2.out' })
                .to('.rpa-msg-1', { display: 'none', opacity: 0, duration: 0 })
                .to('.rpa-msg-2', { display: 'inline', opacity: 1, duration: 0 })
                .to('.rpa-file', { opacity: 1, height: 'auto', marginTop: 8, duration: 0.3, stagger: 0.1, ease: 'power2.out' }, "+=0.3")
                .to('.rpa-folder-icon', { color: '#C9A84C', duration: 0.3, stagger: 0.1 }, "-=0.5")
                .to('.rpa-msg-2', { display: 'none', opacity: 0, duration: 0 }, "+=0.5")
                .to('.rpa-msg-3', { display: 'inline', opacity: 1, duration: 0 })
                .to({}, { duration: 2 }) // pause
                .to('.rpa-folder, .rpa-file', { opacity: 0, duration: 0.4 })
                .to('.rpa-folder-icon', { color: 'rgba(255,255,255,0.4)', duration: 0 })
                .to('.rpa-msg-3', { display: 'none', opacity: 0, duration: 0 });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 bg-[#050508] z-10 flex flex-col overflow-hidden rounded-[2rem] border border-white/5 p-6 md:p-8">
            <div className="font-mono text-[10px] md:text-xs text-accent mb-6 uppercase tracking-widest border-b border-accent/20 pb-4 flex items-center gap-3">
                <span className="animate-pulse w-2 h-2 rounded-full bg-accent inline-block"></span>
                <span className="rpa-msg-1">Connecting to Remote Desktop...</span>
                <span className="rpa-msg-2">Target locked. Extracting files...</span>
                <span className="rpa-msg-3">Extraction complete. Hierarchy preserved.</span>
            </div>

            <div className="flex-1 font-mono text-xs md:text-sm space-y-4 pt-2 overflow-hidden flex flex-col justify-center">
                {[1, 2, 3].map(f => (
                    <div key={f} className="rpa-folder text-white/80 border border-white/5 bg-white/5 p-3 rounded-xl max-w-[280px]">
                        <div className="flex items-center gap-3 font-semibold">
                            <svg className="rpa-folder-icon w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                            Client_00{f}_Tax_Docs
                        </div>
                        <div className="rpa-file pl-8 text-white/50 overflow-hidden flex items-center gap-2 pt-2">
                            <span className="text-accent">↳</span> form_1040_extracted.pdf
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function Navbar() {
    const navRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            ref={navRef}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 rounded-[3rem] px-8 py-4 flex items-center gap-8 ${isScrolled
                ? 'bg-background/80 backdrop-blur-xl border border-primary/10 text-primary shadow-lg'
                : 'bg-transparent text-background/90'
                }`}
        >
            <div className="font-sans font-bold text-xl tracking-tight">JOSH WHITE</div>
            <div className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
                <a href="#about" className="hover:-translate-y-[1px] transition-transform hover:text-accent">About</a>
                <a href="#work" className="hover:-translate-y-[1px] transition-transform hover:text-accent">Work</a>
                <a href="#scout" className="hover:-translate-y-[1px] transition-transform hover:text-accent">Why Scout</a>
            </div>
        </nav>
    );
}

function Hero() {
    const container = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".hero-reveal", {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2
            });

            gsap.to(".hero-bg", {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: container.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            gsap.utils.toArray('.hero-orb').forEach(orb => {
                gsap.to(orb, {
                    x: "random(-100, 100)",
                    y: "random(-100, 100)",
                    scale: "random(0.8, 1.2)",
                    duration: "random(8, 15)",
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    repeatRefresh: true
                });
            });

            gsap.to(".hero-motif-1", {
                rotation: 360,
                duration: 60,
                repeat: -1,
                ease: "none",
                transformOrigin: "center center"
            });

            gsap.to(".hero-motif-2", {
                rotation: -360,
                duration: 90,
                repeat: -1,
                ease: "none",
                transformOrigin: "center center"
            });
        }, container);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={container} className="relative h-[100dvh] w-full overflow-hidden bg-primary flex flex-col justify-end pb-[10dvh] px-6 md:px-12 lg:px-24">
            {/* Textured Background and Accent Orbs */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-primary">
                {/* Accent Orbs */}
                <div className="hero-orb absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-accent/40 blur-[80px] mix-blend-screen"></div>
                <div className="hero-orb absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/30 blur-[100px] mix-blend-screen"></div>
                <div className="hero-orb absolute top-[20%] left-[30%] w-[35vw] h-[35vw] rounded-full bg-accent/40 blur-[90px] mix-blend-screen"></div>

                {/* Rug Texture */}
                <div className="hero-bg absolute inset-[-20%] z-10 opacity-[0.4] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='rugFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05 1' numOctaves='4' stitchTiles='stitch' result='noise'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 2 -1' in='noise' result='highContrast' /%3E%3CfeComposite operator='in' in='highContrast' in2='SourceGraphic' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23rugFilter)'/%3E%3C/svg%3E")`, backgroundSize: '100px 100px' }}></div>

                {/* Heavy Primary to Transparent gradient overlay for bottom fade */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-primary via-primary/80 to-transparent pointer-events-none"></div>
            </div>

            {/* Rotating Geometric Motif */}
            <div className="absolute top-[35%] md:top-[45%] right-[-30%] md:right-[-10%] lg:right-[5%] -translate-y-1/2 w-[110vw] h-[110vw] max-w-[800px] max-h-[800px] md:w-[60vw] md:h-[60vw] opacity-20 md:opacity-30 pointer-events-none z-10 text-accent">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    <g className="hero-motif-1">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 3" />
                        <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="4 2" />
                        <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="0.3" />
                        <line x1="50" y1="2" x2="50" y2="8" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="50" y1="92" x2="50" y2="98" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="2" y1="50" x2="8" y2="50" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="92" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="0.5" />
                    </g>
                    <g className="hero-motif-2">
                        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.3" />
                        <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="8 6" />
                        <line x1="23" y1="23" x2="27" y2="27" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="77" y1="77" x2="73" y2="73" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="23" y1="77" x2="27" y2="73" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="77" y1="23" x2="73" y2="27" stroke="currentColor" strokeWidth="0.5" />
                    </g>
                </svg>
            </div>

            <div className="relative z-10 max-w-4xl text-background">
                <h1 className="leading-[1.1] mb-6 flex flex-col">
                    <span className="hero-reveal block font-sans font-bold text-4xl md:text-5xl lg:text-7xl tracking-tighter text-background/90 uppercase">
                        I Build the Agents
                    </span>
                    <span className="hero-reveal block font-drama italic text-5xl md:text-7xl lg:text-[7rem] text-accent mt-2 tracking-tight pr-4">
                        Other People Are Still Theorizing About.
                    </span>
                </h1>
                <p className="hero-reveal font-mono text-sm md:text-base text-background/70 max-w-xl mb-10 leading-relaxed tracking-wide">
                    Agentic workflows, MCP servers, and intelligent automations that put your business on autopilot so you can focus on what actually matters.
                </p>
                <div className="hero-reveal">
                    <MagneticButton variant="primary" href="#about" className="py-5 px-10 text-lg">
                        About Me <ArrowRight className="w-5 h-5" />
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
}

function About() {
    const container = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".about-reveal", {
                scrollTrigger: {
                    trigger: container.current,
                    start: "top 75%",
                },
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, container);
        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={container} className="relative py-32 px-6 md:px-12 lg:px-24 bg-background text-primary">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 md:gap-24 items-center">
                {/* Image Placeholder */}
                <div className="about-reveal w-full lg:w-2/5 aspect-[3/4] relative rounded-[3rem] overflow-hidden bg-dark">
                    <img src={joshHeadshot} alt="Josh White" className="absolute inset-0 w-full h-full object-cover object-[center_10%] mix-blend-luminosity opacity-80 filter grayscale contrast-125" />
                    <div className="absolute inset-0 bg-primary/10"></div>
                </div>

                {/* Philosophy Copy */}
                <div className="w-full lg:w-3/5">
                    <div className="about-reveal font-mono text-accent uppercase tracking-widest text-xs mb-8">
                        [ Identity & Approach ]
                    </div>

                    <h2 className="about-reveal font-sans text-3xl md:text-5xl font-bold leading-tight tracking-tighter mb-12">
                        Most people see a cool toy. <br />
                        <span className="font-drama italic text-accent font-normal text-4xl md:text-6xl mt-2 block">I see a paradigm shift.</span>
                    </h2>

                    <div className="space-y-6 font-sans text-lg md:text-xl text-primary/80 leading-relaxed max-w-2xl">
                        <p className="about-reveal">
                            I'm Josh White, musician, builder, and AI obsessive based in Duluth, MN. I started pulling apart technology the same way I pull apart songs. Figuring out how everything fits together and then putting it back together in a way that hits harder than before.
                        </p>
                        <p className="about-reveal">
                            When ChatGPT dropped in 2022 I was one of the first people to realize this wasn't just a cool toy. I've been heads down building ever since. Agentic workflows, MCP servers, complex integrations, for businesses that want to move fast and build things that actually matter.
                        </p>
                        <p className="about-reveal">
                            I don't come from a traditional dev background. I come from fintech, live music, and a genuine obsession with what's possible when you put the right tools in the right hands. That's what I bring to every build.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SelectedWork() {
    const container = useRef(null);

    const projects = [
        {
            num: '01',
            title: 'Custom MCP Server',
            subtitle: 'Music Business Automation',
            problem: 'Managing a working musician\'s business means drowning in booking emails, manually adding gigs to a calendar, and calculating agent commissions by hand. It\'s the kind of repetitive admin work that eats hours every week and pulls you away from the actual work.',
            build: 'I designed and deployed a custom MCP server that connects directly to Gmail and Google Calendar. It identifies booking emails automatically, parses out the relevant event data, creates and manages calendar events without any manual input, and calculates agent commissions across any specified date range on demand.',
            outcome: 'Hours of weekly admin reduced to a single conversation. Built for my own music business, which means every design decision came from real pain, not a client brief.',
            image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop'
        },
        {
            num: '02',
            title: '3PL Invoice Audit',
            subtitle: 'Agentic Verification Workflow',
            problem: 'A company suspected they had been overcharged by their 3PL provider but had no way to verify it. They were sitting on 100,000 orders worth of historical data. Manual review was not a realistic option.',
            build: 'I built an agentic workflow that compared all 100,000 orders against every 3PL invoice and flagged every discrepancy across shipping, freight, and consolidation costs. A custom dashboard surfaces billing accuracy in real time. The agent runs weekly, processes new invoices automatically, and can answer questions and generate exportable reports on demand.',
            outcome: '100,000 orders audited automatically. Ongoing invoice overcharge detection running weekly. A manual process that would have taken months became a fully automated system that pays for itself every time it catches a discrepancy.',
            image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1600&auto=format&fit=crop'
        },
        {
            num: '03',
            title: 'Job Costing Dashboard',
            subtitle: 'QuickBooks, ADP & Airtable Integration',
            problem: 'A services company had no visibility into their actual job-level profitability. Labor costs from hourly employees and materials costs were living in separate systems with no way to see margins in real time. They were running blind on every job.',
            build: 'I built a centralized job costing dashboard in Airtable and wired it to their existing stack via Make.com. QuickBooks feeds in financials automatically. ADP syncs labor costs in real time. A custom Jotform app gives field teams a simple mobile interface to log materials costs on the spot.',
            outcome: 'The company went from zero margin visibility to a live, accurate view of profitability on every job. Decision making that used to be guesswork is now data driven.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop'
        },
        {
            num: '04',
            title: 'Custom RPA',
            subtitle: 'File Extraction via Workpapers CS',
            problem: 'An accounting firm needed to migrate away from a deprecated tax document platform inside a locked remote desktop environment. No backend access, no export feature. Over 300 clients, thousands of files to extract perfectly while preserving folder structure.',
            build: 'I developed a custom Python based RPA solution that navigated the remote desktop environment autonomously, extracted every file automatically, and reconstructed the complete folder hierarchy with perfect fidelity. No manual dragging. Just perfectly automated.',
            outcome: '300+ clients migrated. Thousands of files extracted with 100% accuracy. Zero folder structure errors. Handled cleanly and completely without massive manual labor.',
            image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop'
        }
    ];

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.work-card');

            cards.forEach((card, i) => {
                if (i === cards.length - 1) return;

                ScrollTrigger.create({
                    trigger: card,
                    start: "top 5%",
                    endTrigger: container.current,
                    end: "bottom 50%",
                    pin: true,
                    pinSpacing: false,
                });

                gsap.to(card, {
                    scale: 0.9,
                    filter: 'blur(10px)',
                    opacity: 0.4,
                    scrollTrigger: {
                        trigger: cards[i + 1],
                        start: "top 40%",
                        end: "top 5%",
                        scrub: true,
                    }
                });
            });
        }, container);
        return () => ctx.revert();
    }, []);

    return (
        <section id="work" ref={container} className="relative bg-primary pb-32">
            {/* Spacer to give visual breathing room */}
            <div className="pt-32 pb-16 px-6 md:px-12 lg:px-24">
                <h2 className="font-sans text-background text-4xl md:text-6xl tracking-tighter font-bold">
                    Selected Work
                    <span className="block font-drama italic text-accent font-normal mt-2">Functional Artifacts.</span>
                </h2>
            </div>

            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                {projects.map((proj, idx) => (
                    <div key={idx} className="work-card relative w-full min-h-[85vh] bg-dark rounded-[3rem] p-8 md:p-12 lg:p-16 mb-12 shadow-2xl border border-white/5 flex flex-col md:flex-row gap-12 text-background overflow-hidden top-8 md:top-12">

                        {/* Visual Column */}
                        <div className="w-full md:w-1/2 flex flex-col justify-start relative z-10">
                            <div>
                                <div className="font-mono text-accent text-xl mb-4">[{proj.num}]</div>
                                <h3 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mb-2 leading-tight">{proj.title}</h3>
                                <h4 className="font-drama italic text-2xl md:text-3xl text-white/70 mb-10">{proj.subtitle}</h4>
                            </div>

                            {/* Image Placeholder container */}
                            <div className="relative w-full aspect-video md:aspect-square lg:aspect-[4/3] rounded-[2rem] overflow-hidden group">
                                {/* REPLACE SRC WITH PORTFOLIO PIECE */}
                                {idx === 0 && <TelemetryTypewriter />}
                                {idx === 1 && <DiagnosticShuffler />}
                                {idx === 2 && <CursorScheduler />}
                                {idx === 3 && <RpaExtractor />}
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-10 relative z-10 text-lg md:text-xl font-sans text-white/80 leading-relaxed font-light">
                            <div>
                                <h5 className="font-mono text-accent text-xs uppercase tracking-widest mb-3 font-semibold">The Problem</h5>
                                <p>{proj.problem}</p>
                            </div>
                            <div>
                                <h5 className="font-mono text-accent text-xs uppercase tracking-widest mb-3 font-semibold">The Build</h5>
                                <p>{proj.build}</p>
                            </div>
                            <div>
                                <h5 className="font-mono text-accent text-xs uppercase tracking-widest mb-3 font-semibold">The Outcome</h5>
                                <p className="text-white font-medium">{proj.outcome}</p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
}

function WhyScout() {
    const container = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".scout-text", {
                scrollTrigger: {
                    trigger: container.current,
                    start: "top 60%",
                },
                y: 50,
                opacity: 0,
                stagger: 0.15,
                duration: 1.2,
                ease: "power3.out"
            });
        }, container);
        return () => ctx.revert();
    }, []);

    return (
        <section id="scout" ref={container} className="relative py-40 px-6 md:px-12 lg:px-24 bg-background overflow-hidden relative">

            {/* Background graphic motif */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 opacity-5 w-[800px] h-[800px] rounded-full border-[1px] border-primary flex items-center justify-center">
                <div className="w-[600px] h-[600px] rounded-full border-[1px] border-primary"></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10 text-primary">
                <div className="scout-text font-mono text-accent uppercase tracking-widest text-sm mb-12">
                    [ Why Scout ]
                </div>

                <h2 className="scout-text text-4xl md:text-6xl lg:text-7xl font-sans font-bold leading-[1.1] tracking-tighter mb-16">
                    I've been doing AI and automation long enough to know when something is ahead of the curve. <br />
                    <span className="font-drama italic text-accent font-normal mt-4 block">Scout is ahead of the curve.</span>
                </h2>

                <div className="space-y-8 font-sans text-xl md:text-2xl text-primary/80 leading-relaxed max-w-3xl">
                    <p className="scout-text">
                        We're at a tipping point right now where AI agents have crossed from interesting to production ready. Most businesses haven't figured that out yet. Jason has. And he's building in a niche that nobody else is paying attention to, which is exactly where the biggest opportunities live.
                    </p>
                    <p className="scout-text">
                        What gets me about Scout isn't just the technology. It's the vision behind it. Building agents that feel like video games, that people actually want to use, that make a dishwasher's path to GM feel achievable. That's not just automation. That's culture changing work.
                    </p>
                    <p className="scout-text font-semibold text-primary">
                        I want to help build it.
                    </p>
                </div>
            </div>
        </section>
    );
}

function Pricing() {
    const container = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".price-card", {
                scrollTrigger: {
                    trigger: container.current,
                    start: "top 70%",
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });
        }, container);
        return () => ctx.revert();
    }, []);

    return (
        <section id="proposal" ref={container} className="relative py-32 px-6 md:px-12 lg:px-24 bg-primary text-background">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="font-mono text-accent uppercase tracking-widest text-sm mb-6">[ The Proposal ]</div>
                    <h2 className="font-sans text-4xl md:text-5xl font-bold tracking-tight mb-6">Partnership Models</h2>
                    <p className="font-sans text-lg text-white/60">
                        I work at $75 an hour. For an engagement like Scout, where the expectation is full commitment and the goal is to move fast, that adds up quickly. At 10 hours a day, 6 days a week, the hourly math lands around $18,000 a month. I'm proposing something better for both of us.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">

                    {/* Option B: Hourly */}
                    <div className="price-card bg-dark/50 border border-white/10 rounded-[2.5rem] p-10 md:p-12 hover:border-white/20 transition-colors">
                        <h3 className="font-sans font-bold text-2xl mb-2">Hourly Flexibility</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="font-drama italic text-5xl">$75</span>
                            <span className="font-mono text-white/50">/ hr</span>
                        </div>
                        <p className="font-sans text-white/70 mb-8 pt-4 border-t border-white/10">
                            Standard hourly billing through Upwork. Flexible, but unpredictable on both sides as hours scale up.
                        </p>
                        <ul className="space-y-4 font-sans text-white/80">
                            <li className="flex items-center gap-3"><Check className="text-accent w-5 h-5" /> Billed monthly via Upwork</li>
                            <li className="flex items-center gap-3"><Check className="text-accent w-5 h-5" /> Flexible scaling</li>
                            <li className="flex items-center gap-3"><Check className="text-accent w-5 h-5" /> Standard commitment rates</li>
                        </ul>
                    </div>

                    {/* Option A: Monthly (Highlighted) */}
                    <div className="price-card bg-accent text-primary rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden transform md:-translate-y-4">
                        <h3 className="font-sans font-bold text-2xl mb-2">Monthly Retainer</h3>
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="font-drama italic text-4xl text-primary/40 line-through decoration-primary/40">$18k</span>
                            <span className="font-drama italic text-6xl font-bold">$12k</span>
                            <span className="font-mono text-primary/70">/ month</span>
                        </div>
                        <p className="font-sans text-primary/80 mb-8 pt-4 border-t border-primary/20">
                            Discounted from standard hourly in exchange for the stability of a fixed engagement as the product grows.
                        </p>
                        <ul className="space-y-4 font-sans font-medium text-primary mb-2">
                            <li className="flex items-center gap-3"><Check className="text-primary w-5 h-5" /> Full commitment, no clock-watching</li>
                            <li className="flex items-center gap-3"><Check className="text-primary w-5 h-5" /> All in on Scout</li>
                            <li className="flex items-center gap-3"><Check className="text-primary w-5 h-5" /> Billed in monthly milestones</li>
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="bg-[#050508] text-white pt-24 pb-12 px-6 md:px-12 lg:px-24 rounded-t-[4rem] -mt-12 relative z-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-white/10 pb-12 mb-8">
                <div>
                    <h2 className="font-sans font-bold text-3xl tracking-tighter mb-2">Josh White</h2>
                    <p className="font-mono text-white/50 text-sm">Design / Engineering / AI Workflows</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-sans text-white/40 text-sm">
                <p>© {new Date().getFullYear()} Josh White. All rights reserved.</p>
            </div>
        </footer>
    );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
    return (
        <div className="font-sans w-full min-h-screen">
            <Navbar />
            <Hero />
            <About />
            <SelectedWork />
            <WhyScout />
            <Pricing />
            <Footer />
        </div>
    );
}
