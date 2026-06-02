import { Head, Link, useForm } from '@inertiajs/react';
import CreatorLayout from '@/Layouts/CreatorLayout';
import {
    estimatedDurationForStore,
    formatEstimatedDurationLabel,
} from '@/utils/estimatedDuration';

export default function Create() {
    const { data, setData, post, processing, errors, transform } = useForm({
        title: '',
        description: '',
        category: '',
        difficulty: 'Beginner',
        estimated_duration: '',
        learning_objectives: '',
        prerequisites: '',
        tags: [],
    });

    transform((formData) => ({
        ...formData,
        estimated_duration: estimatedDurationForStore(formData.estimated_duration),
    }));

    const durationPreview = formatEstimatedDurationLabel(data.estimated_duration);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('creator.certifications.store'));
    };

    return (
        <CreatorLayout activeNav="shells" pageTitle="Create new shell">
            <Head title="Create New Shell" />

            <div className="admin-card admin-card--chunky">
                <div className="admin-card__header">
                    <h3>Shell request</h3>
                    <Link href={route('creator.certifications.index')} className="admin-btn admin-btn--ghost admin-btn--sm">Back to shells</Link>
                </div>
                <form onSubmit={handleSubmit} className="admin-card__body">
                    <label className="admin-field">
                        <span className="admin-field__label">Title *</span>
                        <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className="input-field" required />
                        {errors.title ? <p className="admin-field__hint" style={{ color: 'var(--admin-danger-text)' }}>{errors.title}</p> : null}
                    </label>

                    <div className="admin-form-grid">
                        <label className="admin-field">
                            <span className="admin-field__label">Category *</span>
                            <select value={data.category} onChange={(e) => setData('category', e.target.value)} className="input-field" required>
                                <option value="">Select category</option>
                                <option value="Technology">Technology</option>
                                <option value="Business">Business</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </label>
                        <label className="admin-field">
                            <span className="admin-field__label">Difficulty *</span>
                            <select value={data.difficulty} onChange={(e) => setData('difficulty', e.target.value)} className="input-field" required>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </label>
                    </div>

                    <label className="admin-field">
                        <span className="admin-field__label">Description *</span>
                        <textarea rows={4} value={data.description} onChange={(e) => setData('description', e.target.value)} className="input-field" required />
                    </label>

                    <label className="admin-field">
                        <span className="admin-field__label">Estimated time (hours)</span>
                        <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={data.estimated_duration}
                            onChange={(e) => setData('estimated_duration', e.target.value)}
                            className="input-field"
                            placeholder="e.g. 120"
                        />
                        {durationPreview ? (
                            <p className="admin-field__hint">
                                Displays as: <strong>{durationPreview}</strong>
                            </p>
                        ) : (
                            <p className="admin-field__hint">Enter hours to see how learners will see the duration (e.g. 120 hours · ≈ 3 weeks at 40 hrs/week).</p>
                        )}
                    </label>

                    <label className="admin-field">
                        <span className="admin-field__label">Learning objectives</span>
                        <textarea rows={3} value={data.learning_objectives} onChange={(e) => setData('learning_objectives', e.target.value)} className="input-field" placeholder="What will students learn?" />
                    </label>

                    <div className="admin-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <Link href={route('creator.certifications.index')} className="admin-btn admin-btn--ghost">Cancel</Link>
                        <button type="submit" disabled={processing} className="admin-btn admin-btn--primary">
                            {processing ? 'Creating…' : 'Save & continue'}
                        </button>
                    </div>
                </form>
            </div>
        </CreatorLayout>
    );
}
