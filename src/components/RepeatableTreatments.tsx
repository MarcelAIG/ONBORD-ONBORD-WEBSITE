import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface TreatmentItem {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
}

interface RepeatableTreatmentsProps {
  treatments: TreatmentItem[];
  onChange: (treatments: TreatmentItem[]) => void;
}

export function RepeatableTreatments({ treatments, onChange }: RepeatableTreatmentsProps) {
  const addTreatment = () => {
    const newItem: TreatmentItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      duration: '',
      price: '',
      description: '',
    };
    onChange([...treatments, newItem]);
  };

  const removeTreatment = (id: string) => {
    onChange(treatments.filter((t) => t.id !== id));
  };

  const updateTreatment = (id: string, field: keyof TreatmentItem, value: string) => {
    onChange(
      treatments.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-zinc-200">
            Manual Treatment & Price Entry
          </label>
          <p className="text-xs text-zinc-500 mt-1">
            Add all the massages and treatments you offer with their durations and prices.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {treatments.map((treatment, index) => (
          <div
            key={treatment.id}
            className="p-4 sm:p-5 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-4 relative"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Treatment #{index + 1}
              </span>
              {treatments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTreatment(treatment.id)}
                  className="inline-flex items-center space-x-1 text-xs text-zinc-400 hover:text-red-400 transition-colors p-1 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Treatment / Massage Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Traditional Thai Massage"
                  value={treatment.name}
                  onChange={(e) => updateTreatment(treatment.id, 'name', e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 60 min, 90 min"
                  value={treatment.duration}
                  onChange={(e) => updateTreatment(treatment.id, 'duration', e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 70€ / 100€"
                  value={treatment.price}
                  onChange={(e) => updateTreatment(treatment.id, 'price', e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Short Description (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Optional details, benefits, or focus areas..."
                value={treatment.description}
                onChange={(e) => updateTreatment(treatment.id, 'description', e.target.value)}
                className="flex w-full rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors resize-y"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addTreatment}
        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-200 text-sm font-medium transition-colors"
      >
        <Plus className="w-4 h-4 text-red-500" />
        <span>+ Add Another Treatment</span>
      </button>
    </div>
  );
}
