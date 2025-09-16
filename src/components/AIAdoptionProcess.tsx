'use client';

import { useState, useEffect, useRef } from 'react';

interface Stage {
  id: number;
  label: string;
  purpose: string;
  weDo: string[];
  youGet: string[];
  successLooksLike: string;
  timeline: string;
}

const stages: Stage[] = [
  {
    id: 1,
    label: 'Diagnose',
    purpose: 'Understand AI maturity, risks, and opportunities; align on where to start.',
    weDo: ['Company survey & interviews', 'Infra/data/governance review', 'Risk workshop'],
    youGet: ['AI Readiness Report', 'Current State Analysis', 'Risk & Limitations Register', 'SWOT', 'Roadmap'],
    successLooksLike: 'Clear priority roadmap, known risks with owners, baseline for adoption/ROI.',
    timeline: '~4 weeks'
  },
  {
    id: 2,
    label: 'Enable',
    purpose: 'Build AI-native culture: train champions while leadership sets guardrails.',
    weDo: [
      'Ambassadors: Selection & onboarding; weekly training; use-case discovery; prompt library; Agent/MCP requirements',
      'Leadership: Strategy workshops; performance integration; governance, incentives & ethics; comms & budget'
    ],
    youGet: ['Trained ambassadors', 'Use-case inventory', 'Prompt library', 'Agent/MCP specs', 'Governance & ethics framework', 'Incentive program'],
    successLooksLike: 'Active champions, formal guardrails, validated backlog ready for Pilot.',
    timeline: '~6–8 weeks'
  },
  {
    id: 3,
    label: 'Pilot',
    purpose: 'Ship a scoped V1, test with real users, iterate fast.',
    weDo: ['Design/build/train chatbot', 'Create test cases & training data', 'Controlled pilot', 'Accuracy & relevance testing', 'Feedback loops'],
    youGet: ['V1 chatbot', 'Test results & metrics', 'User feedback analysis', 'Use-case validation report', 'Rollout plan'],
    successLooksLike: 'Measurable accuracy/satisfaction, signed-off plan for org-wide rollout.',
    timeline: '~8–9 weeks'
  },
  {
    id: 4,
    label: 'Deploy',
    purpose: 'Scale the refined chatbot and playbook across teams with training and showcases.',
    weDo: ['Finalize chatbot & AI Playbook', 'Org-wide training', 'Showcases & forums', 'Department roll-ins', 'Adoption monitoring'],
    youGet: ['AI Playbook', 'Fully deployed chatbot', 'Training records', 'Use-case repository', 'Adoption dashboard', 'Dept guides'],
    successLooksLike: 'Teams using the chatbot daily, playbook adopted, adoption trending up.',
    timeline: '~8 weeks'
  },
  {
    id: 5,
    label: 'Evolve',
    purpose: 'Make AI improvement a habit: review monthly, add use cases, track ROI.',
    weDo: ['Monthly check-ins', 'Emerging tech evaluation', 'Performance monitoring', 'Advanced training', 'New use cases', 'ROI assessment'],
    youGet: ['Monthly status reports', 'Emerging tech briefs', 'Continuous improvement recs', 'Updated roadmap', 'Quarterly ROI analysis'],
    successLooksLike: 'Steady capability gains, responsible adoption, clear ROI to leadership.',
    timeline: 'Ongoing (monthly/quarterly)'
  }
];

