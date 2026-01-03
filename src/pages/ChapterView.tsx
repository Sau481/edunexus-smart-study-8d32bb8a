import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, BookOpen, Upload, HelpCircle, Users } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Chapter, ChapterSection } from '@/types';
import { NotesSection } from '@/components/chapter/NotesSection';
import { NotebookSection } from '@/components/chapter/NotebookSection';
import { UploadSection } from '@/components/chapter/UploadSection';
import { AskSection } from '@/components/chapter/AskSection';
import { CommunitySection } from '@/components/chapter/CommunitySection';
import { cn } from '@/lib/utils';

interface ChapterViewProps {
  chapter: Chapter;
  onBack: () => void;
}

export const ChapterView = ({ chapter, onBack }: ChapterViewProps) => {
  const [activeSection, setActiveSection] = useState<ChapterSection>('notes');

  const sections = [
    { id: 'notes' as ChapterSection, label: 'Notes', icon: FileText, shortLabel: 'N' },
    { id: 'notebook' as ChapterSection, label: 'Notebook', icon: BookOpen, shortLabel: 'AI' },
    { id: 'upload' as ChapterSection, label: 'Upload', icon: Upload, shortLabel: 'U' },
    { id: 'ask' as ChapterSection, label: 'Ask', icon: HelpCircle, shortLabel: 'A' },
    { id: 'community' as ChapterSection, label: 'Community', icon: Users, shortLabel: 'C' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'notes':
        return <NotesSection chapterId={chapter.id} />;
      case 'notebook':
        return <NotebookSection chapterId={chapter.id} />;
      case 'upload':
        return <UploadSection chapterId={chapter.id} />;
      case 'ask':
        return <AskSection chapterId={chapter.id} />;
      case 'community':
        return <CommunitySection chapterId={chapter.id} />;
      default:
        return <NotesSection chapterId={chapter.id} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBack onBack={onBack} title={chapter.name} />

      <main className="container px-4 sm:px-6 py-6">
        {/* Section Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6 overflow-x-auto pb-2"
        >
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'gap-2 shrink-0 transition-all',
                activeSection === section.id && 'shadow-md'
              )}
            >
              <section.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{section.label}</span>
              <span className="sm:hidden">{section.shortLabel}</span>
            </Button>
          ))}
        </motion.div>

        {/* Active Section Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
