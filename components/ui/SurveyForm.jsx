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

    return (
      <div key={q.id} className="mb-6">
        <label className="block font-body text-foreground mb-2">{q.text}{q.required !== false && <span className="text-red-400 ml-1">*</span>}</label>
        {q.type === 'likert' && (
          <div className="flex flex-wrap gap-2">
            {q.options.map((opt, i) => (
              <button type="button" key={i} onClick={() => isExtra ? handleExtraResponse(sectionIdx, q.id, i) : handleResponse(sectionIdx, q.id, i)} className={`px-4 py-2 min-h-[44px] rounded-lg border text-sm ${value === i ? 'bg-accent border-accent text-background' : 'bg-muted border-border text-foreground/80 hover:bg-muted/80'}`}>{opt}</button>
            ))}
          </div>
        )}
        {q.type === 'likert-7' && (
          <div className="flex flex-wrap gap-2">
            {[0,1,2,3,4,5,6].map(num => (
              <button type="button" key={num} onClick={() => isExtra ? handleExtraResponse(sectionIdx, q.id, num) : handleResponse(sectionIdx, q.id, num)} className={`w-11 h-11 rounded-full border text-sm font-mono ${value === num ? 'bg-accent border-accent text-background' : 'bg-muted border-border text-foreground/80 hover:bg-muted/80'}`}>{num+1}</button>
            ))}
          </div>
        )}
        {q.type === 'likert-5' && (
          <div className="flex flex-wrap gap-2">
            {[1,2,3,4,5].map(num => (
              <button type="button" key={num} onClick={() => isExtra ? handleExtraResponse(sectionIdx, q.id, num) : handleResponse(sectionIdx, q.id, num)} className={`w-10 h-10 rounded-full border text-sm font-mono ${value === num ? 'bg-accent border-accent text-background' : 'bg-muted border-border text-foreground/80 hover:bg-muted/80'}`}>{num}</button>
            ))}
          </div>
        )}
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
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
