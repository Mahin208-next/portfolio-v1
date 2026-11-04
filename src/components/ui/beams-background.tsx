"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
    className?: string;
    children?: React.ReactNode;
    intensity?: "subtle" | "medium" | "strong";
    darkMode?: boolean;
}

interface Beam {
    x: number;
    y: number;
    width: number;
    length: number;
    angle: number;
    speed: number;
    opacity: number;
    hue: number;
    pulse: number;
    pulseSpeed: number;
}

function createBeam(width: number, height: number, isDark: boolean): Beam {
    const angle = -35 + Math.random() * 10;
    // Spread of hues: cyan (190-220), violet/purple (260-280), amber/gold (35-50)
    const hueSeed = Math.random();
    let hue = 195 + Math.random() * 45; // cyan-blue default
    if (hueSeed > 0.7) {
        hue = 265 + Math.random() * 40; // purple-indigo
    } else if (hueSeed < 0.2) {
        hue = 38 + Math.random() * 25; // warm amber
    }

    return {
        x: Math.random() * width * 1.5 - width * 0.25,
        y: Math.random() * height * 1.5 - height * 0.25,
        width: 35 + Math.random() * 70,
        length: height * 2.4,
        angle: angle,
        speed: 0.5 + Math.random() * 0.9,
        opacity: isDark ? (0.16 + Math.random() * 0.18) : (0.28 + Math.random() * 0.25),
        hue: hue,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.025,
    };
}

export function BeamsBackground({
    className,
    children,
    intensity = "strong",
    darkMode: propDarkMode,
}: AnimatedGradientBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const beamsRef = useRef<Beam[]>([]);
    const animationFrameRef = useRef<number>(0);
    const isDarkRef = useRef<boolean>(true);
    const [, forceUpdate] = useState({});
    const MINIMUM_BEAMS = 22;

    const opacityMap = {
        subtle: 0.7,
        medium: 0.85,
        strong: 1,
    };

    // Keep track of dark mode state
    useEffect(() => {
        const updateTheme = () => {
            const hasDarkClass = document.documentElement.classList.contains("dark");
            const isDark = propDarkMode !== undefined ? propDarkMode : hasDarkClass;
            isDarkRef.current = isDark;
            forceUpdate({});
        };

        updateTheme();

        const observer = new MutationObserver(() => {
            updateTheme();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, [propDarkMode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const updateCanvasSize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            const totalBeams = Math.floor(MINIMUM_BEAMS * 1.4);
            beamsRef.current = Array.from({ length: totalBeams }, () =>
                createBeam(window.innerWidth, window.innerHeight, isDarkRef.current)
            );
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        function resetBeam(beam: Beam, index: number, totalBeams: number) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const column = index % 3;
            const spacing = width / 3;

            beam.y = height + 100;
            beam.x =
                column * spacing +
                spacing / 2 +
                (Math.random() - 0.5) * spacing * 0.6;
            beam.width = 80 + Math.random() * 90;
            beam.speed = 0.45 + Math.random() * 0.45;
            
            const hueSeed = Math.random();
            if (hueSeed > 0.7) {
                beam.hue = 265 + Math.random() * 40;
            } else if (hueSeed < 0.2) {
                beam.hue = 38 + Math.random() * 25;
            } else {
                beam.hue = 195 + (index * 55) / totalBeams;
            }

            beam.opacity = isDarkRef.current
                ? (0.16 + Math.random() * 0.18)
                : (0.28 + Math.random() * 0.24);

            return beam;
        }

        function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
            const isDark = isDarkRef.current;
            ctx.save();
            ctx.translate(beam.x, beam.y);
            ctx.rotate((beam.angle * Math.PI) / 180);

            // Calculate pulsing opacity
            const pulsingOpacity =
                beam.opacity *
                (0.85 + Math.sin(beam.pulse) * 0.25) *
                opacityMap[intensity];

            const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

            // Light vs Dark color stops
            // In light mode: use deep vibrant jewel saturation (80%) and 44-50% lightness so beams are vividly visible on light background!
            // In dark mode: use 65% lightness for luminous neon glow!
            const sat = isDark ? "88%" : "82%";
            const light = isDark ? "64%" : "48%";

            gradient.addColorStop(0, `hsla(${beam.hue}, ${sat}, ${light}, 0)`);
            gradient.addColorStop(
                0.15,
                `hsla(${beam.hue}, ${sat}, ${light}, ${pulsingOpacity * 0.45})`
            );
            gradient.addColorStop(
                0.45,
                `hsla(${beam.hue}, ${sat}, ${light}, ${pulsingOpacity})`
            );
            gradient.addColorStop(
                0.65,
                `hsla(${beam.hue}, ${sat}, ${light}, ${pulsingOpacity})`
            );
            gradient.addColorStop(
                0.88,
                `hsla(${beam.hue}, ${sat}, ${light}, ${pulsingOpacity * 0.45})`
            );
            gradient.addColorStop(1, `hsla(${beam.hue}, ${sat}, ${light}, 0)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
            ctx.restore();
        }

        function animate() {
            if (!canvas || !ctx) return;

            // Clear transparently
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            const totalBeams = beamsRef.current.length;
            for (let i = 0; i < totalBeams; i++) {
                const beam = beamsRef.current[i];
                beam.y -= beam.speed;
                beam.pulse += beam.pulseSpeed;

                if (beam.y + beam.length < -100) {
                    resetBeam(beam, i, totalBeams);
                }

                drawBeam(ctx, beam);
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [intensity]);

    return (
        <div
            className={cn(
                "relative min-h-screen w-full bg-slate-50 dark:bg-neutral-950 transition-colors duration-300",
                className
            )}
        >
            {/* Canvas with hardware-accelerated CSS blur (smooth 60-120 FPS, no CPU canvas filter hitching) */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    filter: "blur(20px)",
                    WebkitFilter: "blur(20px)",
                    willChange: "transform",
                }}
            />

            {children ? (
                <div className="relative z-10 w-full min-h-screen">{children}</div>
            ) : null}
        </div>
    );
}
