import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionButtonLabel?: string;
  onAction?: () => void;
}

export default function PageHeader({ title, description, actionButtonLabel, onAction }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{title}</h1>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      {actionButtonLabel && (
        <button 
          onClick={onAction}
          className="px-5 py-2.5 bg-[#1F6559] hover:bg-[#154d43] transition-colors text-white rounded-xl text-sm font-semibold shadow-sm"
        >
          {actionButtonLabel}
        </button>
      )}
    </div>
  );
}
