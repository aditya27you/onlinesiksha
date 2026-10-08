import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  SlidersHorizontal,
  MapPin,
  Star,
  BadgeCheck,
  CreditCard,
  Monitor,
  Clock,
  Video,
  TrendingUp,
  Download,
  ArrowLeftRight,
  ExternalLink,
  ShieldCheck,
  List,
  LayoutGrid,
  ClipboardCheck,
  Laptop,
  Hourglass,
  BarChart3,
  Smartphone,
  Handshake,
  Building2,
  Users,
  Brain,
  PiggyBank,
  Briefcase,
  Fuel,
  Trophy,
  X,
  Check,
} from 'lucide-react';
import { DEGREEFYD_LPU_API } from '../data/apiData';

interface UniversitiesViewProps {
  onOpenApply: (courseId?: string) => void;
  onOpenHelpDesk: () => void;
  onOpenBrochure: () => void;
}

// Available Accreditation filter options
const ACCREDITATION_OPTIONS = [
  { id: 'naac_app', label: 'NAAC A++ Grade', tag: 'A++' },
  { id: 'naac_ap', label: 'NAAC A+ Grade', tag: 'A+' },
  { id: 'naac_a', label: 'NAAC A Grade', tag: 'A' },
  { id: 'nirf_top35', label: 'NIRF Top 35 Ranked', tag: 'NIRF Top 35' },
  { id: 'ugc_deb', label: 'UGC-DEB Entitled', tag: 'UGC-DEB' },
  { id: 'aicte', label: 'AICTE Approved', tag: 'AICTE' },
  { id: 'wes', label: 'WES / Global Evaluation', tag: 'WES' },
];

// Available Location / State filter options
const LOCATION_OPTIONS = [
  { id: 'punjab', label: 'Punjab (Phagwara, Mohali)' },
  { id: 'delhi_ncr_up', label: 'Delhi NCR / Uttar Pradesh (Noida)' },
  { id: 'rajasthan', label: 'Rajasthan (Jaipur)' },
  { id: 'karnataka', label: 'Karnataka (Bangalore Hub)' },
  { id: 'uttarakhand', label: 'Uttarakhand (Dehradun)' },
];

const FEE_RANGES = [
  { id: 'all', label: 'All Budgets', max: Infinity, min: 0 },
  { id: 'under_140', label: 'Under ₹ 1,40,000 Total', max: 140000, min: 0 },
  { id: '140_160', label: '₹ 1,40,000 – ₹ 1,60,000', max: 160000, min: 140000 },
  { id: 'above_160', label: 'Above ₹ 1,60,000', max: Infinity, min: 160001 },
];

