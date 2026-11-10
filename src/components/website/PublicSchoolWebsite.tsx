import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { GraduationCap, BookOpen, Award, CheckCircle2, Calendar, Phone, Mail, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export const PublicSchoolWebsite: React.FC = () => {
  const { schoolConfig, addStudent, classes, setActiveTab, setRole } = useSchool();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Application form
  const [applicantChildName, setApplicantChildName] = useState('');
  const [applicantClass, setApplicantClass] = useState(classes[0]?.id || 'cls-jss1');
  const [applicantGender, setApplicantGender] = useState<'Male' | 'Female'>('Male');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  const handleOnlineApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantChildName || !parentName || !parentPhone) {
      alert('Please complete the required application fields.');
      return;
    }

    const names = applicantChildName.trim().split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ') || 'Candidate';

    addStudent({
      firstName,
      lastName,
      gender: applicantGender,
      dob: '2013-03-20',
      classId: applicantClass,
      arm: 'Gold',
      passportUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      bloodGroup: 'O+',
      genotype: 'AA',
      guardianName: parentName,
      guardianPhone: parentPhone,
      guardianEmail: parentEmail,
      guardianAddress: 'Lekki / Victoria Island, Lagos',
      guardianRelationship: 'Parent',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      totalFeesOwed: 185000,
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowApplyModal(false);
      setApplicantChildName('');
      setParentName('');
      setParentPhone('');
      alert('Application received! Pupil has been provisionally enrolled into the school admissions register.');
    }, 2500);
  };

  return (
    <div className="space-y-12 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Website Top Bar */}
      <div className="bg-slate-900 text-white px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{schoolConfig.phone}</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>{schoolConfig.email}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-300 font-semibold text-[11px]">
            Admissions Open for {schoolConfig.currentSession}
          </span>
          <button
            onClick={() => {
              setRole('admin');
              setActiveTab('overview');
            }}
            className="px-2.5 py-1 text-[11px] font-bold bg-emerald-700 hover:bg-emerald-600 rounded text-white"
          >
            Enter Staff Portal
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative px-6 lg:px-12 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md text-xs font-semibold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Government Approved · WAEC, NECO & Cambridge Accredited</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {schoolConfig.name}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed font-normal max-w-xl">
              Nurturing leaders through modern STEM education, digital CBT mastery, ethical leadership, and holistic
              character development in a world-class academic environment.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setShowApplyModal(true)}
                className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm"
              >
                <span>Apply for Admission Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setRole('student');
                  setActiveTab('cbt');
                }}
                className="flex items-center gap-2 px-5 py-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <span>Student CBT Login</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <img
              src="/src/assets/images/school_campus_hero_1794342283728.jpg"
              alt="School Campus"
              className="rounded-2xl shadow-lg border border-slate-200 object-cover w-full h-[340px]"
            />
            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-xs text-white p-3 rounded-lg text-xs max-w-xs border border-white/10">
              <span className="font-bold block text-emerald-300">Calizion Campus Facility</span>
              <span className="text-[11px] text-slate-300">Modern ICT laboratories, science suites, and sports complex.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Principal Welcome & Digital Learning Showcase */}
      <div className="bg-slate-50 border-y border-slate-200 py-12 px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-6">
            <img
              src="/src/assets/images/school_principal_avatar_1794342284206.jpg"
              alt="School Principal"
              className="w-32 h-32 rounded-2xl object-cover border-2 border-emerald-600 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-800">
                Principal&apos;s Welcome
              </div>
              <h3 className="text-lg font-bold text-slate-900">{schoolConfig.principalName}</h3>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                &ldquo;Welcome to {schoolConfig.name}. We believe every child possesses innate genius. Through our
                blend of rigorous national curriculum, computer-based testing, and moral mentorship, our students
                excel globally.&rdquo;
              </p>
            </div>
          </div>

          <div>
            <img
              src="/src/assets/images/student_learning_showcase_1794342284583.jpg"
              alt="Interactive Class"
              className="rounded-xl shadow-md border border-slate-200 object-cover w-full h-48"
            />
          </div>
        </div>
      </div>

      {/* Academic Divisions */}
      <div className="px-6 lg:px-12 py-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Academic Divisions</span>
          <h2 className="text-2xl font-bold text-slate-900">Comprehensive Educational Pathways</h2>
          <p className="text-xs text-slate-600">
            From early childhood foundational learning to advanced senior science and humanities preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              EY
            </div>
            <h4 className="text-sm font-bold text-slate-900">Early Years & Nursery</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Play-based Montessori inquiry, phonics literacy, sensory cognitive development, and creative expression.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              PR
            </div>
            <h4 className="text-sm font-bold text-slate-900">Primary Academy</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Foundational numeracy, science inquiry, digital literacy, arts, cultural citizenship, and reading mastery.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              JS
            </div>
            <h4 className="text-sm font-bold text-slate-900">Junior Secondary (JSS 1 - 3)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Basic science & technology, intro to coding & CBT examinations, French, creative arts, and BECE preparation.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              SS
            </div>
            <h4 className="text-sm font-bold text-slate-900">Senior Secondary (SS 1 - 3)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Science, Commercial, and Arts streams with intensive laboratory practicals, WAEC, NECO, and JAMB CBT drills.
            </p>
          </div>
        </div>
      </div>

      {/* Online Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">Online Admission Application Portal</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {submittedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Application Submitted Successfully!</h4>
                <p className="text-xs text-slate-600">
                  Your ward&apos;s application has been registered into the Calizion admissions queue. You will receive an
                  SMS with your provisional admission letter.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOnlineApplication} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Child / Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applicantChildName}
                    onChange={(e) => setApplicantChildName(e.target.value)}
                    placeholder="e.g. David Somtochukwu Okafor"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Applying For Class</label>
                    <select
                      value={applicantClass}
                      onChange={(e) => setApplicantClass(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.section})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Gender</label>
                    <select
                      value={applicantGender}
                      onChange={(e) => setApplicantGender(e.target.value as any)}
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <div className="font-bold text-slate-900">Guardian / Parent Information</div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Guardian Full Name *</label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Chief Emeka Okafor"
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="e.g. +234 802 334 1122"
                        className="w-full p-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Email Address</label>
                      <input
                        type="email"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        placeholder="e.g. parent@lagos.com"
                        className="w-full p-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-xs"
                  >
                    Submit Admission Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Website Footer */}
      <footer className="bg-slate-900 text-slate-400 p-8 border-t border-slate-800 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-bold text-white text-sm">{schoolConfig.name}</div>
            <p className="text-[11px] text-slate-400">{schoolConfig.address}</p>
          </div>
          <div className="text-center sm:text-right text-[11px]">
            <span>Powered by <strong>Calizion SchoolSuite</strong></span>
            <span className="block text-slate-500">Eliminating manual school records across Africa.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
