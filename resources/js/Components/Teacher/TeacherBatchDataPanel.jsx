import { router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function TeacherBatchDataPanel({ batches = [], certificationId }) {
    const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id ?? '');

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

            <div className="teacher-batch-data__controls">
                <div className="teacher-batch-data__select-wrap">
                    <ChevronDown size={16} aria-hidden="true" className="teacher-batch-data__select-icon" />
                    <select
                        className="teacher-batch-data__select"
                        value={selectedBatchId}
                        onChange={(event) => setSelectedBatchId(Number(event.target.value))}
                        aria-label="Select batch purchase date"
                    >
                        {batches.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                                {batch.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="button" className="teacher-batch-data__proceed" onClick={handleProceed} disabled={!selectedBatchId}>
                    Proceed
                </button>
            </div>
        </section>
    );
}
