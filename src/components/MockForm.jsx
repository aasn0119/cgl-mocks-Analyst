import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addMock, updateMock } from '../services/mockService';
import toast from 'react-hot-toast';

import {
    FaCalendarAlt,
    FaClipboardList,
    FaTrophy,
    FaPercentage,
    FaBook,
    FaBrain,
    FaCalculator,
    FaGlobeAsia,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaStickyNote,
    FaHashtag,
} from 'react-icons/fa';

// ─── Defined OUTSIDE MockForm so React never treats them as new
//     component types on re-render — prevents focus loss on input ───
const Input = ({ label, icon, name, error, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <span className="text-indigo-500">{icon}</span>
            {label}
        </label>

        <input
            name={name}
            {...props}
            className={`
        w-full px-4 py-3 rounded-xl
        bg-white dark:bg-slate-900
        border ${
            error
                ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-400'
                : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
        }
        text-slate-800 dark:text-white
        focus:outline-none focus:ring-2
        shadow-sm hover:shadow-md transition
      `}
        />

        {error && (
            <p className="text-xs text-rose-500 dark:text-rose-400 mt-0.5">
                {error}
            </p>
        )}
    </div>
);

const Section = ({ title, icon, children }) => (
    <div className="space-y-5">
        <h3 className="flex items-center gap-3 text-lg font-bold text-slate-800 dark:text-white border-l-4 border-indigo-500 pl-3 rounded-none">
            <span className="text-indigo-500">{icon}</span>
            {title}
        </h3>
        {children}
    </div>
);

// ─── Helper: checks value is an integer or ends in exactly .5 ───
const isIntOrHalf = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    return num === Math.floor(num) || (num * 10) % 10 === 5;
};

const EMPTY_FORM = {
    date: new Date().toISOString().split('T')[0],
    platform: '',
    mockId: '',
    totalScore: '',
    rank: '',
    percentile: '',
    englishScore: '',
    reasoningScore: '',
    quantScore: '',
    gkScore: '',
    attemptedQuestions: '',
    correctQuestions: '',
    timeTaken: '',
    remarks: '',
};

