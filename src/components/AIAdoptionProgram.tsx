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

export default function AIAdoptionProgram() {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Calculate which stage should be active based on scroll position
      const stageHeight = containerHeight / stages.length;
      const relativeScroll = scrollPosition - containerTop;
      const stageIndex = Math.min(
        Math.max(0, Math.floor(relativeScroll / stageHeight)),
        stages.length - 1
      );

      setActiveStage(stageIndex + 1);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <section 
      ref={containerRef}
      className="py-24 bg-white"
      id="ai-adoption-process"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">
            Our 5-Stage AI Adoption <span style={{ color: '#595F39' }}>Process</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-900 max-w-3xl mx-auto font-light">
            A proven roadmap to transform your business with AI. Get it in 10 seconds, 
            expand each stage to explore our comprehensive approach.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
            <span className="text-sm font-medium text-gray-600">
              {activeStage}/5
            </span>
            <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${(activeStage / 5) * 100}%`,
                  backgroundColor: '#595F39'
                }}
              />
            </div>
          </div>
        </div>

        {/* Folder Stack */}
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const isActive = activeStage === stage.id;
            const isExpanded = isActive;
            
            return (
              <div
                key={stage.id}
                className={`
                  relative transition-all duration-500 ease-out
                  ${isExpanded ? 'z-10' : 'z-0'}
                `}
                style={{
                  transform: isExpanded 
                    ? 'scale(1.02)' 
                    : `scale(${1 - (stages.length - index) * 0.02})`,
                }}
              >
                {/* Folder */}
                <div
                  className={`
                    relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ease-out
                    ${isExpanded 
                      ? 'bg-white border-gray-200 shadow-xl' 
                      : 'bg-gray-50 border-gray-200 shadow-sm hover:shadow-md'
                    }
                  `}
                >
                  {/* Folder Header */}
                  <div
                    className={`
                      px-8 py-6 cursor-pointer transition-all duration-300 ease-out
                      ${isExpanded ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}
                    `}
                    onClick={() => setActiveStage(stage.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Stage Number */}
                        <div
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300
                            ${isExpanded 
                              ? 'text-white' 
                              : 'bg-gray-200 text-gray-600'
                            }
                          `}
                          style={{
                            backgroundColor: isExpanded ? '#595F39' : undefined
                          }}
                        >
                          {stage.id}
                        </div>
                        
                        {/* Stage Label */}
                        <div>
                          <h3 className={`
                            text-2xl sm:text-3xl font-medium transition-colors duration-300
                            ${isExpanded ? 'text-gray-900' : 'text-gray-900'}
                          `}>
                            {stage.label}
                          </h3>
                          <p className={`
                            text-sm transition-colors duration-300 mt-1 font-light
                            ${isExpanded ? 'text-gray-600' : 'text-gray-500'}
                          `}>
                            {stage.purpose}
                          </p>
                        </div>
                      </div>

                      {/* Timeline Badge */}
                      <div className="flex items-center space-x-3">
                        <span 
                          className="px-3 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: '#9C8B5E20',
                            color: '#9C8B5E'
                          }}
                        >
                          {stage.timeline}
                        </span>
                        
                        {/* Expand/Collapse Indicator */}
                        <div
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                            ${isExpanded ? 'text-white' : 'bg-gray-200 text-gray-500'}
                          `}
                          style={{
                            backgroundColor: isExpanded ? '#595F39' : undefined
                          }}
                        >
                          <svg
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : 'rotate-0'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Folder Content */}
                  <div
                    className={`
                      overflow-hidden transition-all duration-500 ease-out
                      ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
                    <div className="px-8 pb-8">
                      {/* We Do Section */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide flex items-center">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#595F39' }} />
                          We Do
                        </h4>
                        <div className="space-y-2">
                          {stage.weDo.map((item, itemIndex) => (
                            <p key={itemIndex} className="text-gray-900 text-sm leading-relaxed font-light">
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* You Get Section */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide flex items-center">
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

                      {/* Success Looks Like Section */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide flex items-center">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#595F39' }} />
                          Success Looks Like
                        </h4>
                        <p className="text-gray-900 text-sm leading-relaxed font-light">
                          {stage.successLooksLike}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6 font-light">
            Ready to start your AI transformation journey?
          </p>
          <a
            href="#book-call"
            className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-colors duration-200"
            style={{ backgroundColor: '#595F39' }}
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
}
