import type { Metadata } from 'next';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';

export const metadata: Metadata = {
  title: 'Pipeline — Podcast Guest CRM',
};

export default function PipelinePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Guest Pipeline</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Drag guests between stages. Confetti fires on every confirmed booking.
        </p>
      </div>
      <KanbanBoard />
    </div>
  );
}
