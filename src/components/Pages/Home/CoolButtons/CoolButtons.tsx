import React, { useState } from 'react';
import './CoolButtons.css';

const sections = [
  { id: 0, category: 'Reduction' },
  { id: 1, category: 'Essence' },
  { id: 2, category: 'Space' },
  { id: 3, category: 'Resonance' },
  { id: 4, category: 'Truth' },
  { id: 5, category: 'Feeling' },
  { id: 6, category: 'Clarity' },
  { id: 7, category: 'Emptiness' },
  { id: 8, category: 'Awareness' },
  { id: 9, category: 'Minimalism' }
];

interface CoolButtonsProps {
  onSelect?: (sectionId: number) => void;
}

const CoolButtons: React.FC<CoolButtonsProps> = ({ onSelect }) => {
  const [currentSection, setCurrentSection] = useState(0);

  const handleClick = (id: number) => {
    setCurrentSection(id);
    if (onSelect) onSelect(id); // <<< вот это единственное добавление!
  };

  return (
    <div className="CoolButtons">
      <div className="right-column">
        {sections.map(section => (
          <div
            key={section.id}
            className={`category ${section.id === currentSection ? 'active' : ''} loaded`}
            onClick={() => handleClick(section.id)}
          >
            {section.category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoolButtons;
