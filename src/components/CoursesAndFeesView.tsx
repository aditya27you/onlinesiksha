import React, { useState, useMemo } from 'react';
import { Course, CourseCategory } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { DEGREEFYD_LPU_API } from '../data/apiData';
import { 
  CheckCircle, 
  Search, 
  ChevronRight, 
  Download, 
  ArrowRight, 
  Calculator, 
  Star, 
  ChevronDown, 
  PhoneCall, 
  Laptop, 
  CreditCard, 
  Layers, 
  Calendar,
  Gift,
  Clock
} from 'lucide-react';

interface CoursesAndFeesViewProps {
  onSelectCourse: (course: Course) => void;
  onOpenApply: (courseId?: string) => void;
  onOpenBrochure: (course?: Course) => void;
  onOpenEmi: (courseId?: string) => void;
  onOpenHelpDesk: () => void;
  universityNavigation?: React.ReactNode;
}

export const CoursesAndFeesView: React.FC<CoursesAndFeesViewProps> = ({
  onSelectCourse,
  onOpenApply,
  onOpenBrochure,
  onOpenEmi,
  onOpenHelpDesk,
  universityNavigation
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popularity' | 'fee-asc' | 'fee-desc' | 'duration'>('popularity');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter((course) => {
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesSearch = 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'fee-asc') return a.totalFee - b.totalFee;
      if (sortBy === 'fee-desc') return b.totalFee - a.totalFee;
      if (sortBy === 'duration') return a.semestersCount - b.semestersCount;
      const popularityOrder = ['mba', 'mca', 'bca', 'bba', 'bcom', 'ba', 'mcom', 'msc-math', 'msc-eco', 'ma', 'diploma'];
      return popularityOrder.indexOf(a.id) - popularityOrder.indexOf(b.id);
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const ugCourses = COURSES_DATA.filter(c => c.category === 'ug');
  const pgCourses = COURSES_DATA.filter(c => c.category === 'pg').slice(0, 5);

  return (
    <div className="space-y-0">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-[#e7eeff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-xs text-[#43474d] space-x-2 font-medium">
            <span className="hover:text-[#115eaf] cursor-pointer">Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#74777e]" />
            <span className="hover:text-[#115eaf] cursor-pointer">Colleges</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#74777e]" />
            <span className="hover:text-[#115eaf] cursor-pointer">Lovely Professional University Online</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#74777e]" />
            <span className="text-[#000f22] font-bold">Courses & Fees</span>
          </nav>
        </div>
      </div>

      {/* COURSE CATALOG HERO BANNER */}
      <section className="content-block relative bg-gradient-to-b from-[#f0f3ff] via-[#f9f9ff] to-[#f9f9ff] overflow-hidden border-b border-[#e7eeff]/60">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div>
                <h1 className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold text-[#000f22] tracking-tight font-sans leading-tight">
                  LPU Online Courses and Fees 2026
                </h1>
                <p className="section-description text-xs sm:text-sm text-[#43474d] max-w-3xl leading-relaxed font-normal">
                  Lovely Professional University Online offers a wide range of undergraduate and postgraduate online degree programs in India across Management, Computer Applications, Commerce, Arts, and Sciences.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  onClick={() => onOpenApply()}
                  className="px-5 py-2.5 rounded-xl bg-[#115eaf] text-white text-xs sm:text-sm font-semibold shadow hover:bg-[#004689] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Apply Online</span>
                </button>
                <button
                  onClick={() => onOpenBrochure()}
                  className="px-4 py-2.5 rounded-xl bg-white text-[#000f22] border border-[#0b2540] text-xs sm:text-sm font-semibold hover:bg-[#f0f3ff] active:scale-95 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#115eaf]" />
                  <span>Download Complete Fee Brochure</span>
                </button>
                <button
                  onClick={onOpenHelpDesk}
                  className="px-3.5 py-2.5 rounded-xl text-[#115eaf] hover:bg-[#dee8ff] text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Talk to an Academic Counselor</span>
                </button>
              </div>

              {/* 4 Informational Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-4 rounded-xl bg-white border border-[#e7eeff] flex flex-col justify-between">
                  <div className="w-7 h-7 rounded-lg bg-[#FFFBEB] text-[#92400E] flex items-center justify-center mb-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#000f22] font-sans">NAAC A++</div>
                    <div className="text-[11px] text-[#43474d] mt-0.5 font-normal">Score 3.68 / 4.0</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#e7eeff] flex flex-col justify-between">
                  <div className="w-7 h-7 rounded-lg bg-[#d5e3ff] text-[#004689] flex items-center justify-center mb-1.5">
                    <Laptop className="w-3.5 h-3.5 text-[#115eaf]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#000f22] font-sans">100% Online</div>
                    <div className="text-[11px] text-[#43474d] mt-0.5 font-normal">Exams & Classes from Home</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#e7eeff] flex flex-col justify-between">
                  <div className="w-7 h-7 rounded-lg bg-[#dee8ff] text-[#115eaf] flex items-center justify-center mb-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#115eaf]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#000f22] font-sans">From ₹ 18,666</div>
                    <div className="text-[11px] text-[#43474d] mt-0.5 font-normal">Semester tuition fee</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#e7eeff] flex flex-col justify-between">
                  <div className="w-7 h-7 rounded-lg bg-[#e7eeff] text-[#000f22] flex items-center justify-center mb-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#115eaf]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#000f22] font-sans">10 Programs</div>
                    <div className="text-[11px] text-[#43474d] mt-0.5 font-normal">UG, PG & Diploma Courses</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Hero Admissions Card */}
            <div className="lg:col-span-4">
              <div className="rounded-xl p-4 sm:p-5 bg-white border border-[#115eaf]/25 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-[#e7eeff]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs sm:text-sm font-semibold text-[#000f22]">Admissions Open 2026</span>
                  </div>
                </div>

                <div className="space-y-3 py-3.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#f0f3ff] flex items-center justify-center shrink-0 text-[#115eaf]">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#43474d] block font-normal">Registration Intake</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#000f22]">Active Spring 2026</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#FFFBEB] flex items-center justify-center shrink-0 text-[#92400E]">
                      <Gift className="w-3.5 h-3.5 text-[#D97706]" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#43474d] block font-normal">Tuition Fee Grant</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#B45309]">Up to 20% Early Bird Concession</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#f0f3ff] flex items-center justify-center shrink-0 text-[#115eaf]">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#43474d] block font-normal">Monthly Payment Option</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#000f22]">Zero-Cost EMI from ₹ 4,100/month</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e7eeff] flex flex-col gap-1.5">
                  <button
                    onClick={() => onOpenApply()}
                    className="w-full py-2.5 rounded-lg bg-[#0b2540] text-white text-xs sm:text-sm font-semibold hover:bg-[#000f22] active:scale-95 transition-all flex items-center justify-center gap-2 shadow cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-center text-[10px] text-[#74777e] font-normal">
                    Direct merit-based admission with online document verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {universityNavigation}

      {/* FILTER STRIP & SEARCH */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-y border-[#e7eeff] shadow-xs py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0b2540] text-white'
                  : 'bg-[#f0f3ff] text-[#43474d] hover:bg-[#e7eeff]'
              }`}
            >
              All Courses ({COURSES_DATA.length})
            </button>
            <button
              onClick={() => setSelectedCategory('ug')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'ug'
                  ? 'bg-[#0b2540] text-white'
                  : 'bg-[#f0f3ff] text-[#43474d] hover:bg-[#e7eeff]'
              }`}
            >
              Undergraduate (UG)
            </button>
            <button
              onClick={() => setSelectedCategory('pg')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'pg'
                  ? 'bg-[#0b2540] text-white'
                  : 'bg-[#f0f3ff] text-[#43474d] hover:bg-[#e7eeff]'
              }`}
            >
              Postgraduate (PG)
            </button>
            <button
              onClick={() => setSelectedCategory('diploma')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'diploma'
                  ? 'bg-[#0b2540] text-white'
                  : 'bg-[#f0f3ff] text-[#43474d] hover:bg-[#e7eeff]'
              }`}
            >
              Diploma
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777e]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search degree or subject..."
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#c4c6ce] bg-white text-xs sm:text-sm font-normal focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/20 transition-all outline-none"
              />
            </div>

            <div className="relative min-w-[140px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full h-10 px-3 pr-8 rounded-xl border border-[#c4c6ce] bg-white text-xs sm:text-sm font-normal text-[#000f22] focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/20 outline-none appearance-none cursor-pointer"
              >
                <option value="popularity">Sort: Popularity</option>
                <option value="fee-asc">Fee: Low to High</option>
                <option value="fee-desc">Fee: High to Low</option>
                <option value="duration">Duration</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#74777e] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* EMI SUPPORT BANNER */}
      <section className="page-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="rounded-xl p-4 bg-gradient-to-r from-[#dee8ff] via-[#e7eeff] to-[#d5e3ff] border border-[#115eaf]/30 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#115eaf] text-white flex items-center justify-center shrink-0">
              <Calculator className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#000f22] font-sans">
                  Tuition Fee Concessions & Zero-Cost EMI Support
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#ffdcc3] text-[#6e3900] rounded">
                  0% Interest
                </span>
              </div>
              <p className="text-[11px] text-[#43474d] mt-[7.5px] leading-relaxed">
                Eligible students can apply for up to a <strong className="text-[#000f22] font-bold">20% Early Bird fee grant</strong> on total tuition. Monthly zero-interest installment options starting from <strong className="text-[#115eaf] font-bold">₹ 4,100/month</strong> are also available through partner banks.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenEmi()}
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-[#115eaf] text-white text-xs sm:text-sm font-bold shadow hover:bg-[#004689] active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Calculate Monthly EMI</span>
          </button>
        </div>
      </section>

      {/* FEE STRUCTURE MATRIX */}
      <section className="content-block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-3 gap-3">
          <div>
            <span className="text-xs font-normal text-[#115eaf] uppercase tracking-wider block">
              Fee Structure Matrix
            </span>
            <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] tracking-tight font-sans">
              LPU Online Fee Structure 2026 (Semester & Total)
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#43474d] font-normal">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Includes Exam Fees, LMS Access & Digital Material</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table 1: Undergraduate (UG) Programs */}
          <div className="bg-white rounded-xl border border-[#e7eeff] overflow-hidden flex flex-col justify-between">
            <div>
              <div className="px-5 py-3.5 bg-[#f0f3ff] border-b border-[#e7eeff] flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-[#000f22] font-sans">Undergraduate (UG) Programs</h3>
                  <p className="mt-[7.5px] text-xs text-[#43474d] font-normal">Standard Duration: 3 Years / 6 Semesters</p>
                </div>
                <span className="px-2 py-0.5 text-xs font-normal rounded-md bg-[#d3e4ff] text-[#011c37]">
                  UG Degrees
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#e7eeff] text-[#43474d] text-xs font-semibold bg-[#f9f9ff]">
                      <th className="py-2.5 px-5">Course Name</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Per Sem Fee</th>
                      <th className="py-2.5 px-3">Total Fee</th>
                      <th className="py-2.5 px-5 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7eeff]">
                    {ugCourses.map((c) => (
                      <tr key={c.id} className="hover:bg-[#f0f3ff]/60 transition-colors">
                        <td className="py-2.5 px-5 font-normal text-[#000f22]">
                          {c.code}
                          <span className="block text-[11px] font-normal text-[#74777e]">{c.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-[#43474d] font-normal">{c.duration.split(' ')[0]} Years</td>
                        <td className="py-2.5 px-3 font-normal text-[#000f22]">₹ {c.perSemFee.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 font-normal text-[#115eaf]">₹ {c.totalFee.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-5 text-right">
                          <button
                            onClick={() => onSelectCourse(c)}
                            className="inline-flex items-center text-[#115eaf] font-medium text-xs hover:underline cursor-pointer"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-3.5 bg-[#f9f9ff] border-t border-[#e7eeff] flex items-center justify-between text-xs text-[#43474d] font-normal">
              <span>Registration Fee: ₹ 600 (adjusted during enrollment)</span>
              <button
                onClick={() => onOpenApply('bba')}
                className="text-[#115eaf] font-semibold hover:underline cursor-pointer"
              >
                Apply for UG Programs →
              </button>
            </div>
          </div>

          {/* Table 2: Postgraduate (PG) Programs */}
          <div className="bg-white rounded-xl border border-[#e7eeff] overflow-hidden flex flex-col justify-between">
            <div>
              <div className="px-5 py-3.5 bg-[#f0f3ff] border-b border-[#e7eeff] flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-[#000f22] font-sans">Postgraduate (PG) Programs</h3>
                  <p className="mt-[7.5px] text-xs text-[#43474d] font-normal">Standard Duration: 2 Years / 4 Semesters</p>
                </div>
                <span className="px-2 py-0.5 text-xs font-normal rounded-md bg-[#d5e3ff] text-[#004689]">
                  PG Degrees
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#e7eeff] text-[#43474d] text-xs font-semibold bg-[#f9f9ff]">
                      <th className="py-2.5 px-5">Course Name</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Per Sem Fee</th>
                      <th className="py-2.5 px-3">Total Fee</th>
                      <th className="py-2.5 px-5 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7eeff]">
                    {pgCourses.map((c) => (
                      <tr key={c.id} className="hover:bg-[#f0f3ff]/60 transition-colors">
                        <td className="py-2.5 px-5 font-normal text-[#000f22]">
                          {c.code}
                          <span className="block text-[11px] font-normal text-[#74777e]">{c.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-[#43474d] font-normal">{c.duration.split(' ')[0]} Years</td>
                        <td className="py-2.5 px-3 font-normal text-[#000f22]">₹ {c.perSemFee.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 font-normal text-[#115eaf]">₹ {c.totalFee.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-5 text-right">
                          <button
                            onClick={() => onSelectCourse(c)}
                            className="inline-flex items-center text-[#115eaf] font-medium text-xs hover:underline cursor-pointer"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-3.5 bg-[#f9f9ff] border-t border-[#e7eeff] flex items-center justify-between text-xs text-[#43474d] font-normal">
              <span>Specializations selected during second semester</span>
              <button
                onClick={() => onOpenApply('mba')}
                className="text-[#115eaf] font-semibold hover:underline cursor-pointer"
              >
                Apply for PG Programs →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE COURSES CATALOG (GRID) */}
      <section className="content-block bg-[#f0f3ff]/50 border-t border-[#e7eeff] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-3xl mb-[18px]">
            <span className="text-xs font-normal text-[#115eaf] uppercase tracking-wider block">
              Course Catalog
            </span>
            <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] tracking-tight font-sans">
              LPU Online Popular Programmes
            </h2>
            <p className="section-description text-xs sm:text-sm text-[#43474d] font-normal leading-relaxed text-left">
              LPU Online courses cover various disciplines and specialisations designed to provide industry-relevant skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredCourses.map((course) => {
              const isTopPick = course.highlightBadge != null;
              const semFeeEst = `₹ ${course.perSemFee.toLocaleString('en-IN')}/sem`;

              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 relative ${
                    isTopPick
                      ? 'border border-[#115eaf]/80 shadow-xs ring-1 ring-[#115eaf]/10'
                      : 'border border-[#e7eeff] shadow-xs hover:border-[#115eaf]/60 hover:shadow-xs'
                  }`}
                >
                  {isTopPick && (
                    <div className="absolute -top-2 right-3.5 bg-[#115eaf] text-white text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      Top Pick
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 text-[10px] font-normal rounded ${
                        course.category === 'ug' 
                          ? 'bg-[#e7eeff] text-[#011c37]'
                          : course.category === 'pg'
                          ? 'bg-[#d5e3ff] text-[#004689]'
                          : 'bg-[#ffdcc3] text-[#6e3900]'
                      }`}>
                        {course.level}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#74777e] font-normal">
                        <Clock className="w-3 h-3 text-[#74777e]" />
                        <span>{course.duration}</span>
                      </span>
                    </div>

                    <h3 
                      className="text-sm sm:text-[15px] font-semibold text-[#000f22] font-sans hover:text-[#115eaf] transition-colors cursor-pointer leading-snug line-clamp-1"
                      onClick={() => onSelectCourse(course)}
                      title={course.name}
                    >
                      {course.name}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-[#555960] mt-[7.5px] line-clamp-2 leading-relaxed font-normal">
                      {course.shortDescription}
                    </p>

                    <div className="mt-2.5 pt-2.5 border-t border-[#f0f3ff] flex items-baseline justify-between">
                      <span className="text-[10px] text-[#74777e] font-normal uppercase tracking-wide">Total Fee</span>
                      <div className="text-right">
                        <span className="text-sm sm:text-[15px] font-bold text-[#000f22] font-sans">
                          ₹ {course.totalFee.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#74777e] font-normal ml-1">
                          ({semFeeEst})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="w-full py-1.5 px-2 rounded-lg bg-[#115eaf] text-white text-[11px] font-medium text-center hover:bg-[#004689] active:scale-95 transition-all shadow-xs flex items-center justify-center cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onOpenBrochure(course)}
                      className="w-full py-1.5 px-2 rounded-lg bg-[#f0f3ff] text-[#001b3c] hover:bg-[#e7eeff] text-[11px] font-normal flex items-center justify-center gap-1 transition-colors border border-[#dce5fa] cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-[#115eaf]" />
                      <span>Syllabus</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="content-block max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-left mb-[18px]">
          <span className="text-xs font-normal text-[#115eaf] uppercase tracking-wider block">
            Got Questions?
          </span>
          <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] tracking-tight font-sans">
            Frequently Asked Questions About Fees & Admissions
          </h2>
        </div>

        <div className="space-y-2.5">
          {DEGREEFYD_LPU_API.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#e7eeff] shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-semibold text-xs sm:text-sm text-[#000f22] hover:text-[#115eaf] transition-colors cursor-pointer"
                >
                  <span className="pr-2">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-[#115eaf] transition-transform duration-200 shrink-0 ml-2 ${
                    isOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-0 text-xs text-[#43474d] leading-relaxed border-t border-[#f0f3ff] mt-1 font-normal">
                    <p className="pt-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
