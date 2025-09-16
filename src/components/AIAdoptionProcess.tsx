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
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

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
    if (!isVisible || !timelineRef.current) return;

    const handleScroll = () => {
      if (!timelineRef.current || !containerRef.current) return;

      const container = containerRef.current;
      const timeline = timelineRef.current;
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress within the section
      const sectionStart = containerTop - windowHeight;
      const sectionEnd = containerTop + containerHeight;
      const scrollProgress = Math.max(0, Math.min(1, (scrollPosition - sectionStart) / (sectionEnd - sectionStart)));
      
      // Calculate which stage should be active based on scroll progress
      const stageIndex = Math.min(Math.floor(scrollProgress * stages.length), stages.length - 1);
      const newActiveStage = stageIndex + 1;
      
      if (newActiveStage !== activeStage) {
        setActiveStage(newActiveStage);
      }

      // Horizontal scroll effect - translate the timeline
      const maxTranslate = timeline.scrollWidth - window.innerWidth;
      const translateX = scrollProgress * maxTranslate;
      timeline.style.transform = `translateX(-${translateX}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, activeStage]);

  return (
    <section 
      ref={containerRef}
      className="py-24 bg-white relative"
      id="ai-adoption-process"
      style={{ height: '300vh' }} // Make section tall enough for horizontal scroll
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

          {/* Progress Indicator */}
          <div className="flex justify-center mb-16 px-6">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-6 py-3">
              <span className="text-sm font-medium text-gray-600">
                Stage {activeStage} of 5
              </span>
              <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${(activeStage / 5) * 100}%`,
                    backgroundColor: '#595F39'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Horizontal Timeline Container */}
          <div className="overflow-hidden">
            <div 
              ref={timelineRef}
              className="flex transition-transform duration-100 ease-out"
              style={{ width: `${stages.length * 100}vw` }}
            >
              {stages.map((stage, index) => (
                <div 
                  key={stage.id} 
                  className="w-screen flex-shrink-0 px-6"
                >
                  <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      {/* Left Side - Stage Info */}
                      <div className="space-y-8">
                        {/* Stage Number & Label */}
                        <div className="flex items-center space-x-6">
                          <div
                            className={`
                              w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-500 ease-out
                              ${activeStage === stage.id ? 'scale-110 shadow-lg' : 'scale-100'}
                            `}
                            style={{
                              backgroundColor: activeStage === stage.id ? '#595F39' : '#E5E7EB',
                              color: activeStage === stage.id ? 'white' : '#6B7280'
                            }}
                          >
                            {stage.id}
                          </div>
                          <div>
                            <h3 className="text-3xl font-medium text-gray-900 mb-2">
                              {stage.label}
                            </h3>
                            <span 
                              className="px-4 py-2 text-sm font-medium rounded-full"
                              style={{
                                backgroundColor: '#9C8B5E20',
                                color: '#9C8B5E'
                              }}
                            >
                              {stage.timeline}
                            </span>
                          </div>
                        </div>

                        {/* Purpose */}
                        <div>
                          <h4 className="text-xl font-medium text-gray-900 mb-4">
                            Purpose
                          </h4>
                          <p className="text-lg text-gray-600 font-light leading-relaxed">
                            {stage.purpose}
                          </p>
                        </div>
                      </div>

                      {/* Right Side - Detailed Content */}
                      <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-lg">
                        {/* We Do */}
                        <div className="mb-8">
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

                        {/* You Get */}
                        <div className="mb-8">
                          <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#9C8B5E' }} />
                            You Get
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {stage.youGet.map((item, itemIndex) => (
                              <span
                                key={itemIndex}
                                className="px-4 py-2 text-sm rounded-full font-medium"
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

                        {/* Success Looks Like */}
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
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center mt-16 space-x-4 px-6">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStage(stage.id);
                  // Scroll to the appropriate position for this stage
                  const container = containerRef.current;
                  if (container) {
                    const containerTop = container.offsetTop;
                    const windowHeight = window.innerHeight;
                    const sectionHeight = container.offsetHeight;
                    const progress = (stage.id - 1) / (stages.length - 1);
                    const targetScroll = containerTop - windowHeight + (progress * sectionHeight);
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                  }
                }}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${activeStage === stage.id 
                    ? 'scale-110 shadow-lg' 
                    : 'hover:scale-105 hover:shadow-md'
                  }
                `}
                style={{
                  backgroundColor: activeStage === stage.id ? '#595F39' : '#E5E7EB',
                  color: activeStage === stage.id ? 'white' : '#6B7280'
                }}
              >
                {stage.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white py-16 px-6">
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
