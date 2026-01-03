import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Send, Eye, EyeOff, Loader2, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { mockQuestions } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { QuestionVisibility, Question } from '@/types';
import { cn } from '@/lib/utils';

interface AskSectionProps {
  chapterId: string;
}

export const AskSection = ({ chapterId }: AskSectionProps) => {
  const { user } = useAuth();
  const [questionText, setQuestionText] = useState('');
  const [visibility, setVisibility] = useState<QuestionVisibility>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter questions based on visibility and user
  const myQuestions = mockQuestions.filter(
    (q) => q.chapterId === chapterId && (q.visibility === 'public' || q.authorId === user?.id)
  );

  const handleSubmit = async () => {
    if (!questionText.trim()) return;
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setQuestionText('');
  };

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

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      {/* Questions List */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Questions & Answers
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {myQuestions.length > 0 ? (
            myQuestions.map((question) => (
              <motion.div key={question.id} variants={item}>
                <Card className={cn(
                  question.visibility === 'private' && 'border-edu-warning/30'
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">{question.authorName}</span>
                          {question.visibility === 'private' && (
                            <span className="flex items-center gap-1 text-xs text-edu-warning">
                              <EyeOff className="h-3 w-3" />
                              Private
                            </span>
                          )}
                        </div>
                        <p className="text-foreground">{question.text}</p>
                        
                        {question.answer ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 p-3 bg-secondary rounded-lg"
                          >
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Answer by {question.answeredBy}
                            </p>
                            <p className="text-sm">{question.answer}</p>
                          </motion.div>
                        ) : (
                          <p className="mt-2 text-sm text-muted-foreground italic">
                            Awaiting response...
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="p-8 text-center">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No questions yet</h3>
              <p className="text-muted-foreground">
                Be the first to ask a question about this chapter.
              </p>
            </Card>
          )}
        </motion.div>
      </motion.div>

      {/* Ask Question Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HelpCircle className="h-5 w-5 text-primary" />
              Ask a Question
            </CardTitle>
            <CardDescription>
              Get help from your teacher
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Your Question</Label>
              <Textarea
                id="question"
                placeholder="What would you like to know about this chapter?"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label>Visibility</Label>
              <RadioGroup
                value={visibility}
                onValueChange={(v) => setVisibility(v as QuestionVisibility)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="q-public" />
                  <Label htmlFor="q-public" className="flex items-center gap-2 cursor-pointer">
                    <Eye className="h-4 w-4 text-edu-teal" />
                    Public
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="q-private" />
                  <Label htmlFor="q-private" className="flex items-center gap-2 cursor-pointer">
                    <EyeOff className="h-4 w-4" />
                    Private
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                {visibility === 'public'
                  ? 'Everyone can see this question and the answer.'
                  : 'Only you and the teacher will see this question.'}
              </p>
            </div>

            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={isSubmitting || !questionText.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Question
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
