import React, { useState } from "react";
import Header from './components/Header'
import AuthModal from '../Auth/AuthModal'
import Hero from './components/Hero'
import Features from './components/Features'
import LatestJobs from './components/LatestJobs'
import Footer from './components/Footer'
import Newsletter from './components/Newsletter'
import Testimonials from '../../components/layout/Testimonials'
import Counter from './components/Counter'
import ScrollToTopButton from './components/ScrollTop'



function LandingPage() {
  // const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className='min-h-screen '>
      {/* <Header openAuth={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} /> */}
      <Hero />
      <Features />
      <LatestJobs />
      <Testimonials />
      <Counter />
      <Newsletter />
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}

export default LandingPage      