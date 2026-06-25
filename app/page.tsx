'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CircleCheck as CheckCircle, Circle as XCircle, Shield, ChartBar as BarChart2, Bell, FileText, TrendingUp, Search, ArrowRight, ChevronRight, Menu, X, Database, Zap, Brain, TriangleAlert as AlertTriangle, Download, Activity, ChevronDown, CheckCheck, Star } from 'lucide-react';
import { ScxLogo } from '@/components/scx-logo';
import { PLANS } from '@/lib/mock-data';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pricingAnnual, setPricingAnnual] = useState(false);

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2A2A2A] bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <ScxLogo size="md" />
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[#9A9A9A] hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-[#9A9A9A] hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm text-[#9A9A9A] hover:text-white transition-colors">Pricing</a>
              <a href="https://www.savvyanalytics.info/" target="_blank" rel="noopener noreferrer" className="text-sm text-[#9A9A9A] hover:text-white transition-colors">Savvy Analytics ↗</a>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-sm text-[#9A9A9A] hover:text-white transition-colors px-4 py-2">
                Log in
              </Link>
              <Link href="/register" className="text-sm bg-[#D4A843] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#E8C469] transition-colors">
                Get Started
              </Link>
            </div>
            <button
              className="md:hidden p-2 text-[#9A9A9A]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#2A2A2A] bg-[#0A0A0A] px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-[#9A9A9A] hover:text-white py-2">Features</a>
            <a href="#how-it-works" className="block text-sm text-[#9A9A9A] hover:text-white py-2">How It Works</a>
            <a href="#pricing" className="block text-sm text-[#9A9A9A] hover:text-white py-2">Pricing</a>
            <a href="https://www.savvyanalytics.info/" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#9A9A9A] hover:text-white py-2">Savvy Analytics ↗</a>
            <div className="pt-2 flex gap-3">
              <Link href="/login" className="text-sm border border-[#3A3A3A] text-white px-4 py-2 rounded-lg">Log in</Link>
              <Link href="/register" className="text-sm bg-[#D4A843] text-black font-semibold px-4 py-2 rounded-lg">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-[#D4A843] rounded-full animate-pulse" />
              <span className="text-[#D4A843] text-xs font-mono font-medium tracking-wide">SCX Intelligence Engine — Now in Beta</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              Turn Your Data<br />
              <span className="text-[#D4A843]">Into Decisions</span>
            </h1>

            <p className="text-[#9A9A9A] text-lg leading-relaxed mb-10 max-w-xl">
              SavvyCortex is the AI-powered operational intelligence platform that automatically assesses data quality, detects drift, generates actionable insights, and delivers professional reports — all in one pipeline.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="flex items-center gap-2 bg-[#D4A843] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#E8C469] transition-all hover:shadow-lg hover:shadow-[#D4A843]/20 text-base">
                Start Free <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works" className="flex items-center gap-2 border border-[#3A3A3A] text-white px-6 py-3 rounded-lg hover:border-[#D4A843]/50 transition-colors text-base">
                See How It Works <ChevronDown size={16} />
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-[#6B6B6B]">
              <div className="flex items-center gap-1.5"><CheckCheck size={14} className="text-[#27AE60]" /> No credit card required</div>
              <div className="flex items-center gap-1.5"><CheckCheck size={14} className="text-[#27AE60]" /> Free forever tier</div>
              <div className="flex items-center gap-1.5"><CheckCheck size={14} className="text-[#27AE60]" /> Up in minutes</div>
            </div>
          </div>

          {/* Mock pipeline card */}
          <div className="relative animate-fade-in">
            <div className="absolute -top-8 -left-8 bg-[#C0392B]/10 border border-[#C0392B]/30 rounded-lg px-3 py-1.5 text-xs font-mono text-[#C0392B] z-10 animate-bounce" style={{ animationDuration: '3s' }}>
              ⚠ Schema drift detected — revenue
            </div>
            <div className="absolute -bottom-4 -right-6 bg-[#27AE60]/10 border border-[#27AE60]/30 rounded-lg px-3 py-1.5 text-xs font-mono text-[#27AE60] z-10">
              ✓ Baseline rotated — 4 clean runs
            </div>

            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs font-mono text-[#6B6B6B] uppercase tracking-wider mb-1">SCX Pipeline Monitor</div>
                  <div className="font-semibold text-white">sales_q1_2026.csv</div>
                </div>
                <div className="flex items-center gap-1.5 bg-[#27AE60]/10 border border-[#27AE60]/30 px-2.5 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-[#27AE60] rounded-full animate-pulse" />
                  <span className="text-[#27AE60] text-xs font-mono">LIVE</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#2A2A2A] rounded-xl p-4">
                  <div className="text-xs text-[#6B6B6B] mb-1">Data Quality Score</div>
                  <div className="font-data text-3xl font-bold text-[#27AE60]">94.7%</div>
                  <div className="text-xs text-[#6B6B6B] mt-1">↑ +0.4% vs prev run</div>
                </div>
                <div className="bg-[#2A2A2A] rounded-xl p-4">
                  <div className="text-xs text-[#6B6B6B] mb-1">Drift Severity</div>
                  <div className="font-data text-3xl font-bold text-[#27AE60]">LOW</div>
                  <div className="text-xs text-[#6B6B6B] mt-1">Mean shift &lt;3%</div>
                </div>
                <div className="bg-[#2A2A2A] rounded-xl p-4">
                  <div className="text-xs text-[#6B6B6B] mb-1">Reports Generated</div>
                  <div className="font-data text-3xl font-bold text-white">847</div>
                  <div className="text-xs text-[#6B6B6B] mt-1">All time</div>
                </div>
                <div className="bg-[#2A2A2A] rounded-xl p-4">
                  <div className="text-xs text-[#6B6B6B] mb-1">Active Alerts</div>
                  <div className="font-data text-3xl font-bold text-[#E67E22]">2</div>
                  <div className="text-xs text-[#E67E22] mt-1">Requires attention</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#9A9A9A]">Completeness</span>
                    <span className="font-data text-[#D4A843]">98.2%</span>
                  </div>
                  <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#D4A843] rounded-full" style={{ width: '98.2%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#9A9A9A]">Consistency</span>
                    <span className="font-data text-[#D4A843]">94.1%</span>
                  </div>
                  <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#D4A843] rounded-full" style={{ width: '94.1%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#2A2A2A] flex items-center justify-between">
                <span className="text-xs text-[#6B6B6B] font-mono">Last run: 2 min ago</span>
                <button className="text-xs text-[#D4A843] hover:underline font-mono">View full report →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-[#1E1E1E] bg-[#111111] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-[#6B6B6B] mb-8">Trusted by data-driven teams across industries</p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
            {['Banking & Finance', 'Healthcare', 'Real Estate', 'Operations', 'Supply Chain'].map((industry) => (
              <div key={industry} className="flex items-center gap-2 text-[#6B6B6B]">
                <div className="w-1.5 h-1.5 bg-[#D4A843] rounded-full" />
                <span className="text-sm font-mono tracking-wide">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-[#D4A843]/10 border border-[#D4A843]/20 rounded-full px-4 py-1 mb-4">
            <span className="text-[#D4A843] text-xs font-mono">PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">Everything your data team needs</h2>
          <p className="text-[#9A9A9A] text-lg max-w-2xl mx-auto">Six specialized SCX engines work in sequence to turn raw CSV uploads into executive-grade intelligence.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Data Quality Assessment', desc: 'Automatic scoring across 6 detection categories: completeness, consistency, accuracy, uniqueness, validity, and timeliness.', tag: 'SCX DQA Engine', color: '#3498DB' },
            { icon: TrendingUp, title: 'Drift Detection', desc: 'Compare each run against a rotating baseline. Detect mean shifts, variance changes, PSI, categorical drift, and schema mutations.', tag: 'SCX Drift Monitor', color: '#E67E22' },
            { icon: Brain, title: 'Insight Engine', desc: 'AI-generated narrative summaries that contextualize data quality findings and highlight actionable patterns.', tag: 'SCX Intelligence Engine', color: '#D4A843' },
            { icon: FileText, title: 'Professional Reports', desc: 'Publish-ready DOCX and PDF reports with branded templates, executive summaries, and per-column deep dives.', tag: 'SCX Reports', color: '#27AE60' },
            { icon: Bell, title: 'Monitoring & Alerts', desc: 'Configurable rule engine with threshold-based triggers. Deliver alerts via email or log, with full audit history.', tag: 'SCX Alert Center', color: '#C0392B' },
            { icon: Search, title: 'Recommendation Agent', desc: 'Get prioritized remediation suggestions, root-cause analysis, and column-level correction guidance from the SCX Research model.', tag: 'SCX Research', color: '#9B59B6' },
          ].map(({ icon: Icon, title, desc, tag, color }) => (
            <div key={title} className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#D4A843]/30 transition-all group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}18` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-white">{title}</h3>
              <p className="text-[#9A9A9A] text-sm leading-relaxed mb-4">{desc}</p>
              <div className="inline-block bg-[#1A1A1A] border border-[#3A3A3A] rounded px-2 py-0.5 text-[10px] font-mono text-[#6B6B6B] group-hover:text-[#D4A843] group-hover:border-[#D4A843]/30 transition-colors">{tag}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-[#0D0D0D] border-y border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-[#D4A843]/10 border border-[#D4A843]/20 rounded-full px-4 py-1 mb-4">
              <span className="text-[#D4A843] text-xs font-mono">THE SCX PIPELINE</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">From CSV to boardroom report</h2>
            <p className="text-[#9A9A9A] text-lg max-w-2xl mx-auto">Six automated stages run end-to-end in seconds. No configuration required for first runs.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Ingest & Validate', desc: 'Upload any structured CSV. The engine validates encoding, schema, and file integrity before processing begins.', icon: Database },
              { step: '02', title: 'Data Quality Assessment', desc: 'Run all 6 DQA checks across every column. Score completeness, consistency, validity, uniqueness, accuracy, and timeliness.', icon: Shield },
              { step: '03', title: 'Baseline & Drift Detection', desc: 'Compare against the rolling baseline. Flag column-level mean shifts, variance changes, and schema mutations.', icon: TrendingUp },
              { step: '04', title: 'Compute & Analyze', desc: 'Statistical computation layer extracts distributions, outliers, correlation signals, and trend indicators.', icon: Activity },
              { step: '05', title: 'Generate Narrative', desc: 'The SCX Intelligence Engine composes plain-language findings, priority-ranked issues, and remediation suggestions.', icon: Brain },
              { step: '06', title: 'Deliver Report & Alerts', desc: 'Download your branded PDF or DOCX report. Alerts fire to configured channels. All data persisted for monitoring.', icon: Download },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="relative bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#D4A843]/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="font-data text-[#D4A843] text-lg font-bold leading-none">{step}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className="text-[#D4A843]" />
                      <h3 className="font-semibold text-white">{title}</h3>
                    </div>
                    <p className="text-[#9A9A9A] text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
                {parseInt(step) < 6 && (
                  <div className="absolute bottom-[-1px] right-6 w-6 h-6 hidden lg:block">
                    <ChevronRight size={14} className="text-[#3A3A3A]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-[#D4A843]/10 border border-[#D4A843]/20 rounded-full px-4 py-1 mb-4">
            <span className="text-[#D4A843] text-xs font-mono">PRICING</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">Start free. Scale as you grow.</h2>
          <p className="text-[#9A9A9A] text-lg max-w-2xl mx-auto mb-8">No hidden fees. No trial surprises. The Free tier never expires.</p>

          <div className="inline-flex items-center bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-1">
            <button
              onClick={() => setPricingAnnual(false)}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${!pricingAnnual ? 'bg-[#2A2A2A] text-white' : 'text-[#6B6B6B] hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPricingAnnual(true)}
              className={`px-4 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 ${pricingAnnual ? 'bg-[#2A2A2A] text-white' : 'text-[#6B6B6B] hover:text-white'}`}
            >
              Annual
              <span className="text-[10px] bg-[#D4A843]/20 text-[#D4A843] px-1.5 py-0.5 rounded font-mono">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 border transition-all flex flex-col ${
                plan.badge
                  ? 'bg-[#1A1408] border-[#D4A843]/50 shadow-lg shadow-[#D4A843]/10'
                  : 'bg-[#111111] border-[#2A2A2A] hover:border-[#3A3A3A]'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4A843] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}
              <div className="mb-5">
                <div className="font-display font-bold text-xl text-white mb-1">{plan.name}</div>
                <div className="mt-3">
                  {plan.monthlyPrice === null ? (
                    <div className="font-data text-3xl font-bold text-white">Custom</div>
                  ) : plan.monthlyPrice === 0 ? (
                    <div className="font-data text-3xl font-bold text-white">$0<span className="text-base text-[#6B6B6B] font-sans font-normal">/mo</span></div>
                  ) : (
                    <div>
                      <div className="font-data text-3xl font-bold text-white">
                        ${pricingAnnual ? plan.annualPrice : plan.monthlyPrice}
                        <span className="text-base text-[#6B6B6B] font-sans font-normal">/mo</span>
                      </div>
                      {pricingAnnual && <div className="text-xs text-[#6B6B6B] mt-0.5">billed annually</div>}
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2 text-sm">
                    {f.included ? (
                      <CheckCircle size={14} className="text-[#27AE60] flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={14} className="text-[#3A3A3A] flex-shrink-0 mt-0.5" />
                    )}
                    <span className={f.included ? 'text-[#CCCCCC]' : 'text-[#4A4A4A]'}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <div>
                <Link
                  href={plan.id === 'enterprise' ? 'https://www.savvyanalytics.info/book-online' : '/register'}
                  target={plan.id === 'enterprise' ? '_blank' : undefined}
                  className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    plan.badge
                      ? 'bg-[#D4A843] text-black hover:bg-[#E8C469]'
                      : plan.id === 'free'
                      ? 'border border-[#D4A843]/50 text-[#D4A843] hover:bg-[#D4A843]/10'
                      : 'border border-[#3A3A3A] text-white hover:border-[#D4A843]/30'
                  }`}
                >
                  {plan.cta}
                </Link>
                {plan.ctaNote && (
                  <p className="text-center text-[10px] text-[#6B6B6B] mt-2">{plan.ctaNote}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl overflow-hidden mb-16">
          <div className="grid grid-cols-5 text-xs font-mono uppercase tracking-wider">
            <div className="p-4 text-[#6B6B6B]">Feature</div>
            {PLANS.map(p => (
              <div key={p.id} className={`p-4 text-center font-semibold ${p.badge ? 'text-[#D4A843]' : 'text-[#9A9A9A]'}`}>{p.name}</div>
            ))}
          </div>
          {[
            { feature: 'Reports / month', values: ['3', '25', '100', 'Unlimited'] },
            { feature: 'Data processing', values: ['50 MB', '500 MB', '2 GB', 'Unlimited'] },
            { feature: 'Monitoring rules', values: ['1', '5', 'Unlimited', 'Unlimited'] },
            { feature: 'PDF output', values: [false, true, true, true] },
            { feature: 'Email alerts', values: [false, true, true, true] },
            { feature: 'Full drift engine', values: [false, false, true, true] },
            { feature: 'SCX Research', values: [false, false, true, true] },
            { feature: 'REST API access', values: [false, false, false, true] },
            { feature: 'Custom branding', values: [false, false, true, true] },
            { feature: 'Forecasting', values: [false, false, false, true] },
          ].map(({ feature, values }, idx) => (
            <div key={feature} className={`grid grid-cols-5 border-t border-[#1E1E1E] ${idx % 2 === 0 ? '' : 'bg-[#111111]/50'}`}>
              <div className="p-4 text-sm text-[#9A9A9A]">{feature}</div>
              {values.map((v, i) => (
                <div key={i} className="p-4 text-center">
                  {typeof v === 'boolean' ? (
                    v ? <CheckCircle size={14} className="text-[#27AE60] mx-auto" /> : <XCircle size={14} className="text-[#3A3A3A] mx-auto" />
                  ) : (
                    <span className="font-data text-xs text-[#CCCCCC]">{v}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="font-display text-2xl font-bold text-center mb-8">Frequently asked questions</h3>
          <div className="space-y-4">
            {[
              { q: 'Can I switch plans anytime?', a: 'Yes, upgrade or downgrade at any time. Changes take effect immediately and are prorated on your next billing cycle.' },
              { q: 'What happens when I hit my report limit?', a: "You'll see a notification when you're approaching your limit. Reports pause until the next billing cycle or you upgrade. Your data and history are always preserved." },
              { q: 'Is my data secure?', a: 'All data is encrypted in transit and at rest using AES-256. Each account is fully isolated. We never share or sell your data, and files are deleted from processing queues after report generation.' },
              { q: 'Do you offer discounts for nonprofits?', a: 'Yes — contact us for nonprofit and education pricing. We offer substantial discounts for qualifying organizations.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#3A3A3A] transition-colors">
                <div className="font-semibold text-white mb-2">{q}</div>
                <div className="text-[#9A9A9A] text-sm leading-relaxed">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-b from-[#0D0D0D] to-[#0A0A0A] border-t border-[#1E1E1E]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Star size={16} className="text-[#D4A843] fill-[#D4A843]" />
            <Star size={16} className="text-[#D4A843] fill-[#D4A843]" />
            <Star size={16} className="text-[#D4A843] fill-[#D4A843]" />
            <Star size={16} className="text-[#D4A843] fill-[#D4A843]" />
            <Star size={16} className="text-[#D4A843] fill-[#D4A843]" />
            <span className="text-[#9A9A9A] text-sm ml-2">Loved by data teams</span>
          </div>
          <h2 className="font-display text-5xl font-bold mb-6">Ready to get Savvy<br />with your data?</h2>
          <p className="text-[#9A9A9A] text-lg mb-10 max-w-xl mx-auto">
            Join analysts, operations teams, and data engineers who trust SavvyCortex to keep their pipelines clean and their decisions sharp.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="flex items-center gap-2 bg-[#D4A843] text-black font-bold px-8 py-4 rounded-xl hover:bg-[#E8C469] transition-all hover:shadow-xl hover:shadow-[#D4A843]/20 text-base">
              Start Free — No Credit Card <ArrowRight size={16} />
            </Link>
            <a
              href="https://www.savvyanalytics.info/book-online"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[#3A3A3A] text-white px-8 py-4 rounded-xl hover:border-[#D4A843]/50 transition-colors text-base"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050505] border-t border-[#1E1E1E] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div className="lg:col-span-2">
              <ScxLogo size="md" showTagline={true} />
              <p className="text-[#6B6B6B] text-sm leading-relaxed mt-4 max-w-xs">
                AI-powered operational intelligence infrastructure for data-driven decision-making.
              </p>
              <p className="text-[#4A4A4A] text-xs mt-4">
                A product by{' '}
                <a href="https://www.savvyanalytics.info/" target="_blank" rel="noopener noreferrer" className="text-[#6B6B6B] hover:text-[#D4A843] transition-colors">
                  Savvy Analytics
                </a>
              </p>
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#4A4A4A] mb-4">Product</div>
              <ul className="space-y-3">
                {['Features', 'How It Works', 'Pricing', 'Documentation', 'API Reference'].map(link => (
                  <li key={link}><a href="#" className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#4A4A4A] mb-4">Company</div>
              <ul className="space-y-3">
                <li><a href="https://www.savvyanalytics.info/" target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors">About Savvy Analytics</a></li>
                <li><a href="https://www.savvyanalytics.info/" target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors">Blog</a></li>
                <li><a href="https://www.savvyanalytics.info/" target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors">Contact</a></li>
                <li><a href="https://www.savvyanalytics.info/" target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors">Reviews</a></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#4A4A4A] mb-4">Legal</div>
              <ul className="space-y-3">
                <li><a href="https://www.savvyanalytics.info/terms" target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors">Terms</a></li>
                <li><a href="https://www.savvyanalytics.info/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors">Privacy Policy</a></li>
                <li><a href="https://www.savvyanalytics.info/cookies-policy" target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors">Cookies Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1E1E1E] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#4A4A4A]">
              © 2026{' '}
              <a href="https://www.savvyanalytics.info/" target="_blank" rel="noopener noreferrer" className="hover:text-[#6B6B6B] transition-colors">
                Savvy Analytics, LLC
              </a>
              {' '}— savvyanalytics.info
            </div>
            <div className="text-sm text-[#4A4A4A] font-mono">Dallas, TX • Lisbon, PT</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
