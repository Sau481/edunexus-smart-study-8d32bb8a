import { motion } from 'framer-motion';
import { Users, Megaphone, MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAnnouncements, mockQuestions } from '@/data/mockData';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface CommunitySectionProps {
  chapterId: string;
  userRole: UserRole;
}

export const CommunitySection = ({ chapterId, userRole }: CommunitySectionProps) => {
  const isTeacher = userRole === 'teacher';
  // Filter public questions with answers
  const publicQA = mockQuestions.filter(
    (q) => q.visibility === 'public' && q.answer
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Community</h2>
      </div>

      <Tabs defaultValue="announcements">
        <TabsList>
          <TabsTrigger value="announcements" className="gap-2">
            <Megaphone className="h-4 w-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="qa" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Public Q&A
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="mt-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {mockAnnouncements.map((announcement) => (
              <motion.div key={announcement.id} variants={item}>
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {announcement.content}
                        </p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(announcement.createdAt)}
                          </span>
                          <span>By {announcement.authorName}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {mockAnnouncements.length === 0 && (
              <Card className="p-8 text-center">
                <Megaphone className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No announcements</h3>
                <p className="text-muted-foreground">
                  Announcements from your teacher will appear here.
                </p>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="qa" className="mt-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {publicQA.length > 0 ? (
              publicQA.map((question) => (
                <motion.div key={question.id} variants={item}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{question.authorName}</span>
                            <span className="text-xs text-muted-foreground">asked</span>
                          </div>
                          <p className="text-foreground">{question.text}</p>
                        </div>

                        <div className="p-3 bg-secondary rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-primary">{question.answeredBy}</span>
                            <span className="text-xs text-muted-foreground">answered</span>
                          </div>
                          <p className="text-sm">{question.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No public Q&A yet</h3>
                <p className="text-muted-foreground">
                  Answered public questions will appear here for everyone to see.
                </p>
              </Card>
            )}
          </motion.div>

          {!isTeacher && publicQA.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground text-center mt-4"
            >
              Students can view Q&A but cannot reply. Use the "Ask" section to submit your questions.
            </motion.p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
