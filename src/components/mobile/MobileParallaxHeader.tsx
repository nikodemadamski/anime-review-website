'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface MobileParallaxHeaderProps {
    image: string;
    title: string;
}

export function MobileParallaxHeader({ image, title }: MobileParallaxHeaderProps) {
    const { scrollY } = useScroll();

    const y = useTransform(scrollY, [0, 300], [0, 150]);
    const scale = useTransform(scrollY, [0, 300], [1, 1.1]);
    const opacity = useTransform(scrollY, [0, 200], [1, 0]);
    const blur = useTransform(scrollY, [0, 300], [0, 10]);

    return (
        <div className="relative h-[45vh] w-full overflow-hidden md:hidden">
            <motion.div
                style={{ y, scale, filter: `blur(${blur}px)` }}
                className="absolute inset-0 w-full h-full"
            >
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
            </motion.div>

            <Link
                href="/browse"
                className="absolute top-4 left-4 p-2 rounded-full bg-black/20 backdrop-blur-md text-white z-50 border border-white/10 active:scale-90 transition-transform"
            >
                <ArrowLeft className="w-6 h-6" />
            </Link>
        </div>
    );
}
