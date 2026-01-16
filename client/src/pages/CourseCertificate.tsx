import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, CheckCircle, Trophy, Calendar, Hash, User, BookOpen, ExternalLink } from "lucide-react";

const COURSE_INFO: Record<string, { name: string; topics: number }> = {
  "coding-style": { name: "C# Coding Style Guide", topics: 5 },
  "commenting": { name: "The Fine Art of Commenting", topics: 4 },
  "technical-writing": { name: "Technical Writing Made Easier", topics: 5 },
};

export default function CourseCertificate() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: certificates, refetch: refetchCertificates } = trpc.certificates.getUserCertificates.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: allProgress } = trpc.progress.getCourseProgress.useQuery(undefined, { enabled: !!user });
  
  const issueCertificate = trpc.certificates.issue.useMutation({
    onSuccess: () => {
      refetchCertificates();
    },
  });

  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  // Check which courses are eligible for certificates
  const getEligibleCourses = () => {
    if (!allProgress) return [];
    
    return Object.entries(COURSE_INFO).map(([courseId, info]) => {
      const progress = allProgress.find(p => p.courseId === courseId);
      const hasCertificate = certificates?.some(c => c.courseId === courseId);
      const isComplete = progress && progress.topicsCompleted >= info.topics;
      
      return {
        courseId,
        courseName: info.name,
        totalTopics: info.topics,
        progress,
        hasCertificate,
        isComplete,
        certificate: certificates?.find(c => c.courseId === courseId),
      };
    });
  };

  const eligibleCourses = getEligibleCourses();

  const handleIssueCertificate = async (courseId: string, courseName: string, progress: any) => {
    await issueCertificate.mutateAsync({
      courseId,
      courseName,
      topicsCompleted: progress.topicsCompleted,
      quizzesPassed: progress.quizzesPassed,
      averageScore: progress.averageScore || 0,
    });
  };

  const generateCertificateSVG = (cert: any) => {
    const date = new Date(cert.issuedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fefce8;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#fef3c7;stop-opacity:1" />
          </linearGradient>
          <pattern id="pattern" patternUnits="userSpaceOnUse" width="40" height="40">
            <circle cx="20" cy="20" r="1" fill="#d97706" opacity="0.1"/>
          </pattern>
        </defs>
        
        <!-- Background -->
        <rect width="800" height="600" fill="url(#bg)"/>
        <rect width="800" height="600" fill="url(#pattern)"/>
        
        <!-- Border -->
        <rect x="20" y="20" width="760" height="560" fill="none" stroke="#b45309" stroke-width="3"/>
        <rect x="30" y="30" width="740" height="540" fill="none" stroke="#d97706" stroke-width="1"/>
        
        <!-- Corner decorations -->
        <path d="M40,40 L80,40 L40,80 Z" fill="#b45309"/>
        <path d="M760,40 L720,40 L760,80 Z" fill="#b45309"/>
        <path d="M40,560 L80,560 L40,520 Z" fill="#b45309"/>
        <path d="M760,560 L720,560 L760,520 Z" fill="#b45309"/>
        
        <!-- Header -->
        <text x="400" y="80" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#78350f" letter-spacing="4">CERTIFICATE OF COMPLETION</text>
        
        <!-- Award icon -->
        <circle cx="400" cy="140" r="35" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>
        <text x="400" y="150" text-anchor="middle" font-size="30">🏆</text>
        
        <!-- Main text -->
        <text x="400" y="210" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#78350f">This is to certify that</text>
        
        <text x="400" y="260" text-anchor="middle" font-family="Georgia, serif" font-size="32" fill="#1e3a5f" font-weight="bold">${cert.userName}</text>
        
        <line x1="200" y1="275" x2="600" y2="275" stroke="#d97706" stroke-width="1"/>
        
        <text x="400" y="310" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#78350f">has successfully completed the course</text>
        
        <text x="400" y="360" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#b45309" font-weight="bold">${cert.courseName}</text>
        
        <!-- Stats -->
        <text x="400" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#78350f">
          Topics Completed: ${cert.topicsCompleted} | Quizzes Passed: ${cert.quizzesPassed} | Average Score: ${cert.averageScore}%
        </text>
        
        <!-- Date and Certificate Number -->
        <text x="400" y="480" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#78350f">Issued on ${date}</text>
        <text x="400" y="500" text-anchor="middle" font-family="monospace" font-size="10" fill="#92400e">Certificate No: ${cert.certificateNumber}</text>
        
        <!-- Signature line -->
        <line x1="280" y1="540" x2="520" y2="540" stroke="#78350f" stroke-width="1"/>
        <text x="400" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="#78350f">Ask Marilyn About Software Testing</text>
      </svg>
    `;
  };

  const downloadCertificate = (cert: any) => {
    const svg = generateCertificateSVG(cert);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${cert.certificateNumber}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-8 text-center">
            <Award className="w-16 h-16 mx-auto text-yellow-600 mb-4" />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">Sign In Required</h2>
            <p className="text-yellow-700">Please sign in to view and download your course certificates.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Award className="w-10 h-10 text-yellow-600" />
          <h1 className="text-4xl font-bold text-slate-800">Course Certificates</h1>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Complete all quizzes in a course to earn your certificate. Download and share your achievements!
        </p>
      </div>

      {/* Course Progress & Certificates */}
      <div className="grid gap-6">
        {eligibleCourses.map(({ courseId, courseName, totalTopics, progress, hasCertificate, isComplete, certificate }) => (
          <Card key={courseId} className={`${hasCertificate ? 'bg-green-50 border-green-200' : isComplete ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-200'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {hasCertificate ? (
                    <div className="p-2 bg-green-100 rounded-full">
                      <Trophy className="w-6 h-6 text-green-600" />
                    </div>
                  ) : isComplete ? (
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                  ) : (
                    <div className="p-2 bg-slate-100 rounded-full">
                      <BookOpen className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{courseName}</CardTitle>
                    <CardDescription>
                      {progress ? `${progress.topicsCompleted}/${totalTopics} topics completed` : `0/${totalTopics} topics completed`}
                    </CardDescription>
                  </div>
                </div>
                
                {hasCertificate && certificate && (
                  <Button 
                    onClick={() => downloadCertificate(certificate)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                )}
                
                {!hasCertificate && isComplete && progress && (
                  <Button 
                    onClick={() => handleIssueCertificate(courseId, courseName, progress)}
                    disabled={issueCertificate.isPending}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    {issueCertificate.isPending ? 'Issuing...' : 'Claim Certificate'}
                  </Button>
                )}
              </div>
            </CardHeader>
            
            {hasCertificate && certificate && (
              <CardContent>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Certificate:</span>
                      <span className="font-mono text-xs">{certificate.certificateNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Issued:</span>
                      <span>{new Date(certificate.issuedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Score:</span>
                      <span>{certificate.averageScore}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Name:</span>
                      <span>{certificate.userName}</span>
                    </div>
                  </div>
                  
                  {/* Certificate Preview */}
                  <div className="mt-4 border border-yellow-200 rounded-lg overflow-hidden">
                    <div 
                      className="w-full"
                      dangerouslySetInnerHTML={{ __html: generateCertificateSVG(certificate) }}
                    />
                  </div>
                </div>
              </CardContent>
            )}
            
            {!isComplete && (
              <CardContent>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm">
                        Complete {totalTopics - (progress?.topicsCompleted || 0)} more topic{totalTopics - (progress?.topicsCompleted || 0) !== 1 ? 's' : ''} to earn this certificate
                      </p>
                      {progress && (
                        <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all"
                            style={{ width: `${(progress.topicsCompleted / totalTopics) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <Button variant="outline" asChild>
                      <a href={`/${courseId === 'coding-style' ? 'coding-style-guide' : courseId === 'commenting' ? 'commenting-guide' : 'technical-writing-guide'}`}>
                        Continue Course
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* All Certificates Summary */}
      {certificates && certificates.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600">{certificates.length}</div>
                <div className="text-sm text-slate-600">Certificates Earned</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                <div className="text-3xl font-bold text-green-600">
                  {certificates.reduce((sum, c) => sum + c.topicsCompleted, 0)}
                </div>
                <div className="text-sm text-slate-600">Total Topics Completed</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(certificates.reduce((sum, c) => sum + c.averageScore, 0) / certificates.length)}%
                </div>
                <div className="text-sm text-slate-600">Average Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
