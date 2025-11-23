'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';

interface MobileSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export function MobileSheet({ isOpen, onClose, children, title }: MobileSheetProps) {
    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.2}
                        onDragEnd={onDragEnd}
                        className="fixed bottom-0 left-0 right-0 z-[70] bg-background rounded-t-[32px] overflow-hidden md:hidden shadow-2xl border-t border-white/10 max-h-[90vh] flex flex-col"
                    >
                        {/* Drag Handle */}
                        <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing bg-background" onClick={onClose}>
                            <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
                        </div>

                        {/* Header */}
                        {(title) && (
                            <div className="px-6 pb-4 flex items-center justify-between border-b border-border/50">
                                <h2 className="text-lg font-bold tracking-tight">{title}</h2>
                                <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-secondary/10">
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        <div className="overflow-y-auto p-6 pb-safe">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
