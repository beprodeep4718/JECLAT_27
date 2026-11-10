import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { ScrollEffects } from "@/components/ScrollEffects";
import { Events } from "@/components/sections/Events";
import { Lineup } from "@/components/sections/Lineup";
import { Passes } from "@/components/sections/Passes";
import { Rewind } from "@/components/sections/Rewind";
import { Theme } from "@/components/sections/Theme";
import { Ticker } from "@/components/sections/Ticker";
import { Verses } from "@/components/sections/Verses";
import { Visit } from "@/components/sections/Visit";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Theme />
        <Verses />
        <Lineup />
        <Events />
        <Passes />
        <Rewind />
        <Visit />
      </main>
      <Footer />
      <ScrollEffects />
    </>
  );
}
