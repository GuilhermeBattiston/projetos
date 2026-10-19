import { useState } from "react";
import Header from "./components/Header.tsx";
import Hero from "./components/Hero.tsx";
import Environments from "./components/Environments.tsx";
import Gallery from "./components/Gallery.tsx";
import Briefing from "./components/Briefing.tsx";
import {
  Solutions,
  About,
  Contact,
  Footer,
} from "./components/Information.tsx";
import { initialBriefing } from "./utils/briefing.ts";
import type { BriefingValues } from "./utils/briefing.ts";
export default function App() {
  const [values, setValues] = useState<BriefingValues>({ ...initialBriefing });
  const [step, setStep] = useState(0);
  const choose = (environment: string) => {
    setValues({ ...values, environment });
    setStep(0);
  };
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Environments onChoose={choose} />
        <Solutions />
        <Gallery />
        <Briefing
          values={values}
          setValues={setValues}
          step={step}
          setStep={setStep}
        />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
