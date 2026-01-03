import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Users, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Loader2,
  Megaphone,
  UserPlus,
  Trash2,
  BookMarked,
  Layers,
  Settings,
  ChevronDown,
  ChevronRight,
  Upload,
  Eye
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/common/StatusBadge';
import { mockClassrooms, mockNotes, mockQuestions, mockAnnouncements, mockSubjectTeachers } from '@/data/mockData';
import { Classroom, Note, Question, Announcement, Subject, Chapter, SubjectTeacherAccess } from '@/types';

interface TeacherDashboardProps {
  onSelectClassroom: (classroom: Classroom) => void;
}

export const TeacherDashboard = ({ onSelectClassroom }: TeacherDashboardProps) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockClassrooms);
  const [pendingNotes, setPendingNotes] = useState<Note[]>(mockNotes.filter(n => n.status === 'pending'));
  const [pendingQuestions] = useState<Question[]>(mockQuestions.filter(q => !q.answer));
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  
  // Dialog states
  const [createClassroomOpen, setCreateClassroomOpen] = useState(false);
  const [createSubjectOpen, setCreateSubjectOpen] = useState(false);
  const [createChapterOpen, setCreateChapterOpen] = useState(false);
  const [assignTeacherOpen, setAssignTeacherOpen] = useState(false);
  const [uploadNoteOpen, setUploadNoteOpen] = useState(false);
  const [postAnnouncementOpen, setPostAnnouncementOpen] = useState(false);
  const [manageClassroomOpen, setManageClassroomOpen] = useState(false);
  
  // Form states
  const [newClassroomName, setNewClassroomName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectIcon, setNewSubjectIcon] = useState('📚');
  const [newChapterName, setNewChapterName] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [expandedClassroom, setExpandedClassroom] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateClassroom = async () => {
    if (!newClassroomName.trim()) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newClassroom: Classroom = {
      id: `class-${Date.now()}`,
      name: newClassroomName,
      code: newClassroomName.replace(/\s+/g, '').toUpperCase().slice(0, 6) + Math.random().toString(36).slice(-2).toUpperCase(),
      teacherId: 'teacher-1',
      teacherName: 'Dr. Sarah Miller',
      studentCount: 0,
      subjects: [],
      subjectTeachers: [],
      createdAt: new Date().toISOString(),
    };
    
    setClassrooms([newClassroom, ...classrooms]);
    setNewClassroomName('');
    setIsLoading(false);
    setCreateClassroomOpen(false);
  };

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim() || !selectedClassroom) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newSubject: Subject = {
      id: `subj-${Date.now()}`,
      name: newSubjectName,
      classroomId: selectedClassroom,
      icon: newSubjectIcon,
      chapters: [],
    };

    setClassrooms(classrooms.map(c => 
      c.id === selectedClassroom 
        ? { ...c, subjects: [...c.subjects, newSubject] }
        : c
    ));
    
    setNewSubjectName('');
    setNewSubjectIcon('📚');
    setIsLoading(false);
    setCreateSubjectOpen(false);
  };

  const handleCreateChapter = async () => {
    if (!newChapterName.trim() || !selectedClassroom || !selectedSubject) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setClassrooms(classrooms.map(c => {
      if (c.id === selectedClassroom) {
        return {
          ...c,
          subjects: c.subjects.map(s => {
            if (s.id === selectedSubject) {
              const newChapter: Chapter = {
                id: `ch-${Date.now()}`,
                name: newChapterName,
                subjectId: selectedSubject,
                noteCount: 0,
                order: s.chapters.length + 1,
              };
              return { ...s, chapters: [...s.chapters, newChapter] };
            }
            return s;
          })
        };
      }
      return c;
    }));
    
    setNewChapterName('');
    setIsLoading(false);
    setCreateChapterOpen(false);
  };

  const handleAssignTeacher = async () => {
    if (!selectedTeacher || !selectedClassroom || !selectedSubject) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const teacher = mockSubjectTeachers.find(t => t.id === selectedTeacher);
    const classroom = classrooms.find(c => c.id === selectedClassroom);
    const subject = classroom?.subjects.find(s => s.id === selectedSubject);

    if (teacher && subject) {
      const newAccess: SubjectTeacherAccess = {
        id: `sta-${Date.now()}`,
        teacherId: teacher.id,
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        subjectId: selectedSubject,
        subjectName: subject.name,
        classroomId: selectedClassroom,
        grantedAt: new Date().toISOString(),
      };

      setClassrooms(classrooms.map(c => {
        if (c.id === selectedClassroom) {
          return {
            ...c,
            subjectTeachers: [...c.subjectTeachers, newAccess],
            subjects: c.subjects.map(s => 
              s.id === selectedSubject 
                ? { ...s, assignedTeacherId: teacher.id, assignedTeacherName: teacher.name }
                : s
            )
          };
        }
        return c;
      }));
    }
    
    setSelectedTeacher('');
    setIsLoading(false);
    setAssignTeacherOpen(false);
  };

  const handleRemoveTeacherAccess = (classroomId: string, accessId: string) => {
    setClassrooms(classrooms.map(c => {
      if (c.id === classroomId) {
        const access = c.subjectTeachers.find(st => st.id === accessId);
        return {
          ...c,
          subjectTeachers: c.subjectTeachers.filter(st => st.id !== accessId),
          subjects: c.subjects.map(s => 
            s.id === access?.subjectId 
              ? { ...s, assignedTeacherId: undefined, assignedTeacherName: undefined }
              : s
          )
        };
      }
      return c;
    }));
  };

  const handlePostAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementContent.trim() || !selectedClassroom) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: announcementTitle,
      content: announcementContent,
      classroomId: selectedClassroom,
      authorId: 'teacher-1',
      authorName: 'Dr. Sarah Miller',
      createdAt: new Date().toISOString(),
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setIsLoading(false);
    setPostAnnouncementOpen(false);
  };

  const handleUploadNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim() || !selectedClassroom || !selectedSubject) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    // Note upload simulation - in real app would add to notes list
    setNoteTitle('');
    setNoteContent('');
    setIsLoading(false);
    setUploadNoteOpen(false);
  };

  const handleApproveNote = (noteId: string) => {
    setPendingNotes(pendingNotes.filter(n => n.id !== noteId));
  };

  const handleRejectNote = (noteId: string) => {
    setPendingNotes(pendingNotes.filter(n => n.id !== noteId));
  };

  const getSubjectsForClassroom = (classroomId: string) => {
    return classrooms.find(c => c.id === classroomId)?.subjects || [];
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
          className="space-y-6"
        >
          {/* Quick Actions */}
          <motion.section variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Manage your classroom content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Dialog open={createClassroomOpen} onOpenChange={setCreateClassroomOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Classroom
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Classroom</DialogTitle>
                        <DialogDescription>Enter a name for your new classroom.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="classroomName">Classroom Name</Label>
                          <Input
                            id="classroomName"
                            placeholder="e.g., Computer Science 2024"
                            value={newClassroomName}
                            onChange={(e) => setNewClassroomName(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateClassroomOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateClassroom} disabled={isLoading || !newClassroomName}>
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={createSubjectOpen} onOpenChange={setCreateSubjectOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <BookMarked className="mr-2 h-4 w-4" />
                        Add Subject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Subject</DialogTitle>
                        <DialogDescription>Add a subject to a classroom.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Classroom</Label>
                          <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
                            <SelectTrigger><SelectValue placeholder="Select classroom" /></SelectTrigger>
                            <SelectContent>
                              {classrooms.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subjectName">Subject Name</Label>
                          <Input
                            id="subjectName"
                            placeholder="e.g., Data Structures"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subjectIcon">Icon (emoji)</Label>
                          <Input
                            id="subjectIcon"
                            placeholder="e.g., 📊"
                            value={newSubjectIcon}
                            onChange={(e) => setNewSubjectIcon(e.target.value)}
                            className="w-20"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateSubjectOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateSubject} disabled={isLoading || !newSubjectName || !selectedClassroom}>
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={createChapterOpen} onOpenChange={setCreateChapterOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Layers className="mr-2 h-4 w-4" />
                        Add Chapter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Chapter</DialogTitle>
                        <DialogDescription>Add a chapter to a subject.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Classroom</Label>
                          <Select value={selectedClassroom} onValueChange={(v) => { setSelectedClassroom(v); setSelectedSubject(''); }}>
                            <SelectTrigger><SelectValue placeholder="Select classroom" /></SelectTrigger>
                            <SelectContent>
                              {classrooms.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClassroom}>
                            <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                            <SelectContent>
                              {getSubjectsForClassroom(selectedClassroom).map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chapterName">Chapter Name</Label>
                          <Input
                            id="chapterName"
                            placeholder="e.g., Unit 1: Introduction"
                            value={newChapterName}
                            onChange={(e) => setNewChapterName(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateChapterOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateChapter} disabled={isLoading || !newChapterName || !selectedSubject}>
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={uploadNoteOpen} onOpenChange={setUploadNoteOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Notes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Notes</DialogTitle>
                        <DialogDescription>Upload notes (always public for teachers).</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Classroom</Label>
                          <Select value={selectedClassroom} onValueChange={(v) => { setSelectedClassroom(v); setSelectedSubject(''); }}>
                            <SelectTrigger><SelectValue placeholder="Select classroom" /></SelectTrigger>
                            <SelectContent>
                              {classrooms.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Subject / Chapter</Label>
                          <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClassroom}>
                            <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                            <SelectContent>
                              {getSubjectsForClassroom(selectedClassroom).map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="noteTitle">Note Title</Label>
                          <Input
                            id="noteTitle"
                            placeholder="e.g., Complete SDLC Overview"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="noteContent">Content</Label>
                          <Textarea
                            id="noteContent"
                            placeholder="Enter note content or paste text..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setUploadNoteOpen(false)}>Cancel</Button>
                        <Button onClick={handleUploadNote} disabled={isLoading || !noteTitle || !noteContent}>
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={postAnnouncementOpen} onOpenChange={setPostAnnouncementOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Megaphone className="mr-2 h-4 w-4" />
                        Post Announcement
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Post Announcement</DialogTitle>
                        <DialogDescription>Post an announcement to a classroom.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Classroom</Label>
                          <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
                            <SelectTrigger><SelectValue placeholder="Select classroom" /></SelectTrigger>
                            <SelectContent>
                              {classrooms.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="annTitle">Title</Label>
                          <Input
                            id="annTitle"
                            placeholder="e.g., Quiz Tomorrow"
                            value={announcementTitle}
                            onChange={(e) => setAnnouncementTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="annContent">Content</Label>
                          <Textarea
                            id="annContent"
                            placeholder="Enter announcement details..."
                            value={announcementContent}
                            onChange={(e) => setAnnouncementContent(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setPostAnnouncementOpen(false)}>Cancel</Button>
                        <Button onClick={handlePostAnnouncement} disabled={isLoading || !announcementTitle || !announcementContent || !selectedClassroom}>
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={assignTeacherOpen} onOpenChange={setAssignTeacherOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign Subject Teacher
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Subject Teacher</DialogTitle>
                        <DialogDescription>Give a teacher access to manage a specific subject.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Classroom</Label>
                          <Select value={selectedClassroom} onValueChange={(v) => { setSelectedClassroom(v); setSelectedSubject(''); }}>
                            <SelectTrigger><SelectValue placeholder="Select classroom" /></SelectTrigger>
                            <SelectContent>
                              {classrooms.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClassroom}>
                            <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                            <SelectContent>
                              {getSubjectsForClassroom(selectedClassroom)
                                .filter(s => !s.assignedTeacherId)
                                .map(s => (
                                  <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Teacher</Label>
                          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                            <SelectContent>
                              {mockSubjectTeachers.map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.name} ({t.email})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAssignTeacherOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssignTeacher} disabled={isLoading || !selectedTeacher || !selectedSubject}>
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assign'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Classrooms with Expandable Subjects */}
          <motion.section variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  My Classrooms
                </CardTitle>
                <CardDescription>Click a classroom to view or manage it</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classrooms.map((classroom) => (
                    <Card key={classroom.id} className="border-border/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex items-center gap-2 cursor-pointer flex-1"
                            onClick={() => setExpandedClassroom(expandedClassroom === classroom.id ? null : classroom.id)}
                          >
                            {expandedClassroom === classroom.id ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <CardTitle className="text-base">{classroom.name}</CardTitle>
                            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                              {classroom.code}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Users className="h-4 w-4" /> {classroom.studentCount}
                            </span>
                            <Button size="sm" variant="ghost" onClick={() => onSelectClassroom(classroom)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <AnimatePresence>
                        {expandedClassroom === classroom.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="pt-2 space-y-4">
                              {/* Subjects & Chapters */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <BookMarked className="h-4 w-4" /> Subjects & Chapters
                                </h4>
                                {classroom.subjects.length > 0 ? (
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {classroom.subjects.map(subject => (
                                      <div key={subject.id} className="p-3 rounded-lg bg-muted/50 border border-border/30">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-medium">{subject.icon} {subject.name}</span>
                                          <span className="text-xs text-muted-foreground">{subject.chapters.length} chapters</span>
                                        </div>
                                        {subject.assignedTeacherName && (
                                          <p className="text-xs text-primary mb-2">
                                            Assigned: {subject.assignedTeacherName}
                                          </p>
                                        )}
                                        <div className="text-xs text-muted-foreground space-y-1">
                                          {subject.chapters.slice(0, 3).map(ch => (
                                            <div key={ch.id} className="truncate">• {ch.name}</div>
                                          ))}
                                          {subject.chapters.length > 3 && (
                                            <div className="text-primary">+{subject.chapters.length - 3} more</div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground">No subjects yet. Create one using the button above.</p>
                                )}
                              </div>

                              {/* Subject Teachers */}
                              {classroom.subjectTeachers.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" /> Subject Teachers
                                  </h4>
                                  <div className="space-y-2">
                                    {classroom.subjectTeachers.map(access => (
                                      <div key={access.id} className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border/30">
                                        <div>
                                          <span className="text-sm font-medium">{access.teacherName}</span>
                                          <span className="text-xs text-muted-foreground ml-2">→ {access.subjectName}</span>
                                        </div>
                                        <Button 
                                          size="sm" 
                                          variant="ghost" 
                                          className="text-destructive hover:text-destructive"
                                          onClick={() => handleRemoveTeacherAccess(classroom.id, access.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Approvals & Questions Tabs */}
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
                  Unanswered Questions
                  {pendingQuestions.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-edu-warning/20 text-edu-warning rounded-full">
                      {pendingQuestions.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="community" className="gap-2">
                  <Megaphone className="h-4 w-4" />
                  Announcements
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
                          {pendingNotes.length > 0 ? pendingNotes.map((note) => (
                            <tr key={note.id} className="border-b border-border last:border-0">
                              <td className="p-4"><span className="font-medium">{note.title}</span></td>
                              <td className="p-4 hidden sm:table-cell text-muted-foreground">{note.authorName}</td>
                              <td className="p-4 hidden md:table-cell text-muted-foreground">{note.chapterName || 'N/A'}</td>
                              <td className="p-4"><StatusBadge status={note.status} /></td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-edu-success hover:text-edu-success"
                                    onClick={() => handleApproveNote(note.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleRejectNote(note.id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )) : (
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
                      {pendingQuestions.length > 0 ? pendingQuestions.map((question) => (
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
                      )) : (
                        <div className="p-8 text-center text-muted-foreground">
                          No unanswered questions.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="community" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Announcements</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {announcements.length > 0 ? announcements.slice(0, 5).map((ann) => (
                        <div key={ann.id} className="p-4">
                          <h4 className="font-medium">{ann.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{ann.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(ann.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )) : (
                        <div className="p-8 text-center text-muted-foreground">
                          No announcements posted yet.
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
