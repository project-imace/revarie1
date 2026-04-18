'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SurveyForm({ questions, extraSection, onSubmit, submitLabel = 'Submit', consentRequired = true }) {
  const [responses, setResponses] = useState({});
  const [extraResponses, setExtraResponses] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [consent, setConsent] = useState(!consentRequired);
  const [errors, setErrors] = useState({});

  const allSections = questions?.sections || [];
  const sections = extraSection ? [...allSections, ...(extraSection.sections || [])] : allSections;

  const handleResponse = (sectionIdx, questionId, value) => {
    setResponses(prev => ({ ...prev, [`${sectionIdx}-${questionId}`]: value }));
    setErrors(prev => ({ ...prev, [`${sectionIdx}-${questionId}`]: null }));
  };

  const handleExtraResponse = (sectionIdx, questionId, value) => {
    setExtraResponses(prev => ({ ...prev, [`extra-${sectionIdx}-${questionId}`]: value }));
    setErrors(prev => ({ ...prev, [`extra-${sectionIdx}-${questionId}`]: null }));
  };

  const validateSection = (sectionIdx) => {
    const section = sections[sectionIdx];
    const isExtra = sectionIdx >= allSections.length;
    let isValid = true;
    const newErrors = {};
    section.questions.forEach(q => {
      const key = isExtra ? `extra-${sectionIdx - allSections.length}-${q.id}` : `${sectionIdx}-${q.id}`;
      const value = isExtra ? extraResponses[key] : responses[key];
      if (value === undefined || value === null) {
        newErrors[key] = 'Required';
        isValid = false;
      }
    });
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentSection(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildPayload = () => {
    const main = {};
    allSections.forEach((section, idx) => {
      const sectionData = {};
      section.questions.forEach(q => { sectionData[q.id] = responses[`${idx}-${q.id}`]; });
      main[section.id] = sectionData;
    });
    let godspeed = null;
    if (extraSection) {
      godspeed = {};
      extraSection.sections.forEach((section, idx) => {
        const sectionData = {};
        section.questions.forEach(q => { sectionData[q.id] = extraResponses[`extra-${idx}-${q.id}`]; });
        godspeed[section.id] = sectionData;
      });
    }
    return { main, godspeed };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (consentRequired && !consent) {
      alert('You must acknowledge the consent statement.');
      return;
    }
    if (!validateSection(currentSection)) return;
    onSubmit(buildPayload());
  };

  const renderQuestion = (q, sectionIdx, isExtra) => {
    const key = isExtra ? `extra-${sectionIdx}-${q.id}` : `${sectionIdx}-${q.id}`;
    const value = isExtra ? extraResponses[key] : responses[key];
    const error = errors[key];
    const currentSec = isExtra ? extraSection.sections[sectionIdx] : allSections[sectionIdx];

    return (
      <div key={q.id} className="mb-10">
        {q.type !== 'likert-5' && (
          <label className="block font-body text-foreground mb-4 text-lg">
            {q.text}{q.required !== false && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {q.type === 'likert' && (
          <div className="flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <motion.button
                type="button"
                key={i}
                onClick={() => isExtra ? handleExtraResponse(sectionIdx, q.id, i) : handleResponse(sectionIdx, q.id, i)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                animate={{
                  boxShadow: value === i ? '0 0 15px rgba(255,255,255,0.4)' : 'none'
                }}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-colors duration-300 ${value === i ? 'bg-foreground border-foreground text-background font-medium' : 'bg-muted border-border text-foreground/80 hover:bg-muted/80'}`}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        )}

        {q.type === 'likert-7' && (
          <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
            <div className="flex justify-between w-full">
              {[0,1,2,3,4,5,6].map(num => (
                <motion.button
                  type="button"
                  key={num}
                  onClick={() => isExtra ? handleExtraResponse(sectionIdx, q.id, num) : handleResponse(sectionIdx, q.id, num)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: value === num ? '0 0 15px rgba(255,255,255,0.4)' : 'none'
                  }}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full border text-lg font-mono transition-colors duration-300 ${value === num ? 'bg-foreground border-foreground text-background font-bold' : 'bg-muted border-border text-foreground/80 hover:bg-muted/80'}`}
                >
                  {num+1}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between text-xs font-mono text-foreground/60 mt-2 px-1">
              <span>{currentSec?.minLabel || "Strongly Disagree"}</span>
              <span>{currentSec?.maxLabel || "Strongly Agree"}</span>
            </div>
          </div>
        )}

        {q.type === 'likert-5' && (
          <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto py-2">
            <div className="flex justify-between text-sm md:text-base font-body text-foreground px-2">
              <span className="text-left w-1/3">{q.text.split('—')[0]?.trim() || q.text.split('-')[0]?.trim()}</span>
              <span className="text-right w-1/3">{q.text.split('—')[1]?.trim() || q.text.split('-')[1]?.trim()}</span>
            </div>
            <div className="flex justify-between w-full px-4">
              {[1,2,3,4,5].map(num => (
                <motion.button
                  type="button"
                  key={num}
                  onClick={() => isExtra ? handleExtraResponse(sectionIdx, q.id, num) : handleResponse(sectionIdx, q.id, num)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    boxShadow: value === num ? '0 0 15px rgba(255,255,255,0.4)' : 'none'
                  }}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full border text-base font-mono transition-colors duration-300 ${value === num ? 'bg-foreground border-foreground text-background font-bold' : 'bg-muted border-border text-foreground/80 hover:bg-muted/80'}`}
                >
                  {num}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    );
  };

  if (!sections.length) return <p className="text-foreground/60">Loading survey...</p>;

  const current = sections[currentSection];
  const isLast = currentSection === sections.length - 1;
  const isExtra = currentSection >= allSections.length;

  return (
    <form onSubmit={handleSubmit}>
      {consentRequired && (
        <div className="border border-border rounded-xl p-4 mb-6 bg-muted/30">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-accent" />
            <span className="text-sm text-foreground/70">I acknowledge that my participation in the PsyCoSys Synapsys: Chapter Revarie LM v1 survey is voluntary. I understand that I am part of an academic study under Revarie LM and Project IMACE, and that my psychometric data will be collected for research purposes only. My responses will remain confidential. I may withdraw at any time. By selecting "Yes," I consent to the use of my anonymized data for academic publication.</span>
          </label>
        </div>
      )}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2"><span className="font-mono text-xs text-foreground/40">Section {currentSection+1} of {sections.length}</span><div className="flex-1 h-px bg-border" /></div>
        <h2 className="font-mono text-xl text-foreground">{current.title}</h2>
        {current.instructions && <p className="text-sm text-foreground/60 mt-2 italic">{current.instructions}</p>}
      </div>
      <div className="space-y-2">
        {current.questions.map(q => renderQuestion(q, isExtra ? currentSection - allSections.length : currentSection, isExtra))}
      </div>
      <div className="flex justify-between pt-6 border-t border-border">
        <button type="button" onClick={handlePrevious} disabled={currentSection === 0} className="px-6 py-2 bg-muted border border-border rounded-lg text-foreground font-mono disabled:opacity-30">Previous</button>
        {isLast ? (
          <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="px-8 py-2 bg-foreground text-background font-mono rounded-lg hover:bg-foreground/90">{submitLabel}</motion.button>
        ) : (
          <button type="button" onClick={handleNext} className="px-6 py-2 bg-foreground text-background font-mono rounded-lg hover:bg-foreground/90">Next</button>
        )}
      </div>
    </form>
  );
}
