import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, BookOpen, FileText, CheckCircle, XCircle, MessageSquare, Loader2, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/common/StatusBadge';
import { mockClassrooms, mockNotes, mockQuestions } from '@/data/mockData';
import { Classroom, Note, Question, Subject, Chapter } from '@/types';

interface TeacherDashboardProps {
  onSelectClassroom: (classroom: Classroom) => void;
}

// Available subjects to choose from
const availableSubjects = [
  { id: 'set', name: 'Software Engineering & Testing', icon: '🧪' },
  { id: 'cn', name: 'Computer Networks', icon: '🌐' },
  { id: 'dsa', name: 'Data Structures & Algorithms', icon: '📊' },
  { id: 'ml', name: 'Machine Learning', icon: '🤖' },
  { id: 'dbms', name: 'Database Management Systems', icon: '🗄️' },
  { id: 'os', name: 'Operating Systems', icon: '💻' },
];

interface SubjectConfig {
  subjectId: string;
  units: number;
}

export const TeacherDashboard = ({ onSelectClassroom }: TeacherDashboardProps) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockClassrooms);
  const [pendingNotes] = useState<Note[]>(mockNotes.filter(n => n.status === 'pending'));
  const [pendingQuestions] = useState<Question[]>(mockQuestions.filter(q => !q.answer));
  const [newClassroomName, setNewClassroomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Subject configuration state
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectConfig[]>([]);
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [currentUnits, setCurrentUnits] = useState<string>('4');

  const handleAddSubject = () => {
    if (!currentSubject || selectedSubjects.some(s => s.subjectId === currentSubject)) return;
    
    setSelectedSubjects([
      ...selectedSubjects,
      { subjectId: currentSubject, units: parseInt(currentUnits) || 4 }
    ]);
    setCurrentSubject('');
    setCurrentUnits('4');
  };

  const handleRemoveSubject = (subjectId: string) => {
    setSelectedSubjects(selectedSubjects.filter(s => s.subjectId !== subjectId));
  };

  const handleCreateClassroom = async () => {
    if (!newClassroomName.trim()) return;
    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create subjects with chapters based on configuration
    const subjects: Subject[] = selectedSubjects.map((config, idx) => {
      const subjectInfo = availableSubjects.find(s => s.id === config.subjectId);
      const chapters: Chapter[] = Array.from({ length: config.units }, (_, i) => ({
        id: `ch-new-${Date.now()}-${idx}-${i}`,
        name: `Unit ${i + 1}`,
        subjectId: `subj-new-${Date.now()}-${idx}`,
        noteCount: 0,
        order: i + 1,
      }));

      return {
        id: `subj-new-${Date.now()}-${idx}`,
        name: subjectInfo?.name || 'Unknown Subject',
        classroomId: `class-${Date.now()}`,
        icon: subjectInfo?.icon || '📚',
        chapters,
      };
    });

    const newClassroom: Classroom = {
      id: `class-${Date.now()}`,
      name: newClassroomName,
      code: newClassroomName.replace(/\s+/g, '').toUpperCase().slice(0, 6) + Math.random().toString(36).slice(-2).toUpperCase(),
      teacherId: 'teacher-1',
      teacherName: 'Dr. Sarah Miller',
      studentCount: 0,
      subjects,
      createdAt: new Date().toISOString(),
    };
    
    setClassrooms([newClassroom, ...classrooms]);
    setNewClassroomName('');
    setSelectedSubjects([]);
    setIsCreating(false);
    setCreateDialogOpen(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 sm:px-6 py-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Create Classroom Section */}
          <motion.section variants={item}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5 text-primary" />
                      Manage Classrooms
                    </CardTitle>
                    <CardDescription>Create and manage your classrooms</CardDescription>
                  </div>
                  <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Classroom
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Create New Classroom</DialogTitle>
                        <DialogDescription>
                          Set up your classroom with subjects and units
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Classroom Name</Label>
                          <Input
                            id="name"
                            placeholder="e.g., Computer Science 2024"
                            value={newClassroomName}
                            onChange={(e) => setNewClassroomName(e.target.value)}
                          />
                        </div>

                        {/* Add Subject Section */}
                        <div className="space-y-3">
                          <Label>Add Subjects</Label>
                          <div className="flex gap-2">
                            <Select value={currentSubject} onValueChange={setCurrentSubject}>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableSubjects
                                  .filter(s => !selectedSubjects.some(sel => sel.subjectId === s.id))
                                  .map((subject) => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                      {subject.icon} {subject.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <Select value={currentUnits} onValueChange={setCurrentUnits}>
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Units" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? 'Unit' : 'Units'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={handleAddSubject}
                              disabled={!currentSubject}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Selected Subjects List */}
                        {selectedSubjects.length > 0 && (
                          <div className="space-y-2">
                            <Label>Selected Subjects</Label>
                            <div className="space-y-2">
                              {selectedSubjects.map((config) => {
                                const subjectInfo = availableSubjects.find(s => s.id === config.subjectId);
                                return (
                                  <div
                                    key={config.subjectId}
                                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span>{subjectInfo?.icon}</span>
                                      <span className="text-sm font-medium">{subjectInfo?.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        ({config.units} {config.units === 1 ? 'unit' : 'units'})
                                      </span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveSubject(config.subjectId)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateClassroom} disabled={isCreating || !newClassroomName}>
                          {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {classrooms.map((classroom) => (
                    <motion.div
                      key={classroom.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => onSelectClassroom(classroom)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{classroom.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <BookOpen className="h-4 w-4" />
                              {classroom.subjects.length} subjects
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              {classroom.studentCount}
                            </span>
                          </div>
                          <div className="mt-3 text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded w-fit">
                            Code: {classroom.code}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Approval & Questions Tabs */}
          <motion.section variants={item}>
            <Tabs defaultValue="approvals">
              <TabsList>
                <TabsTrigger value="approvals" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Pending Approvals
                  {pendingNotes.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-destructive/20 text-destructive rounded-full">
                      {pendingNotes.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="questions" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Questions
                  {pendingQuestions.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-edu-warning/20 text-edu-warning rounded-full">
                      {pendingQuestions.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="approvals" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="text-left p-4 font-medium">Note</th>
                            <th className="text-left p-4 font-medium hidden sm:table-cell">Author</th>
                            <th className="text-left p-4 font-medium hidden md:table-cell">Chapter</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-right p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingNotes.length > 0 ? (
                            pendingNotes.map((note) => (
                              <tr key={note.id} className="border-b border-border last:border-0">
                                <td className="p-4">
                                  <span className="font-medium">{note.title}</span>
                                </td>
                                <td className="p-4 hidden sm:table-cell text-muted-foreground">
                                  {note.authorName}
                                </td>
                                <td className="p-4 hidden md:table-cell text-muted-foreground">
                                  {note.chapterName || 'N/A'}
                                </td>
                                <td className="p-4">
                                  <StatusBadge status={note.status} />
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button size="sm" variant="ghost" className="text-edu-success hover:text-edu-success">
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                No pending notes to approve.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {pendingQuestions.length > 0 ? (
                        pendingQuestions.map((question) => (
                          <div key={question.id} className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-medium">{question.text}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Asked by {question.authorName} • {question.visibility}
                                </p>
                              </div>
                              <Button size="sm">Answer</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          No unanswered questions.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};
