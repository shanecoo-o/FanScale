import React from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import { Story } from '../types';

interface StoriesReelProps {
  stories: Story[];
  onSelectStory: (storyIndex: number) => void;
  onOpenCreateStory: () => void;
}

export const StoriesReel: React.FC<StoriesReelProps> = ({
  stories,
  onSelectStory,
  onOpenCreateStory,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-pink-100 bg-white p-3.5 shadow-sm">
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        
        {/* Your Story button */}
        <button
          type="button"
          className="flex flex-shrink-0 flex-col items-center gap-1.5 rounded-xl"
          onClick={onOpenCreateStory}
          aria-label="Criar story"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-pink-300 bg-pink-50/60 p-0.5 hover:border-pink-500 transition-colors">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              alt="O teu Story"
              className="h-full w-full rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-white shadow-md ring-2 ring-white">
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="max-w-[70px] truncate text-[11px] font-semibold text-stone-700">
            O teu story
          </span>
        </button>

        {/* Stories from creators */}
        {stories.map((story, index) => (
          <button
            key={story.id}
            onClick={() => onSelectStory(index)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 focus:outline-none group text-left"
          >
            <div
              className={`relative flex h-16 w-16 items-center justify-center rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                story.hasUnseen
                  ? 'bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 p-[2.5px] shadow-sm shadow-pink-500/20'
                  : 'bg-stone-200 p-[1.5px]'
              }`}
            >
              <div className="h-full w-full rounded-full bg-white p-0.5">
                <img
                  src={story.creator.avatar}
                  alt={story.creator.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              {story.creator.verified && (
                <div className="absolute bottom-0 right-0 rounded-full bg-white text-pink-600">
                  <CheckCircle className="h-3.5 w-3.5 fill-pink-600 text-white" />
                </div>
              )}
            </div>
            <span className="max-w-[68px] truncate text-[11px] font-medium text-stone-700 group-hover:text-pink-600 transition-colors">
              {story.creator.username.replace('.moz', '')}
            </span>
          </button>
        ))}

      </div>
    </div>
  );
};
