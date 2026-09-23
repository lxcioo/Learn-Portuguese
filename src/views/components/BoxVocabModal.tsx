import React from 'react';
import { X, Volume2 } from 'lucide-react';
import { Exercise } from '@/src/models/types';
import { speakPortuguese } from '@/src/utils/audio';

interface BoxVocabModalProps {
  boxLabel: string;
  boxIndex: number;
  exercises: Exercise[];
  onClose: () => void;
}

export const BoxVocabModal: React.FC<BoxVocabModalProps> = ({
  boxLabel,
  boxIndex,
  exercises,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[80vh] bg-white dark:bg-[#232526] rounded-3xl shadow-2xl border border-gray-200 dark:border-[#333] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-[#333] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Box {boxIndex}: {boxLabel}
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              {exercises.length} {exercises.length === 1 ? 'Vokabel' : 'Vokabeln'} in dieser Stufe
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {exercises.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              Keine Vokabeln in dieser Box.
            </div>
          ) : (
            exercises.map((ex, idx) => (
              <div
                key={`${ex.id}-${idx}`}
                className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#1a1b1c] border border-gray-200 dark:border-[#333] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      {ex.question}
                    </span>
                    <button
                      onClick={() => speakPortuguese(ex.question)}
                      className="p-1 text-[#1cb0f6] hover:bg-[#1cb0f6]/10 rounded-full transition-colors"
                      title="Anhören"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 font-medium">
                    {ex.correctAnswer}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-[#333] bg-gray-50 dark:bg-[#1f2022] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#58cc02] text-white text-xs font-bold rounded-xl hover:bg-[#46a302] transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
