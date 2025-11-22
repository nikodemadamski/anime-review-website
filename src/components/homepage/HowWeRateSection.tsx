'use client';

import { Container } from '@/components/ui';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, Music, BookOpen, Users } from 'lucide-react';

interface CategoryExplanation {
  category: 'Visual' | 'Music' | 'Story' | 'Character';
  color: string;
  icon: any;
  description: string;
  gradient: string;
}

const categories: CategoryExplanation[] = [
  {
    category: 'Visual',
    color: '#EC4899',
    icon: Eye,
    description: 'Animation quality, art style, and visual effects',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    category: 'Music',
    color: '#8B5CF6',
    icon: Music,
    description: 'Opening/ending themes, soundtrack, and audio design',
    gradient: 'from-violet-500 to-purple-500'
  },
  {
    category: 'Story',
    color: '#06B6D4',
    icon: BookOpen,
    description: 'Plot development, pacing, and narrative structure',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    category: 'Character',
    color: '#F59E0B',
    icon: Users,
    description: 'Character development, design, and relationships',
    gradient: 'from-amber-500 to-orange-500'
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function HowWeRateSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <Container size="xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative inline-block mb-4"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              How We Rate <span className="text-gradient">Anime</span>
            </h2>

            {/* Decorative Hat (Kept for brand consistency but modernized) */}
            <motion.div
              initial={{ y: -50, opacity: 0, rotate: -180 }}
              whileInView={{ y: -25, opacity: 1, rotate: 15 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -top-6 -right-8 w-16 h-16 hidden md:block"
            >
              <Image
                src="/logo-light.png"
                alt="Logo"
                width={64}
                height={64}
                className="drop-shadow-lg"
              />
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            We don't just give a score. We break it down into the four pillars that define a masterpiece.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.category}
              variants={item}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative p-1 rounded-3xl bg-gradient-to-br from-black/5 to-black/0 dark:from-white/10 dark:to-white/5 hover:from-black/10 hover:to-black/5 dark:hover:from-white/20 dark:hover:to-white/10 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl"
                style={{ backgroundImage: `linear-gradient(to bottom right, ${cat.color}, transparent)` }} />

              <div className="relative h-full glass-panel rounded-[20px] p-6 flex flex-col items-center text-center overflow-hidden">
                {/* Background Gradient Blob */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br ${cat.gradient} opacity-20 blur-3xl rounded-full group-hover:opacity-40 transition-opacity duration-500`} />

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  {cat.category}
                </h3>

                <p className="text-muted text-sm leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
