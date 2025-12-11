import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Pricing } from '@/components/landing/pricing';
import { Testimonials } from '@/components/landing/testimonials';
import { Footer } from '@/components/landing/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TimeFlow - Organize seu tempo, conquiste seus objetivos',
  description: 'A plataforma completa de produtividade que combina gestão de tarefas, técnica Pomodoro, hábitos e gamificação para você alcançar mais.',
  keywords: ['produtividade', 'gestão de tarefas', 'pomodoro', 'hábitos', 'gamificação', 'timeflow'],
  authors: [{ name: 'TimeFlow Team' }],
  openGraph: {
    title: 'TimeFlow - Organize seu tempo, conquiste seus objetivos',
    description: 'A plataforma completa de produtividade que combina gestão de tarefas, técnica Pomodoro, hábitos e gamificação.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'TimeFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeFlow - Organize seu tempo, conquiste seus objetivos',
    description: 'A plataforma completa de produtividade que combina gestão de tarefas, técnica Pomodoro, hábitos e gamificação.',
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <Footer />
    </main>
  );
}
