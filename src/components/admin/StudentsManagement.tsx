import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student } from '../../types';
import { Search, UserPlus, Filter, Download, Check, X, Shield, Phone, Mail } from 'lucide-react';

export const StudentsManagement: React.FC = () => {
  const { students, classes, addStudent, setSelectedStudentId, setSelectedReportCard, reportCards, schoolConfig } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingAdmissionLetter, setViewingAdmissionLetter] = useState<Student | null>(null);

  // New student form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    gender: 'Male' as 'Male' | 'Female',
    dob: '2012-05-10',
    classId: classes[0]?.id || 'cls-jss1',
    arm: 'Gold',
    bloodGroup: 'O+',
    genotype: 'AA',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianAddress: '',
    guardianRelationship: 'Father',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'Active' as const,
    passportUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    totalFeesOwed: 185000,
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  const handleSubmitNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.guardianName) {
      alert('Please fill in required fields (Student First & Last name, Guardian Name).');
      return;
    }
    const created = addStudent(formData);
    setIsAddModalOpen(false);
    // Open admission letter for newly admitted pupil
    setViewingAdmissionLetter(created);
  };

  const getClassName = (classId: string) => {
    const cls = classes.find((c) => c.id === classId);
    return cls ? cls.name : 'Class';
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Admission & Enrollment</h2>
          <p className="text-xs text-slate-500">
            Official pupil register, bio-data records, guardian contacts, and automated admission letters.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Student Admission</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, admission number (e.g. CAL/2024/0142), or parent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
          >
            <option value="all">All Academic Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.section})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Admission No</th>
                <th className="py-3 px-3">Class & Arm</th>
                <th className="py-3 px-3">Guardian & Phone</th>
                <th className="py-3 px-3">Fee Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => {
                const balance = st.totalFeesOwed - st.totalFeesPaid;
                const isCleared = balance <= 0;
                return (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.passportUrl}
                          alt={st.firstName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {st.lastName}, {st.firstName} {st.middleName || ''}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {st.gender} · {st.bloodGroup} ({st.genotype})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-900">{st.admissionNo}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">{getClassName(st.classId)}</span>
                      <span className="text-slate-500 ml-1">({st.arm})</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-800 font-medium block">{st.guardianName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{st.guardianPhone}</span>
                    </td>
                    <td className="py-3 px-3">
                      {isCleared ? (
                        <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                          Cleared (Paid)
                        </span>
                      ) : (
                        <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                          Owes ₦{balance.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingAdmissionLetter(st)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                          title="Generate Admission Letter"
                        >
                          Letter
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudentId(st.id);
                            if (reportCards[st.id]) {
                              setSelectedReportCard(reportCards[st.id]);
                            } else {
                              alert(`Report card for ${st.firstName} is being prepared by teachers.`);
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                        >
                          Report Card
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admission Letter Modal / Printable Document */}
      {viewingAdmissionLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-print">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-8">
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white no-print">
              <span className="font-semibold text-sm">Official Letter of Provisional Admission</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 rounded text-white flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Letter</span>
                </button>
                <button
                  onClick={() => setViewingAdmissionLetter(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-5 text-xs text-slate-800 font-sans leading-relaxed">
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h1 className="text-lg font-black uppercase text-slate-900">{schoolConfig.name}</h1>
                <p className="text-xs text-slate-600 italic">{schoolConfig.motto}</p>
                <p className="text-[11px] text-slate-500">
                  {schoolConfig.address} · Tel: {schoolConfig.phone}
                </p>
                <div className="mt-3 uppercase font-bold text-xs tracking-wider inline-block bg-slate-100 px-3 py-1 border border-slate-300">
                  OFFICIAL PROVISIONAL ADMISSION OFFER
                </div>
              </div>

              <div className="flex justify-between items-start text-xs">
                <div>
                  <span className="text-slate-500 block">Date of Offer:</span>
                  <strong className="text-slate-900">{viewingAdmissionLetter.admissionDate}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Admission Number:</span>
                  <strong className="font-mono text-emerald-800 text-sm">{viewingAdmissionLetter.admissionNo}</strong>
                </div>
              </div>

              <div>
                <p>
                  To the Guardian of <strong>{viewingAdmissionLetter.firstName} {viewingAdmissionLetter.lastName}</strong>,
                </p>
                <p className="text-slate-600">
                  {viewingAdmissionLetter.guardianName}
                  <br />
                  {viewingAdmissionLetter.guardianAddress}
                </p>
              </div>

              <p>Dear Sir/Madam,</p>

              <p>
                We are delighted to formally offer your ward,{' '}
                <strong className="text-slate-900">
                  {viewingAdmissionLetter.lastName}, {viewingAdmissionLetter.firstName}
                </strong>
                , provisional admission into{' '}
                <strong>
                  {getClassName(viewingAdmissionLetter.classId)} ({viewingAdmissionLetter.arm})
                </strong>{' '}
                for the <strong>{schoolConfig.currentSession}</strong> at {schoolConfig.name}.
              </p>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">Admission Conditions & Requirements:</div>
                <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
                  <li>Payment of 2nd term tuition and administrative dues prior to resumption.</li>
                  <li>Submission of official medical fitness report and birth certificate photocopy.</li>
                  <li>Compliance with the institution&apos;s code of conduct and academic excellence policy.</li>
                </ul>
              </div>

              <p>
                Please accept our congratulations on your ward&apos;s successful admission. We look forward to nurturing
                their academic, technological, and character potential.
              </p>

              <div className="pt-6 flex justify-between items-end border-t border-slate-200">
                <div>
                  <div className="font-semibold text-slate-900">{schoolConfig.principalName}</div>
                  <div className="text-[11px] text-slate-500">Principal & Head of School</div>
                </div>
                <div className="text-right">
                  <div className="p-1 border border-dashed border-emerald-800 text-emerald-800 text-[10px] font-bold uppercase rounded px-2">
                    Verified by Calizion SchoolSuite
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">Register & Admit New Pupil / Student</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewStudent} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Olumide"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Adeleke"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    placeholder="e.g. Temitope"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Class</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Arm / Stream</label>
                  <input
                    type="text"
                    value={formData.arm}
                    onChange={(e) => setFormData({ ...formData, arm: e.target.value })}
                    placeholder="e.g. Gold or Science"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Blood / Genotype</label>
                  <div className="flex gap-1">
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-1/2 p-2 border border-slate-200 rounded-lg"
                    >
                      <option value="O+">O+</option>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="AB+">AB+</option>
                    </select>
                    <select
                      value={formData.genotype}
                      onChange={(e) => setFormData({ ...formData, genotype: e.target.value })}
                      className="w-1/2 p-2 border border-slate-200 rounded-lg"
                    >
                      <option value="AA">AA</option>
                      <option value="AS">AS</option>
                      <option value="AC">AC</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="pt-2 border-t border-slate-200">
                <div className="font-bold text-slate-900 mb-2">Guardian / Parent Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Guardian Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      placeholder="e.g. Engr. Kayode Adeleke"
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Phone Number (for SMS & WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      placeholder="e.g. +234 803 123 4567"
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.guardianEmail}
                      onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                      placeholder="e.g. kayode@gmail.com"
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Home Address in City</label>
                    <input
                      type="text"
                      value={formData.guardianAddress}
                      onChange={(e) => setFormData({ ...formData, guardianAddress: e.target.value })}
                      placeholder="e.g. Lekki Phase 1, Lagos"
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
                >
                  Complete Admission & Generate Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