const toneMap: Record<string, { badge: string; border: string; text: string; solid: string }> = {
  blue: { badge: 'bg-[#f0f3ff]', border: 'border-[#d5e3ff]', text: 'text-[#115eaf]', solid: 'bg-[#115eaf]' },
  indigo: { badge: 'bg-[#e0e7ff]', border: 'border-[#c7d2fe]', text: 'text-[#3730a3]', solid: 'bg-[#4f46e5]' },
  emerald: { badge: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', solid: 'bg-emerald-600' },
  amber: { badge: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', solid: 'bg-amber-500' },
};

const specIconByLabel: Record<string, typeof Monitor> = {
  'Exam Mode': Monitor,
  Examination: ClipboardCheck,
  Exams: Laptop,
  'Exam Pattern': Laptop,
  'Degree Duration': Clock,
  'Course Duration': Hourglass,
  'Live Sessions': Video,
  'Live Masterclasses': Video,
  'Highest CTC Record': TrendingUp,
  'Avg Package': BarChart3,
  'LMS Delivery': Smartphone,
  'Hiring Partners': Handshake,
  'Corporate Tie-ups': Building2,
  'Global Alumni': Users,
  'Career Assistance': Users,
  Mentorship: Brain,
  Scholarships: PiggyBank,
  'Job Fair Access': Briefcase,
  Specialization: Fuel,
  'Alumni Status': Trophy,
};

export const UniversitiesView: React.FC<UniversitiesViewProps> = ({
  onOpenApply,
  onOpenHelpDesk,
  onOpenBrochure,
}) => {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [compared, setCompared] = useState<string[]>(['lpu-online', 'cu-online']);

  // Real-time Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccreditations, setSelectedAccreditations] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedFeeRange, setSelectedFeeRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'nirf' | 'fee-asc' | 'fee-desc' | 'rating'>('nirf');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleCompare = (id: string) => {
    setCompared((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const toggleAccreditation = (id: string) => {
    setSelectedAccreditations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleLocation = (id: string) => {
    setSelectedLocations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedAccreditations([]);
    setSelectedLocations([]);
    setSelectedFeeRange('all');
    setSortBy('nirf');
  };

  const matchesUniversityAccreditation = (uni: (typeof DEGREEFYD_LPU_API.onlineUniversities)[0], accId: string) => {
    const naac = (uni.naac || '').toLowerCase();
    const approvals = uni.approvals.map((a) => a.toLowerCase()).join(' ');
    const rankNote = (uni.rankNote || '').toLowerCase();

    switch (accId) {
      case 'naac_app':
        return naac.includes('a++');
      case 'naac_ap':
        return naac.includes('a+') && !naac.includes('a++');
      case 'naac_a':
        return naac.includes('a grade') || (naac.includes('a') && !naac.includes('a+'));
      case 'nirf_top35':
        return rankNote.includes('#31') || rankNote.includes('#32') || rankNote.includes('top 35');
      case 'ugc_deb':
        return approvals.includes('ugc') || approvals.includes('deb');
      case 'aicte':
        return approvals.includes('aicte') || uni.id === 'lpu-online' || uni.id === 'cu-online';
      case 'wes':
        return (
          approvals.includes('wes') ||
          uni.id === 'lpu-online' ||
          uni.id === 'amity-online' ||
          uni.id === 'manipal-online' ||
          uni.id === 'upes-online'
        );
      default:
        return true;
    }
  };

  const matchesUniversityLocation = (uni: (typeof DEGREEFYD_LPU_API.onlineUniversities)[0], locId: string) => {
    const loc = (uni.location || '').toLowerCase();
    switch (locId) {
      case 'punjab':
        return loc.includes('punjab') || loc.includes('phagwara') || loc.includes('mohali');
      case 'delhi_ncr_up':
        return loc.includes('noida') || loc.includes('uttar pradesh') || loc.includes('delhi');
      case 'rajasthan':
        return loc.includes('jaipur') || loc.includes('rajasthan');
      case 'karnataka':
        return loc.includes('bangalore') || loc.includes('karnataka');
      case 'uttarakhand':
        return loc.includes('dehradun') || loc.includes('uttarakhand');
      default:
        return true;
    }
  };

  const getNumericFee = (uni: (typeof DEGREEFYD_LPU_API.onlineUniversities)[0]): number => {
    if (uni.id === 'lpu-online') return 140000;
    if (uni.id === 'cu-online') return 135000;
    if (uni.id === 'amity-online') return 180000;
    if (uni.id === 'manipal-online') return 175000;
    if (uni.id === 'jain-online') return 150000;
    if (uni.id === 'upes-online') return 155000;
    return 150000;
  };

  const filteredUniversities = useMemo(() => {
    return DEGREEFYD_LPU_API.onlineUniversities.filter((uni) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = uni.name.toLowerCase().includes(query) || uni.short.toLowerCase().includes(query);
        const matchesLoc = uni.location.toLowerCase().includes(query);
        const matchesTracks = uni.tracks.some((t) => t.toLowerCase().includes(query));
        const matchesApprovals = uni.approvals.some((a) => a.toLowerCase().includes(query));
        if (!matchesName && !matchesLoc && !matchesTracks && !matchesApprovals) return false;
      }
      if (selectedAccreditations.length > 0) {
        const matchesAnyAcc = selectedAccreditations.some((accId) =>
          matchesUniversityAccreditation(uni, accId)
        );
        if (!matchesAnyAcc) return false;
      }
      if (selectedLocations.length > 0) {
        const matchesAnyLoc = selectedLocations.some((locId) =>
          matchesUniversityLocation(uni, locId)
        );
        if (!matchesAnyLoc) return false;
      }
      if (selectedFeeRange !== 'all') {
        const fee = getNumericFee(uni);
        const range = FEE_RANGES.find((r) => r.id === selectedFeeRange);
        if (range && (fee < range.min || fee > range.max)) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'fee-asc') return getNumericFee(a) - getNumericFee(b);
      if (sortBy === 'fee-desc') return getNumericFee(b) - getNumericFee(a);
      if (sortBy === 'rating') {
        const rA = a.id === 'manipal-online' ? 4.8 : a.id === 'amity-online' ? 4.7 : 4.5;
        const rB = b.id === 'manipal-online' ? 4.8 : b.id === 'amity-online' ? 4.7 : 4.5;
        return rB - rA;
      }
      const nirfOrder = ['lpu-online', 'cu-online', 'amity-online', 'upes-online', 'manipal-online', 'jain-online'];
      return nirfOrder.indexOf(a.id) - nirfOrder.indexOf(b.id);
    });
  }, [searchQuery, selectedAccreditations, selectedLocations, selectedFeeRange, sortBy]);

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    selectedAccreditations.length +
    selectedLocations.length +
    (selectedFeeRange !== 'all' ? 1 : 0);

  return (
    <div className="pb-16 md:pb-6">
      {/* HERO & DISCOVERY SEARCH BAR */}
      <section className="bg-gradient-to-b from-[#f0f3ff] via-white to-[#f9f9ff] border-b border-[#e7eeff] pt-5 pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-3.5">
            <div className="mb-1.5 text-[11px] font-medium text-[#43474d]">
              <span className="text-[#115eaf] font-semibold">Accredited by UGC, AICTE &amp; NAAC</span>
              <span className="text-[#c4c6ce] mx-2">|</span>
              <span className="text-[#115eaf] font-semibold">Session 2026-27 Open</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-[30px] lg:text-[34px] font-bold text-[#000f22] tracking-tight leading-snug">
              Explore Top UGC-DEB Approved Online Universities in India
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#43474d] font-normal leading-relaxed mt-1 max-w-2xl mx-auto">
              Filter by NAAC accreditation, state location, and verified fee structure – discover the ideal university for your career goals.
            </p>
          </div>

          {/* Search Console */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#d5e3ff] shadow-lg max-w-4xl mx-auto space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 relative flex items-center">
                <Search className="absolute left-3.5 text-[#115eaf] w-4.5 h-4.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by university name, state, degree (e.g., LPU, Bangalore, MBA)..."
                  className="w-full pl-10 pr-8 py-3 bg-[#f9f9ff] rounded-xl border border-[#c4c6ce] text-[#000f22] placeholder:text-[#74777e] text-xs sm:text-sm focus:outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/20 transition-all font-normal"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="md:col-span-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex-1 py-3 px-3 bg-[#f0f3ff] text-[#115eaf] border border-[#d5e3ff] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </button>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  disabled={activeFiltersCount === 0}
                  className="py-3 px-4 bg-[#115eaf] hover:bg-[#004689] disabled:opacity-40 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* TOP-BAR ACCREDITATION & LOCATION QUICK PILLS */}
            <div className="pt-2 border-t border-[#e7eeff] flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
              <span className="text-[11px] font-semibold text-[#74777e] uppercase whitespace-nowrap mr-1">
                Quick Filter:
              </span>
              <button
                type="button"
                onClick={resetAllFilters}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeFiltersCount === 0
                    ? 'bg-[#0b2540] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-[#115eaf]'
                }`}
              >
                All Universities ({DEGREEFYD_LPU_API.onlineUniversities.length})
              </button>
              <button
                type="button"
                onClick={() => toggleAccreditation('naac_app')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  selectedAccreditations.includes('naac_app')
                    ? 'bg-[#115eaf] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-[#115eaf]'
                }`}
              >
                <span>★ NAAC A++</span>
              </button>
              <button
                type="button"
                onClick={() => toggleAccreditation('naac_ap')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  selectedAccreditations.includes('naac_ap')
                    ? 'bg-[#115eaf] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-[#115eaf]'
                }`}
              >
                <span>★ NAAC A+</span>
              </button>
              <button
                type="button"
                onClick={() => toggleAccreditation('nirf_top35')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  selectedAccreditations.includes('nirf_top35')
                    ? 'bg-[#115eaf] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-[#115eaf]'
                }`}
              >
                <span>★ NIRF Top 35</span>
              </button>
              <button
                type="button"
                onClick={() => toggleLocation('punjab')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  selectedLocations.includes('punjab')
                    ? 'bg-[#115eaf] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-[#115eaf]'
                }`}
              >
                <MapPin className="w-3 h-3 text-[#115eaf]" />
                <span>Punjab</span>
              </button>
              <button
                type="button"
                onClick={() => toggleLocation('delhi_ncr_up')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  selectedLocations.includes('delhi_ncr_up')
                    ? 'bg-[#115eaf] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-[#115eaf]'
                }`}
              >
                <MapPin className="w-3 h-3 text-[#115eaf]" />
                <span>Delhi NCR / UP</span>
              </button>
              <button
                type="button"
                onClick={() => toggleLocation('karnataka')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  selectedLocations.includes('karnataka')
                    ? 'bg-[#115eaf] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-[#115eaf]'
                }`}
              >
                <MapPin className="w-3 h-3 text-[#115eaf]" />
                <span>Bangalore</span>
              </button>
              <button
                type="button"
                onClick={() => toggleLocation('rajasthan')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  selectedLocations.includes('rajasthan')
                    ? 'bg-[#115eaf] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-[#115eaf]'
                }`}
              >
                <MapPin className="w-3 h-3 text-[#115eaf]" />
                <span>Rajasthan</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT: SIDEBAR + LISTINGS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* DESKTOP SIDEBAR FILTER COMPONENT */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#d5e3ff] p-5 shadow-xs sticky top-20 hidden lg:block space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#e7eeff]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#115eaf]" />
                <span className="text-sm font-bold text-[#000f22]">Filter By</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#f0f3ff] text-[#115eaf] text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {activeFiltersCount} Active
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[#115eaf] text-xs hover:underline font-semibold cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* FILTER 1: ACCREDITATION & RECOGNITION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#000f22] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#115eaf]" />
                  <span>Accreditation</span>
                </span>
                {selectedAccreditations.length > 0 && (
                  <button
                    onClick={() => setSelectedAccreditations([])}
                    className="text-[11px] text-[#115eaf] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {ACCREDITATION_OPTIONS.map((acc) => {
                  const isChecked = selectedAccreditations.includes(acc.id);
                  const count = DEGREEFYD_LPU_API.onlineUniversities.filter((u) =>
                    matchesUniversityAccreditation(u, acc.id)
                  ).length;
                  return (
                    <label
                      key={acc.id}
                      className="flex items-center justify-between text-xs cursor-pointer group hover:text-[#115eaf] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAccreditation(acc.id)}
                          className="w-4 h-4 rounded text-[#115eaf] border-slate-300 focus:ring-[#115eaf] cursor-pointer"
                        />
                        <span className={`font-normal ${isChecked ? 'text-[#115eaf] font-semibold' : 'text-slate-800'}`}>
                          {acc.label}
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded font-mono">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* FILTER 2: REGIONAL LOCATION */}
            <div className="pt-4 border-t border-[#e7eeff] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#000f22] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#115eaf]" />
                  <span>State & Location</span>
                </span>
                {selectedLocations.length > 0 && (
                  <button
                    onClick={() => setSelectedLocations([])}
                    className="text-[11px] text-[#115eaf] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {LOCATION_OPTIONS.map((loc) => {
                  const isChecked = selectedLocations.includes(loc.id);
                  const count = DEGREEFYD_LPU_API.onlineUniversities.filter((u) =>
                    matchesUniversityLocation(u, loc.id)
                  ).length;
                  return (
                    <label
                      key={loc.id}
                      className="flex items-center justify-between text-xs cursor-pointer group hover:text-[#115eaf] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleLocation(loc.id)}
                          className="w-4 h-4 rounded text-[#115eaf] border-slate-300 focus:ring-[#115eaf] cursor-pointer"
                        />
                        <span className={`font-normal ${isChecked ? 'text-[#115eaf] font-semibold' : 'text-slate-800'}`}>
                          {loc.label}
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded font-mono">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* FILTER 3: TOTAL COURSE FEE RANGE */}
            <div className="pt-4 border-t border-[#e7eeff] space-y-3">
              <span className="text-xs font-bold text-[#000f22] uppercase tracking-wider block">
                Total Program Fee
              </span>
              <div className="space-y-1.5">
                {FEE_RANGES.map((f) => (
                  <label
                    key={f.id}
                    className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer hover:text-[#115eaf]"
                  >
                    <input
                      type="radio"
                      name="fee_range_desktop"
                      checked={selectedFeeRange === f.id}
                      onChange={() => setSelectedFeeRange(f.id)}
                      className="w-4 h-4 text-[#115eaf] border-slate-300 cursor-pointer"
                    />
                    <span className={selectedFeeRange === f.id ? 'text-[#115eaf] font-semibold' : ''}>
                      {f.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* COUNSELLING PROMO BOX */}
            <div className="pt-4 border-t border-[#e7eeff]">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#f0f3ff] to-[#e7eeff] border border-[#d5e3ff] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#115eaf]">
                  <BadgeCheck className="w-4 h-4" />
                  <span>Unsure Which Fits Best?</span>
                </div>
                <p className="text-[11px] text-[#43474d] leading-relaxed">
                  Our counselors evaluate your academic transcripts, career background, and target budget at zero charge.
                </p>
                <button
                  type="button"
                  onClick={onOpenHelpDesk}
                  className="w-full mt-1 py-1.5 bg-[#115eaf] hover:bg-[#004689] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Request Callback</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT: LISTINGS & TOOLBAR */}
          <section className="lg:col-span-9 space-y-4" id="university-listings-container">
            {/* Toolbar Status Strip */}
            <div className="bg-white p-3.5 px-4 rounded-xl border border-[#d5e3ff] flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#000f22]">
                  Showing {filteredUniversities.length} of {DEGREEFYD_LPU_API.onlineUniversities.length} Universities
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c4c6ce]" />
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                  100% UGC-DEB Entitled
                </span>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                {/* Sort selector */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="py-1.5 px-2.5 bg-slate-50 rounded-lg border border-slate-300 text-slate-800 text-xs font-medium focus:ring-1 focus:ring-[#115eaf] cursor-pointer"
                  >
                    <option value="nirf">NIRF Ranking (Top First)</option>
                    <option value="fee-asc">Total Fee: Low to High</option>
                    <option value="fee-desc">Total Fee: High to Low</option>
                    <option value="rating">Student Rating</option>
                  </select>
                </div>
                {/* View Switcher */}
                <div className="flex items-center border border-slate-300 rounded-lg p-0.5 bg-[#f0f3ff]">
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    title="List View"
                    className={`p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center ${
                      view === 'list'
                        ? 'bg-[#115eaf] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('grid')}
                    title="Grid View"
                    className={`p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center ${
                      view === 'grid'
                        ? 'bg-[#115eaf] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Tags Strip */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 py-1 text-xs">
                <span className="text-slate-500 text-[11px] font-medium mr-1">Active Filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                    <span>"{searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-600">×</button>
                  </span>
                )}
                {selectedAccreditations.map((accId) => {
                  const opt = ACCREDITATION_OPTIONS.find((o) => o.id === accId);
                  return (
                    <span
                      key={accId}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200"
                    >
                      <span>{opt?.label || accId}</span>
                      <button onClick={() => toggleAccreditation(accId)} className="hover:text-red-600">×</button>
                    </span>
                  );
                })}
                {selectedLocations.map((locId) => {
                  const opt = LOCATION_OPTIONS.find((o) => o.id === locId);
                  return (
                    <span
                      key={locId}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{opt?.label.split(' ')[0] || locId}</span>
                      <button onClick={() => toggleLocation(locId)} className="hover:text-red-600">×</button>
                    </span>
                  );
                })}
                {selectedFeeRange !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    <span>{FEE_RANGES.find((r) => r.id === selectedFeeRange)?.label}</span>
                    <button onClick={() => setSelectedFeeRange('all')} className="hover:text-red-600">×</button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-[#115eaf] hover:underline font-semibold ml-1 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* University Cards Listing */}
            {filteredUniversities.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No universities match your filters</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try removing some accreditation or location filters to see more results from our 50+ entitled university database.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-4 py-2 bg-[#115eaf] text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-[#004689] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  view === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300'
                    : 'space-y-4'
                }
              >
                {filteredUniversities.map((u) => (
                  <article
                    key={u.id}
                    onClick={() => navigate(`/universities/${u.id}`)}
                    className="bg-white rounded-2xl border border-[#d5e3ff] p-5 md:p-6 shadow-xs hover:shadow-xl hover:border-[#115eaf] transition-all duration-300 relative flex flex-col cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-[#e7eeff]">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#f0f3ff] border border-[#d5e3ff] flex flex-col items-center justify-center shrink-0 shadow-xs overflow-hidden">
                          <span className="text-lg font-bold text-[#115eaf] tracking-tight">
                            {u.short}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider font-semibold text-[#43474d] -mt-0.5">
                            Online
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h2 className="text-base sm:text-lg font-bold text-[#000f22] leading-snug">
                              {u.name}
                            </h2>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                                toneMap[u.highlight.tone].badge
                              } ${toneMap[u.highlight.tone].text} ${toneMap[u.highlight.tone].border}`}
                            >
                              <BadgeCheck className="w-3 h-3" />
                              {u.highlight.text}
                            </span>
                          </div>
                          <p className="text-[13px] font-normal text-[#43474d] flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3.5 h-3.5 text-[#74777e]" />
                              {u.location}
                            </span>
                            <span>•</span>
                            <span>Est. {u.established}</span>
                            <span>•</span>
                            <span className="text-[#B45309] font-semibold">{u.rankNote}</span>
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2.5">
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                              <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                              {u.naac}
                            </span>
                            {u.approvals.map((a) => (
                              <span
                                key={a}
                                className="px-2.5 py-1 bg-[#f0f3ff] text-[#115eaf] border border-[#d5e3ff] rounded-lg text-[11px] font-semibold"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-left md:text-right bg-[#f9f9ff] md:bg-transparent p-3.5 md:p-0 rounded-xl shrink-0 border md:border-0 border-[#e7eeff]">
                        <span className="block text-[11px] text-[#74777e] font-semibold uppercase">
                          Total Program Fee
                        </span>
                        <div className="text-xl font-bold text-[#000f22]">
                          {u.feeLabel}{' '}
                          <span className="text-xs text-[#43474d] font-normal">onwards</span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 mt-1 bg-emerald-50 text-emerald-800 rounded-full text-[11px] font-semibold border border-emerald-200/60 shadow-xs">
                          <CreditCard className="w-3 h-3" />
                          EMI starts {u.emi}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3.5 my-2 bg-[#f9f9ff] rounded-xl px-4 border border-[#e7eeff] text-center sm:text-left">
                      {u.specs.map((s) => {
                        const Icon = specIconByLabel[s.label] || Monitor;
                        return (
                          <div key={s.label}>
                            <span className="text-[11px] text-[#74777e] font-semibold uppercase block">
                              {s.label}
                            </span>
                            <span
                              className={`text-[13px] font-medium flex items-center justify-center sm:justify-start gap-1 mt-0.5 ${
                                s.highlight ? 'text-emerald-700' : 'text-[#000f22]'
                              }`}
                            >
                              <Icon
                                className={`w-3.5 h-3.5 ${
                                  s.highlight ? 'text-emerald-600' : 'text-[#115eaf]'
                                }`}
                              />
                              {s.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-[#74777e] uppercase font-semibold mr-1">
                          Popular Tracks:
                        </span>
                        {u.tracks.map((t) => (
                          <span
                            key={t}
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1 bg-white border border-[#d5e3ff] rounded-full text-xs font-medium text-[#000f22] hover:border-[#115eaf] transition-colors"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <label 
                          className="flex items-center gap-1.5 text-[13px] font-medium text-[#43474d] cursor-pointer mr-2 select-none hover:text-[#000f22]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={compared.includes(u.id)}
                            onChange={() => toggleCompare(u.id)}
                            className="w-4 h-4 rounded text-[#115eaf] border-[#c4c6ce] cursor-pointer"
                          />
                          <span>Compare</span>
                        </label>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenBrochure();
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#000f22] text-xs font-semibold border border-[#d5e3ff] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Brochure</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenApply();
                          }}
                          className="px-4 py-2 rounded-xl bg-[#115eaf] hover:bg-[#004689] text-white text-xs font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#115eaf]" />
                <h3 className="text-sm font-bold text-slate-900">Filter Universities</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Accreditations */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase">Accreditations</span>
              <div className="grid grid-cols-2 gap-2">
                {ACCREDITATION_OPTIONS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => toggleAccreditation(acc.id)}
                    className={`p-2 rounded-lg text-xs font-medium border text-left flex items-center justify-between cursor-pointer ${
                      selectedAccreditations.includes(acc.id)
                        ? 'bg-blue-50 border-[#115eaf] text-[#115eaf] font-semibold'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{acc.label}</span>
                    {selectedAccreditations.includes(acc.id) && <Check className="w-3.5 h-3.5 text-[#115eaf]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase">State & Location</span>
              <div className="space-y-1.5">
                {LOCATION_OPTIONS.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => toggleLocation(loc.id)}
                    className={`w-full p-2 rounded-lg text-xs font-medium border text-left flex items-center justify-between cursor-pointer ${
                      selectedLocations.includes(loc.id)
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-semibold'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{loc.label}</span>
                    {selectedLocations.includes(loc.id) && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Fee range */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase">Budget</span>
              <div className="grid grid-cols-2 gap-1.5">
                {FEE_RANGES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFeeRange(f.id)}
                    className={`p-2 rounded-lg text-xs font-medium border text-left cursor-pointer ${
                      selectedFeeRange === f.id
                        ? 'bg-[#0b2540] text-white font-semibold'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#115eaf] text-white text-xs font-bold shadow cursor-pointer"
              >
                Show Results ({filteredUniversities.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPARISON MATRIX PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="bg-white rounded-2xl border border-[#d5e3ff] p-5 md:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e7eeff]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f0f3ff] text-[#115eaf] text-[11px] font-semibold mb-1">
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Quick Decision Matrix</span>
              </div>
              <h2 className="text-lg font-bold text-[#000f22]">
                Side-by-Side Comparison: Top Online Universities
              </h2>
              <p className="text-[13px] font-normal text-[#43474d] mt-0.5">
                Analyze accreditations, total fee structures, exam patterns, and LMS delivery across leading contenders.
              </p>
            </div>
            <button
              onClick={onOpenHelpDesk}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#115eaf] text-white text-xs font-semibold hover:bg-[#004689] shadow-sm transition-all active:scale-95 shrink-0 self-start md:self-auto cursor-pointer"
            >
              <span>Compare Full Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {DEGREEFYD_LPU_API.onlineUniversities.slice(0, 3).map((u) => (
              <div
                key={`matrix-${u.id}`}
                className="rounded-xl p-4 bg-[#f9f9ff] border border-[#e7eeff] hover:border-[#d5e3ff] transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#d5e3ff] flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#115eaf]">{u.short}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#000f22] leading-snug">
                      {u.name.split(' (')[0]}
                    </h3>
                    <span className="text-[11px] text-[#115eaf] font-semibold">{u.naac}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-[#e7eeff] pt-3">
                  <div className="flex justify-between">
                    <span className="text-[#74777e]">Total Fee:</span>
                    <span className="font-semibold text-[#000f22]">{u.feeLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#74777e]">Monthly EMI:</span>
                    <span className="font-semibold text-emerald-700">{u.emi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#74777e]">Exam Mode:</span>
                    <span className="font-medium text-[#000f22]">{u.specs[0].value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#74777e]">Location:</span>
                    <span className="font-medium text-[#000f22]">{u.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenApply()}
                  className="w-full mt-3 py-1.5 px-3 rounded-lg bg-white hover:bg-[#115eaf] hover:text-white text-[#115eaf] text-xs font-semibold border border-[#d5e3ff] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View {u.short} Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLOATING COMPARE DOCK */}
      {compared.length > 0 && (
        <div className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-4xl bg-[#0b2540] text-white rounded-xl shadow-2xl p-3 md:p-4 border border-[#314865] flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#115eaf] text-white flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">University Comparison Tray</span>
                <span className="bg-amber-400 text-[#2f1500] font-bold text-[11px] px-2 py-0.5 rounded-full">
                  {compared.length} Selected
                </span>
              </div>
              <span className="text-xs font-normal text-[#b1c8eb] hidden sm:block">
                Select up to 3 universities to compare approvals, fees, and semesters side-by-side.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompared([])}
              className="text-xs text-[#c4c6ce] hover:text-white underline px-2 hidden sm:inline cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={onOpenHelpDesk}
              className="px-4 py-2 bg-[#115eaf] hover:bg-[#dee8ff] hover:text-[#004689] text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span>Compare Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
