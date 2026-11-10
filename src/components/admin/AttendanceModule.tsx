import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { CalendarCheck, Send, CheckCircle, Clock, AlertTriangle, Check, UserX } from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { classes, students, markAttendance, attendance, sendBroadcast, schoolConfig } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-ss2');
  const [selectedArm, setSelectedArm] = useState<string>('Science');
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === activeClass?.id);

  // Local attendance status map for the form
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, { status: 'Present' | 'Absent' | 'Late' | 'Excused'; remarks: string }>
  >(() => {
    const init: Record<string, { status: 'Present' | 'Absent' | 'Late' | 'Excused'; remarks: string }> = {};
    classStudents.forEach((st) => {
      init[st.id] = { status: 'Present', remarks: '' };
    });
    return init;
  });

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: 'Present' | 'Absent' | 'Late' | 'Excused'; remarks: string }> = {};
    classStudents.forEach((st) => {
      updated[st.id] = { status: 'Present', remarks: '' };
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = () => {
    const records = classStudents.map((st) => {
      const entry = attendanceMap[st.id] || { status: 'Present', remarks: '' };
      return {
        studentId: st.id,
        studentName: `${st.firstName} ${st.lastName}`,
        status: entry.status,
        remarks: entry.remarks,
      };
    });

    markAttendance(selectedClassId, selectedArm, attendanceDate, records);
    alert(`Attendance for ${activeClass?.name} (${selectedArm}) on ${attendanceDate} saved successfully!`);
  };

  const absentStudents = classStudents.filter((st) => attendanceMap[st.id]?.status === 'Absent');

  const handleTriggerAbsentAlerts = () => {
    if (absentStudents.length === 0) {
      alert('No students marked absent in this class.');
      return;
    }

    const count = absentStudents.length;
    const success = sendBroadcast({
      recipientGroup: 'Specific Class',
      channel: 'Both SMS & WhatsApp',
      messageText: `Dear Parent, your child was marked absent today (${attendanceDate}) at ${schoolConfig.name}. Please contact the school office if this was unplanned.`,
    });

    if (success) {
      alert(`Automated SMS & WhatsApp absence alerts dispatched to guardians of ${count} absent students!`);
    } else {
      alert('Insufficient SMS balance! Please top up your units.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Daily Roll Call & Attendance Register</h2>
          <p className="text-xs text-slate-500">
            Real-time classroom roll call with automated WhatsApp and SMS alerts for absent students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Save Attendance Register</span>
          </button>
        </div>
      </div>

      {/* Class and Date Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div>
          <label className="block text-slate-600 font-medium mb-1">Select Class</label>
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              const cls = classes.find((c) => c.id === e.target.value);
              if (cls && cls.arms.length > 0) {
                setSelectedArm(cls.arms[0]);
              }
            }}
            className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.section})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-600 font-medium mb-1">Arm / Stream</label>
          <select
            value={selectedArm}
            onChange={(e) => setSelectedArm(e.target.value)}
            className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
          >
            {activeClass?.arms.map((arm) => (
              <option key={arm} value={arm}>
                Arm: {arm}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-600 font-medium mb-1">Roll Call Date</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-mono font-medium"
          />
        </div>
      </div>

      {/* Absenteeism Alert Action Banner */}
      {absentStudents.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <UserX className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <strong>{absentStudents.length} Students Marked Absent Today:</strong>
              <span className="block text-amber-800 text-[11px]">
                {absentStudents.map((s) => `${s.firstName} ${s.lastName}`).join(', ')}
              </span>
            </div>
          </div>
          <button
            onClick={handleTriggerAbsentAlerts}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Absence SMS & WhatsApp</span>
          </button>
        </div>
      )}

      {/* Attendance Register Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Class Register: {activeClass?.name} ({selectedArm}) · {classStudents.length} Students
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Date: {attendanceDate}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-semibold">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-3">Admission No</th>
                <th className="py-3 px-3">Roll Call Status</th>
                <th className="py-3 px-3">Remarks / Reason</th>
                <th className="py-3 px-4 text-right">Guardian Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st) => {
                const entry = attendanceMap[st.id] || { status: 'Present', remarks: '' };

                return (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {st.lastName}, {st.firstName}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{st.admissionNo}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg w-max">
                        <button
                          onClick={() => handleStatusChange(st.id, 'Present')}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                            entry.status === 'Present'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(st.id, 'Late')}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                            entry.status === 'Late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleStatusChange(st.id, 'Absent')}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                            entry.status === 'Absent'
                              ? 'bg-rose-700 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleStatusChange(st.id, 'Excused')}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                            entry.status === 'Excused'
                              ? 'bg-blue-700 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        placeholder="e.g. Medical excuse or traffic delay"
                        value={entry.remarks}
                        onChange={(e) => handleRemarkChange(st.id, e.target.value)}
                        className="w-full max-w-xs p-1 text-xs border border-slate-200 rounded bg-white text-slate-800"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-[11px]">
                        <span className="text-slate-800 font-medium block">{st.guardianName}</span>
                        <span className="text-slate-500 font-mono">{st.guardianPhone}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