const MockForm = ({ editingMock = null, onEditDone }) => {
    const { user } = useAuth();
    const isEditing = Boolean(editingMock);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ─── Populate form when editingMock changes ──────────────────
    useEffect(() => {
        if (editingMock) {
            setFormData({
                date:
                    editingMock.date || new Date().toISOString().split('T')[0],
                platform: editingMock.platform || '',
                mockId: editingMock.mockId || '',
                totalScore: editingMock.totalScore?.toString() || '',
                rank: editingMock.rank?.toString() || '',
                percentile: editingMock.percentile?.toString() || '',
                englishScore: editingMock.englishScore?.toString() || '',
                reasoningScore: editingMock.reasoningScore?.toString() || '',
                quantScore: editingMock.quantScore?.toString() || '',
                gkScore: editingMock.gkScore?.toString() || '',
                attemptedQuestions:
                    editingMock.attemptedQuestions?.toString() || '',
                correctQuestions:
                    editingMock.correctQuestions?.toString() || '',
                timeTaken: editingMock.timeTaken?.toString() || '',
                remarks: editingMock.remarks || '',
            });
            setErrors({});
        } else {
            setFormData(EMPTY_FORM);
            setErrors({});
        }
    }, [editingMock]);

    // ─── Derived stats ───────────────────────────────────────────
    const attempted = parseInt(formData.attemptedQuestions) || 0;
    const correct = parseInt(formData.correctQuestions) || 0;
    const wrong = Math.max(attempted - correct, 0);
    const accuracy =
        attempted > 0 ? ((correct / attempted) * 100).toFixed(2) : '0.00';

    // ─── Subject-score step validation ──────────────────────────
    const validateSubjectScore = (value, fieldLabel) => {
        if (value === '') return '';
        const num = parseFloat(value);
        if (isNaN(num) || num < 0 || num > 50)
            return `${fieldLabel} must be between 0 and 50`;
        if (!isIntOrHalf(value))
            return `${fieldLabel} must be a whole number or end in .5 (e.g. 35 or 35.5)`;
        return '';
    };

    const subjectSumError = (data) => {
        const eng = parseFloat(data.englishScore);
        const rea = parseFloat(data.reasoningScore);
        const qnt = parseFloat(data.quantScore);
        const gk = parseFloat(data.gkScore);
        const tot = parseFloat(data.totalScore);

        if ([eng, rea, qnt, gk, tot].some(isNaN)) return '';

        const subjectTotal = eng + rea + qnt + gk;
        if (Math.abs(subjectTotal - tot) > 0.001)
            return `Subject scores sum to ${subjectTotal} but total score is ${tot}. They must be equal.`;
        return '';
    };

    const validateField = (name, value, latestData) => {
        const data = latestData || formData;
        const num = parseFloat(value);
        const int = parseInt(value);

        switch (name) {
            case 'totalScore': {
                if (value !== '' && (isNaN(num) || num < 0 || num > 200))
                    return 'Score must be between 0 and 200';
                if (value !== '' && !isIntOrHalf(value))
                    return 'Total score must be a whole number or end in .5 (e.g. 145 or 145.5)';
                return subjectSumError({ ...data, totalScore: value });
            }
            case 'rank':
                if (value !== '' && (isNaN(int) || int < 1))
                    return 'Rank must be a positive integer';
                break;
            case 'percentile':
                if (value !== '' && (isNaN(num) || num < 0 || num > 100))
                    return 'Percentile must be between 0 and 100';
                break;
            case 'englishScore':
                return (
                    validateSubjectScore(value, 'English score') ||
                    subjectSumError({ ...data, englishScore: value })
                );
            case 'reasoningScore':
                return (
                    validateSubjectScore(value, 'Reasoning score') ||
                    subjectSumError({ ...data, reasoningScore: value })
                );
            case 'quantScore':
                return (
                    validateSubjectScore(value, 'Quant score') ||
                    subjectSumError({ ...data, quantScore: value })
                );
            case 'gkScore':
                return (
                    validateSubjectScore(value, 'GK score') ||
                    subjectSumError({ ...data, gkScore: value })
                );
            case 'attemptedQuestions':
                if (value !== '' && (isNaN(int) || int < 0 || int > 100))
                    return 'Attempted must be between 0 and 100';
                break;
            case 'correctQuestions': {
                const att = parseInt(data.attemptedQuestions) || 0;
                if (value !== '' && (isNaN(int) || int < 0))
                    return 'Correct must be 0 or more';
                if (value !== '' && int > att)
                    return `Cannot exceed attempted (${att})`;
                break;
            }
            case 'timeTaken':
                if (value !== '' && (isNaN(num) || num < 0 || num > 60))
                    return 'Time must be between 0 and 60 minutes';
                break;
            default:
                break;
        }
        return '';
    };

    // ─── Handlers ───────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;

        const integerFields = [
            'attemptedQuestions',
            'correctQuestions',
            'rank',
        ];
        if (integerFields.includes(name) && value !== '') {
            if (!/^\d+$/.test(value)) return;
        }

        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);

        const error = validateField(name, value, updatedData);
        const newErrors = { ...errors, [name]: error };

        if (name === 'attemptedQuestions') {
            newErrors.correctQuestions = validateField(
                'correctQuestions',
                formData.correctQuestions,
                updatedData
            );
        }

        const scoreGroup = [
            'englishScore',
            'reasoningScore',
            'quantScore',
            'gkScore',
            'totalScore',
        ];
        if (scoreGroup.includes(name)) {
            scoreGroup.forEach((field) => {
                if (field !== name) {
                    newErrors[field] = validateField(
                        field,
                        updatedData[field],
                        updatedData
                    );
                }
            });
        }

        setErrors(newErrors);
    };

    const handleCancel = () => {
        setFormData(EMPTY_FORM);
        setErrors({});
        onEditDone?.();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        Object.keys(formData).forEach((name) => {
            const err = validateField(name, formData[name], formData);
            if (err) newErrors[name] = err;
        });

        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.platform) newErrors.platform = 'Platform is required';

        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            const firstErrorEl = document.querySelector('[data-error="true"]');
            firstErrorEl?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
            return;
        }

        const attempted_val = parseInt(formData.attemptedQuestions) || 0;
        const correct_val = parseInt(formData.correctQuestions) || 0;
        const wrong_val = Math.max(attempted_val - correct_val, 0);
        const accuracy_val =
            attempted_val > 0
                ? Number(((correct_val / attempted_val) * 100).toFixed(2))
                : 0;

        const mockData = {
            date: formData.date,
            platform: formData.platform,
            mockId: formData.mockId,
            totalScore: parseFloat(formData.totalScore) || 0,
            rank: parseInt(formData.rank) || 0,
            percentile: parseFloat(formData.percentile) || 0,
            englishScore: parseFloat(formData.englishScore) || 0,
            reasoningScore: parseFloat(formData.reasoningScore) || 0,
            quantScore: parseFloat(formData.quantScore) || 0,
            gkScore: parseFloat(formData.gkScore) || 0,
            attemptedQuestions: attempted_val,
            correctQuestions: correct_val,
            wrongQuestions: wrong_val,
            accuracy: accuracy_val,
            timeTaken: parseFloat(formData.timeTaken) || 0,
            remarks: formData.remarks,
            userId: user.uid,
            userName: user.displayName,
        };

        setIsSubmitting(true);

        const savePromise = isEditing
            ? updateMock(editingMock.id, mockData)
            : addMock(mockData);

        toast.promise(savePromise, {
            loading: isEditing ? 'Updating mock...' : 'Saving mock...',
            success: isEditing
                ? 'Mock Updated Successfully'
                : 'Mock Added Successfully',
            error: isEditing ? 'Failed to update mock' : 'Failed to save mock',
        });

        try {
            await savePromise;
            if (isEditing) {
                onEditDone?.();
            }
            setFormData(EMPTY_FORM);
            setErrors({});
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Render ──────────────────────────────────────────────────
    return (
        <form
            onSubmit={handleSubmit}
            className="
        max-w-6xl mx-auto p-6 md:p-10 rounded-3xl shadow-2xl
        bg-linear-to-br from-indigo-50 via-sky-50 to-emerald-50
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
        border border-slate-200 dark:border-slate-800
        space-y-10
      "
        >
            {/* HEADER */}
            <div className="space-y-1">
                <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">
                    {isEditing ? 'Edit Mock Test' : 'Add Mock Test'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isEditing
                        ? `Editing: ${editingMock.platform || ''} ${editingMock.mockId ? `· ${editingMock.mockId}` : ''}`
                        : 'Track your SSC CGL performance with structured analytics'}
                </p>
            </div>

            {/* MOCK INFO */}
            <Section title="Mock Information" icon={<FaClipboardList />}>
                <div className="grid md:grid-cols-3 gap-5">
                    <Input
                        label="Date"
                        icon={<FaCalendarAlt />}
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        error={errors.date}
                        required
                    />

                    {/* Platform */}
                    <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <FaClipboardList className="text-indigo-500" />
                            Platform
                        </label>
                        <select
                            name="platform"
                            value={formData.platform}
                            onChange={handleChange}
                            required
                            className={`
                px-4 py-3 rounded-xl
                bg-white dark:bg-slate-900
                border ${
                    errors.platform
                        ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-400'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                }
                text-slate-800 dark:text-white
                focus:outline-none focus:ring-2
                shadow-sm hover:shadow-md transition
              `}
                        >
                            <option value="">Select Platform</option>
                            <option>Testbook</option>
                            <option>Oliveboard</option>
                            <option>TestRanking</option>
                            <option>RBE</option>
                            <option>Pundits</option>
                            <option>ParmarMocks</option>
                            <option>MathsMania</option>
                            <option>Others</option>
                        </select>
                        {errors.platform && (
                            <p className="text-xs text-rose-500 dark:text-rose-400 mt-0.5">
                                {errors.platform}
                            </p>
                        )}
                    </div>

                    <Input
                        label="Mock ID"
                        icon={<FaClipboardList />}
                        name="mockId"
                        type="text"
                        value={formData.mockId}
                        onChange={handleChange}
                        error={errors.mockId}
                        placeholder="e.g. TB-CGL-045"
                    />
                </div>
            </Section>

            {/* PERFORMANCE */}
            <Section title="Performance" icon={<FaTrophy />}>
                <div className="grid md:grid-cols-3 gap-5">
                    <Input
                        label="Total Score (0–200)"
                        icon={<FaTrophy />}
                        name="totalScore"
                        type="number"
                        min="0"
                        max="200"
                        step="0.5"
                        inputMode="decimal"
                        value={formData.totalScore}
                        onChange={handleChange}
                        error={errors.totalScore}
                        placeholder="e.g. 145.5"
                    />
                    <Input
                        label="Rank"
                        icon={<FaHashtag />}
                        name="rank"
                        type="number"
                        min="1"
                        step="1"
                        inputMode="numeric"
                        value={formData.rank}
                        onChange={handleChange}
                        error={errors.rank}
                        placeholder="e.g. 342"
                    />
                    <Input
                        label="Percentile (0–100)"
                        icon={<FaPercentage />}
                        name="percentile"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        inputMode="decimal"
                        value={formData.percentile}
                        onChange={handleChange}
                        error={errors.percentile}
                        placeholder="e.g. 97.45"
                    />
                </div>
            </Section>

            {/* SUBJECTS */}
            <Section title="Subject Scores (each out of 50)" icon={<FaBook />}>
                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-3">
                    Only whole numbers or .5 values allowed (e.g. 35 or 35.5).
                    Sum must equal Total Score.
                </p>
                <div className="grid md:grid-cols-4 gap-5">
                    <Input
                        label="English"
                        icon={<FaBook />}
                        name="englishScore"
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        inputMode="decimal"
                        value={formData.englishScore}
                        onChange={handleChange}
                        error={errors.englishScore}
                        placeholder="0–50"
                    />
                    <Input
                        label="Reasoning"
                        icon={<FaBrain />}
                        name="reasoningScore"
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        inputMode="decimal"
                        value={formData.reasoningScore}
                        onChange={handleChange}
                        error={errors.reasoningScore}
                        placeholder="0–50"
                    />
                    <Input
                        label="Quant"
                        icon={<FaCalculator />}
                        name="quantScore"
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        inputMode="decimal"
                        value={formData.quantScore}
                        onChange={handleChange}
                        error={errors.quantScore}
                        placeholder="0–50"
                    />
                    <Input
                        label="GK"
                        icon={<FaGlobeAsia />}
                        name="gkScore"
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        inputMode="decimal"
                        value={formData.gkScore}
                        onChange={handleChange}
                        error={errors.gkScore}
                        placeholder="0–50"
                    />
                </div>
            </Section>

            {/* ATTEMPTS */}
            <Section title="Attempt Statistics" icon={<FaCheckCircle />}>
                <div className="grid md:grid-cols-3 gap-5">
                    <Input
                        label="Attempted (0–100)"
                        icon={<FaCheckCircle />}
                        name="attemptedQuestions"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        inputMode="numeric"
                        value={formData.attemptedQuestions}
                        onChange={handleChange}
                        error={errors.attemptedQuestions}
                        placeholder="Max 100"
                    />
                    <Input
                        label="Correct"
                        icon={<FaCheckCircle />}
                        name="correctQuestions"
                        type="number"
                        min="0"
                        max={attempted || 100}
                        step="1"
                        inputMode="numeric"
                        value={formData.correctQuestions}
                        onChange={handleChange}
                        error={errors.correctQuestions}
                        placeholder={`Max ${attempted || 100}`}
                    />
                    <Input
                        label="Time Taken (minutes)"
                        icon={<FaClock />}
                        name="timeTaken"
                        type="number"
                        min="0"
                        max="60"
                        step="0.5"
                        inputMode="decimal"
                        value={formData.timeTaken}
                        onChange={handleChange}
                        error={errors.timeTaken}
                        placeholder="0–60"
                    />
                </div>
            </Section>

            {/* LIVE STATS */}
            <div className="grid md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl flex justify-between items-center bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900">
                    <div className="flex items-center gap-2 font-semibold text-rose-700 dark:text-rose-300">
                        <FaTimesCircle className="text-rose-500" />
                        Wrong Questions
                    </div>
                    <span className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                        {wrong}
                    </span>
                </div>

                <div className="p-5 rounded-2xl flex justify-between items-center bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900">
                    <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
                        <FaCheckCircle className="text-emerald-500" />
                        Accuracy
                    </div>
                    <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {accuracy}%
                    </span>
                </div>
            </div>

            {/* REMARKS */}
            <Section title="Remarks" icon={<FaStickyNote />}>
                <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows="4"
                    className="
            w-full px-4 py-3 rounded-xl
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-700
            text-slate-800 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            shadow-sm transition
          "
                    placeholder="Add remarks about this mock..."
                />
            </Section>

            {/* SUBMIT / CANCEL */}
            <div
                className={`flex gap-3 ${isEditing ? 'flex-col sm:flex-row' : ''}`}
            >
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="
        sm:w-auto w-full py-3 px-6 rounded-xl
        border border-slate-300 dark:border-slate-700
        bg-white dark:bg-slate-900
        text-slate-700 dark:text-slate-200
        font-semibold hover:bg-slate-50 dark:hover:bg-slate-800
        shadow-sm transition active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed
    "
                    >
                        Cancel Edit
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
        flex-1 py-3 rounded-xl
        bg-linear-to-r from-indigo-600 via-blue-600 to-sky-600
        hover:from-indigo-700 hover:to-sky-700
        text-white font-bold
        shadow-lg transition active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
        flex items-center justify-center gap-2
    "
                >
                    {isSubmitting && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {isSubmitting
                        ? isEditing
                            ? 'Updating...'
                            : 'Saving...'
                        : isEditing
                          ? 'Update Mock'
                          : 'Save Mock'}
                </button>
            </div>
        </form>
    );
};

export default MockForm;
