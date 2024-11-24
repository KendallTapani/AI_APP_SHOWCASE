import {
  features,
  navigation,
  faqs,
  footerNavigation,
  testimonials
} from './contentSections';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <div className='bg-white dark:text-white dark:bg-boxdark-2'>
      <Header navigation={navigation} />

      <main className='isolate dark:bg-boxdark-2'>
        <Hero />
        <Features features={features} />
        <Testimonials testimonials={testimonials} />
        <FAQ faqs={faqs} />
      </main>

      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}
