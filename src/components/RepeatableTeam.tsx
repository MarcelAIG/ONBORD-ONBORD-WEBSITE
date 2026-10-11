import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  description: string;
}

interface RepeatableTeamProps {
  members: TeamMemberItem[];
  onChange: (members: TeamMemberItem[]) => void;
}

export function RepeatableTeam({ members, onChange }: RepeatableTeamProps) {
  const addMember = () => {
    const newMember: TeamMemberItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      role: '',
      description: '',
    };
    onChange([...members, newMember]);
  };

  const removeMember = (id: string) => {
    onChange(members.filter((m) => m.id !== id));
  };

  const updateMember = (id: string, field: keyof TeamMemberItem, value: string) => {
    onChange(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-zinc-200">
            Team Members
          </label>
          <p className="text-xs text-zinc-500 mt-1">
            Add therapists and staff you want presented on the website. Photos can be uploaded in the Photos section below.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {members.map((member, index) => (
          <div
            key={member.id}
            className="p-4 sm:p-5 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-4 relative"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Therapist / Team Member #{index + 1}
              </span>
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(member.id)}
                  className="inline-flex items-center space-x-1 text-xs text-zinc-400 hover:text-red-400 transition-colors p-1 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Somchai, Maria"
                  value={member.name}
                  onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                  className="flex h-11 sm:h-10 w-full rounded-xl sm:rounded-lg border border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Role / Speciality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Thai Practitioner, Deep Tissue Specialist"
                  value={member.role}
                  onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                  className="flex h-11 sm:h-10 w-full rounded-xl sm:rounded-lg border border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Short Description (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Experience, certifications, background, or personal approach..."
                value={member.description}
                onChange={(e) => updateMember(member.id, 'description', e.target.value)}
                className="flex w-full rounded-xl sm:rounded-lg border border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors resize-y"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addMember}
        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-3 sm:py-2.5 rounded-xl border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800/80 active:bg-zinc-800 text-zinc-200 text-sm font-medium transition-colors min-h-[44px]"
      >
        <Plus className="w-4 h-4 text-red-500" />
        <span>+ Add Another Team Member</span>
      </button>
    </div>
  );
}