export default function AIAdoptionProcess() {
  const [activeStage, setActiveStage] = useState<number>(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      if (!sectionRef.current || !contentRef.current) return;

      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Adjust scroll zone - start horizontal scroll when section is more in view
      const sectionStart = sectionTop - (windowHeight * 0.3); // Start when section is 30% in view
      const sectionEnd = sectionTop + sectionHeight - (windowHeight * 0.2); // End when section is 20% from bottom
      
      if (scrollY >= sectionStart && scrollY <= sectionEnd) {
        // Calculate progress through the section
        const progress = (scrollY - sectionStart) / (sectionEnd - sectionStart);
        const clampedProgress = Math.max(0, Math.min(1, progress));
        
        // Update active stage
        const stageIndex = Math.floor(clampedProgress * stages.length);
        const newActiveStage = Math.min(stageIndex + 1, stages.length);
        setActiveStage(newActiveStage);
        
        // Update horizontal scroll position
        const maxScroll = contentRef.current.scrollWidth - contentRef.current.clientWidth;
        const targetScroll = clampedProgress * maxScroll;
        
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
          if (contentRef.current) {
            contentRef.current.scrollLeft = targetScroll;
          }
        });
      }
      
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStage = (stageId: number) => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const sectionTop = section.offsetTop;
    const windowHeight = window.innerHeight;
    const sectionStart = sectionTop - (windowHeight * 0.3);
    const sectionEnd = sectionTop + section.offsetHeight - (windowHeight * 0.2);
    
    const progress = (stageId - 1) / (stages.length - 1);
    const targetScrollY = sectionStart + (progress * (sectionEnd - sectionStart));
    
    // Temporarily disable smooth scrolling for this action
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, targetScrollY);
    
    // Re-enable smooth scrolling after a short delay
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 100);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-white relative"
      id="ai-adoption-process"
      style={{ height: `${stages.length * 80}vh` }} // Reduced from 100vh to 80vh for tighter spacing
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="w-full">
          {/* Header */}
          <div className="text-center mb-16 px-6">
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">
              Our 5-Stage AI Adoption <span style={{ color: '#595F39' }}>Process</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-900 max-w-4xl mx-auto font-light">
              A proven roadmap to transform your business with AI. Get it in 10 seconds, 
              explore each stage to discover our comprehensive approach.
            </p>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            {/* Progress */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-6 py-3">
                <span className="text-sm font-medium text-gray-600">
                  Stage {activeStage} of 5
                </span>
                <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(activeStage / 5) * 100}%`,
                      backgroundColor: '#595F39'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Timeline Nodes */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-8">
                {stages.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => scrollToStage(stage.id)}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300
                        ${activeStage === stage.id ? 'scale-110 shadow-lg' : 'hover:scale-105'}
                      `}
                      style={{
                        backgroundColor: activeStage === stage.id ? '#595F39' : '#E5E7EB',
                        color: activeStage === stage.id ? 'white' : '#6B7280'
                      }}
                    >
                      {stage.id}
                    </div>
                    <span className={`
                      mt-3 text-sm font-medium transition-colors duration-300
                      ${activeStage === stage.id ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'}
                    `}>
                      {stage.label}
                    </span>
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-full mt-1"
                      style={{
                        backgroundColor: activeStage === stage.id ? '#595F39' : '#9C8B5E',
                        color: 'white',
                        opacity: activeStage === stage.id ? 1 : 0.8
                      }}
                    >
                      {stage.timeline}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative">
            <div 
              ref={contentRef}
              className="flex overflow-x-auto scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                scrollBehavior: 'auto' // Override global smooth scrolling
              }}
            >
              {stages.map((stage) => (
                <div 
                  key={stage.id}
                  className="w-full flex-shrink-0 px-6 pb-8" // Reduced pb from 20 to 8
                >
                  <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                      {/* Left Side */}
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-3xl font-medium text-gray-900 mb-4">
                            {stage.label}
                          </h3>
                          <p className="text-lg text-gray-600 font-light leading-relaxed">
                            {stage.purpose}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                              Timeline
                            </span>
                            <span 
                              className="px-3 py-1 text-sm font-medium rounded-full"
                              style={{
                                backgroundColor: '#9C8B5E',
                                color: 'white'
                              }}
                            >
                              {stage.timeline}
                            </span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#595F39' }} />
                              <span className="text-sm text-gray-600">
                                {stage.weDo.length} key activities
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#9C8B5E' }} />
                              <span className="text-sm text-gray-600">
                                {stage.youGet.length} deliverables
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="space-y-8">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#595F39' }} />
                            We Do
                          </h4>
                          <div className="space-y-3">
                            {stage.weDo.map((item, itemIndex) => (
                              <p key={itemIndex} className="text-gray-600 leading-relaxed font-light">
                                {item}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#9C8B5E' }} />
                            You Get
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {stage.youGet.map((item, itemIndex) => (
                              <span
                                key={itemIndex}
                                className="px-3 py-1 text-sm rounded-full font-medium"
                                style={{
                                  backgroundColor: '#9C8B5E20',
                                  color: '#9C8B5E'
                                }}
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#595F39' }} />
                            Success Looks Like
                          </h4>
                          <p className="text-gray-600 leading-relaxed font-light">
                            {stage.successLooksLike}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => scrollToStage(stage.id)}
                  className={`
                    w-3 h-3 rounded-full transition-all duration-300
                    ${activeStage === stage.id ? 'scale-125' : 'hover:scale-110'}
                  `}
                  style={{
                    backgroundColor: activeStage === stage.id ? '#595F39' : '#D1D5DB'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA - Fixed at bottom without scroll effect */}
      <div className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6 font-light">
            Ready to start your AI transformation journey?
          </p>
          <a
            href="#book-call"
            className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#595F39' }}
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
}
