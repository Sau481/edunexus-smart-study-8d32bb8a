import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Classroom, Subject } from '@/types';

interface ClassroomViewProps {
  classroom: Classroom;
  onBack: () => void;
  onSelectSubject: (subject: Subject) => void;
}

export const ClassroomView = ({ classroom, onBack, onSelectSubject }: ClassroomViewProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBack onBack={onBack} title={classroom.name} />

      <main className="container px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold">{classroom.name}</h1>
          <p className="text-muted-foreground mt-1">
            {classroom.subjects.length} subjects • {classroom.studentCount} students
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {classroom.subjects.map((subject) => (
            <motion.div key={subject.id} variants={item}>
              <Card
                className="cursor-pointer hover:border-primary/50 hover:bg-surface-hover transition-all group"
                onClick={() => onSelectSubject(subject)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-base">
                    <span className="text-2xl">{subject.icon || '📚'}</span>
                    <span className="flex-1">{subject.name}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    {subject.chapters.length} chapters
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {subject.chapters.slice(0, 3).map((chapter, idx) => (
                      <span
                        key={chapter.id}
                        className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground"
                      >
                        Unit {idx + 1}
                      </span>
                    ))}
                    {subject.chapters.length > 3 && (
                      <span className="text-xs px-2 py-1 text-muted-foreground">
                        +{subject.chapters.length - 3} more
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {classroom.subjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No subjects yet</h3>
            <p className="text-muted-foreground">Subjects will appear here once added by the teacher.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};
