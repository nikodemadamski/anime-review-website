'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Heart } from 'lucide-react';

interface DynamicIslandProps {
    message?: string;
    isVisible: boolean;
}

export function DynamicIsland({ message, isVisible }: DynamicIslandProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[300px] pointer-events-none flex justify-center">
                    <motion.div
                        initial={{ width: 100, height: 32, opacity: 0, y: -20 }}
                        animate={{ width: 'auto', height: 44, opacity: 1, y: 0 }}
                        exit={{ width: 100, height: 32, opacity: 0, y: -20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="bg-black text-white rounded-full flex items-center justify-center px-4 shadow-2xl"
                    >
                        <div className="flex items-center gap-3 whitespace-nowrap">
                            <div className="p-1 rounded-full bg-green-500/20 text-green-500">
                                <Check className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold">{message || 'Success'}</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
