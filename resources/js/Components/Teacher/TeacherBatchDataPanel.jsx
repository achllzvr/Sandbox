import { router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function TeacherBatchDataPanel({ batches = [], certificationId }) {
    const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id ?? '');
    const [selectFocused, setSelectFocused] = useState(false);

    function handleProceed() {
        if (!selectedBatchId) {
            return;
        }

        router.visit(route('teacher.shells.batch', [certificationId, selectedBatchId]));
    }

    return (
        <section className="teacher-batch-data student-fade-in-up" aria-labelledby="teacher-batch-data-title">
            <h3 id="teacher-batch-data-title" className="teacher-batch-data__title">
                Batch Data
            </h3>
            <p className="teacher-batch-data__lead">Select batch purchase date to view batch data.</p>

            <div className="student-shop-toolbar teacher-batch-data__toolbar">
                <div className={`student-shop-select-wrap teacher-batch-data__select-wrap ${selectFocused ? 'is-focused' : ''}`}>
                    <ChevronDown size={16} aria-hidden="true" className="student-shop-select-wrap__icon" />
                    <select
                        className="student-shop-select"
                        value={selectedBatchId}
                        onChange={(event) => setSelectedBatchId(Number(event.target.value))}
                        onFocus={() => setSelectFocused(true)}
                        onBlur={() => setSelectFocused(false)}
                        aria-label="Select batch purchase date"
                    >
                        {batches.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                                {batch.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="button"
                    className="student-shop-btn student-shop-btn--soft teacher-batch-data__proceed-btn"
                    onClick={handleProceed}
                    disabled={!selectedBatchId}
                >
                    Proceed
                </button>
            </div>
        </section>
    );
}
