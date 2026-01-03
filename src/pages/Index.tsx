import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { StudentDashboard } from './StudentDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { ClassroomView } from './ClassroomView';
import { SubjectView } from './SubjectView';
import { ChapterView } from './ChapterView';
import { Classroom, Subject, Chapter } from '@/types';

type AppView = 'dashboard' | 'classroom' | 'subject' | 'chapter';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => setCurrentView('dashboard')} />;
  }

  const handleSelectClassroom = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setCurrentView('classroom');
  };

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentView('subject');
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setCurrentView('chapter');
  };

  const handleBackToClassroom = () => {
    setSelectedSubject(null);
    setCurrentView('classroom');
  };

  const handleBackToSubject = () => {
    setSelectedChapter(null);
    setCurrentView('subject');
  };

  const handleBackToDashboard = () => {
    setSelectedClassroom(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setCurrentView('dashboard');
  };

  if (currentView === 'chapter' && selectedChapter) {
    return <ChapterView chapter={selectedChapter} onBack={handleBackToSubject} />;
  }

  if (currentView === 'subject' && selectedSubject) {
    return <SubjectView subject={selectedSubject} onBack={handleBackToClassroom} onSelectChapter={handleSelectChapter} />;
  }

  if (currentView === 'classroom' && selectedClassroom) {
    return <ClassroomView classroom={selectedClassroom} onBack={handleBackToDashboard} onSelectSubject={handleSelectSubject} />;
  }

  return user?.role === 'teacher' 
    ? <TeacherDashboard onSelectClassroom={handleSelectClassroom} />
    : <StudentDashboard onSelectClassroom={handleSelectClassroom} />;
};

export default Index;
