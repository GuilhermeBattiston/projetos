import { useState } from "react";
import Header from "./components/Header.tsx";
import {
  Hero,
  Environments,
  Furniture,
  Details,
  About,
  Contact,
  Footer,
} from "./components/Sections.tsx";
import Gallery from "./components/Gallery.tsx";
import Briefing from "./components/Briefing.tsx";
import { initialValues } from "./utils/briefing.ts";
export default function App() {
  const [values, setValues] = useState(initialValues);
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
        <Gallery onChoose={choose} />
        <Furniture />
        <Details />
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
