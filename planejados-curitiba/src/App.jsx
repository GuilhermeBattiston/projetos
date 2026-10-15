import { useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import KitchenStory from "./components/KitchenStory.jsx";
import Gallery from "./components/Gallery.jsx";
import Process from "./components/Process.jsx";
import PreferenceWizard from "./components/PreferenceWizard.jsx";
import { CompanyContact, Footer } from "./components/CompanyContact.jsx";
import { initialPreferences } from "./utils/preferences.js";
export default function App() {
  const [preferences, setPreferences] = useState({ ...initialPreferences });
  const [step, setStep] = useState(0);
  const choose = (item) => {
    setPreferences({ ...preferences, layout: item.layout, style: item.style });
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
        <KitchenStory />
        <Gallery onChoose={choose} />
        <Process />
        <PreferenceWizard
          values={preferences}
          setValues={setPreferences}
          step={step}
          setStep={setStep}
        />
        <CompanyContact />
      </main>
      <Footer />
    </>
  );
}
