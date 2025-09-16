'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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
    label: 'Analysis',
    purpose: 'Understand AI maturity, risks, and opportunities; align on where to start.',
    weDo: ['Company survey & interviews', 'Infra/data/governance review', 'Risk workshop'],
    youGet: ['AI Readiness Report', 'Current State Analysis', 'Risk & Limitations Register', 'SWOT', 'Roadmap'],
    successLooksLike: 'Clear priority roadmap, known risks with owners, baseline for adoption/ROI.',
    timeline: '~4 weeks'
  },
  {
    id: 2,
    label: 'Enablement',
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
    timeline: 'Monthly'
  }
];

export default function AIAdoptionProcess() {
  const [activeStage, setActiveStage] = useState<number>(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const scrollToStage = (stageId: number) => {
    if (!contentRef.current) return;
    
    const content = contentRef.current;
    const stageIndex = stageId - 1;
    const stageWidth = content.scrollWidth / stages.length;
    const targetScrollLeft = stageIndex * stageWidth;
    
    content.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
    
    setActiveStage(stageId);
  };

  const handleScroll = () => {
    if (!contentRef.current) return;
    
    const content = contentRef.current;
    const scrollLeft = content.scrollLeft;
    const stageWidth = content.scrollWidth / stages.length;
    const stageIndex = Math.round(scrollLeft / stageWidth);
    const newActiveStage = Math.min(Math.max(stageIndex + 1, 1), stages.length);
    
    if (newActiveStage !== activeStage) {
      setActiveStage(newActiveStage);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    
    if (!section || !content) return;

    // Get all stage elements
    const stageElements = content.querySelectorAll('.stage-panel');
    
    // Create horizontal scroll animation using GSAP ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: "top top",
        end: () => `+=${content.scrollWidth - window.innerWidth}`,
        scrub: 1,
        snap: {
          snapTo: 1 / (stages.length - 1),
          duration: { min: 0.2, max: 1 },
          delay: 0.1,
          onComplete: () => {
            // Update active stage when snap completes
            const progress = scrollTriggerRef.current?.progress || 0;
            const stageIndex = Math.round(progress * (stages.length - 1));
            setActiveStage(stageIndex + 1);
          }
        },
        onUpdate: (self) => {
          // Update active stage during scroll
          const progress = self.progress;
          const stageIndex = Math.round(progress * (stages.length - 1));
          setActiveStage(stageIndex + 1);
        },
        onRefresh: () => {
          // Recalculate when window resizes
          ScrollTrigger.refresh();
        }
      }
    });

    // Animate horizontal movement
    tl.to(content, {
      x: () => -(content.scrollWidth - window.innerWidth),
      ease: "none"
    });

    // Store ScrollTrigger reference for cleanup
    scrollTriggerRef.current = ScrollTrigger.getById(tl.scrollTrigger?.id || '');

    // Add scroll listener for click navigation
    content.addEventListener('scroll', handleScroll);

    // Cleanup function
    return () => {
      content.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section className="py-24 bg-white relative" id="ai-adoption-process" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">
            Our 5-Stage AI Adoption <span style={{ color: '#595F39' }}>Process</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-900 max-w-4xl mx-auto font-light">
            Transform your business with AI before your competitors do. Our proven methodology delivers measurable results, 
            competitive advantage, and future-ready operations that scale with your growth.
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

        {/* Horizontal Scroll Container */}
        <div 
          ref={contentRef}
          className="flex overflow-hidden"
          style={{ 
            width: '100%',
            height: 'auto'
          }}
        >
          {stages.map((stage) => (
            <div 
              key={stage.id}
              className="stage-panel w-screen flex-shrink-0 px-6"
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
    </section>
  );
}
