import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Mail, Phone, User, Briefcase, Users, Sparkles, TrendingUp, Shield, CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState<"personal" | "corporate">("personal");
  
  const instructorsQuery = trpc.instructor.getAll.useQuery();
  const proposalsQuery = trpc.proposal.getAll.useQuery();
  const createInquiryMutation = trpc.inquiry.create.useMutation();
  const logActivityMutation = trpc.activity.log.useMutation();

  const instructor = instructorsQuery.data?.[0];
  const personalProposal = proposalsQuery.data?.find(p => p.type === "personal");
  const corporateProposal = proposalsQuery.data?.find(p => p.type === "corporate");

  // Log page visit
  useEffect(() => {
    logActivityMutation.mutate({
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      referrer: document.referrer,
      action: "page_view",
    });
  }, []);

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await createInquiryMutation.mutateAsync({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string || undefined,
        type: inquiryType,
        message: formData.get("message") as string,
      });
      
      toast.success("문의가 성공적으로 접수되었습니다!");
      setIsInquiryOpen(false);
      e.currentTarget.reset();
      
      logActivityMutation.mutate({
        pageUrl: window.location.href,
        pagePath: window.location.pathname,
        action: "inquiry_submitted",
      });
    } catch (error) {
      toast.error("문의 접수에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDownload = (type: "personal" | "corporate") => {
    const proposal = type === "personal" ? personalProposal : corporateProposal;
    if (proposal?.fileUrl) {
      window.open(proposal.fileUrl, "_blank");
      logActivityMutation.mutate({
        pageUrl: window.location.href,
        pagePath: window.location.pathname,
        action: `download_${type}_proposal`,
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">AI 코칭으로 새로운 시대를 열다</h1>
            <p className="text-xl mb-8 opacity-90">
              개인과 기업의 성공적인 AI 도입을 위한 맞춤형 코칭 서비스
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => {
                  setInquiryType("personal");
                  setIsInquiryOpen(true);
                }}
              >
                개인 코칭 문의하기
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => {
                  setInquiryType("corporate");
                  setIsInquiryOpen(true);
                }}
              >
                기업 코칭 문의하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Coaching Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-foreground">개인 코칭</h2>
              <p className="text-xl text-muted-foreground">당신이 중심입니다: 코칭의 3가지 원칙</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <User className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>개인의 목적과 사고 구조 먼저 정리</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    도구는 그 다음 문제입니다. 당신의 생각의 흐름을 파악하는 것이 우선입니다.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CheckCircle className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>"지금 AI가 필요한지"부터 판단</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    AI가 만능 해결책은 아닙니다. 현재 상황에서 AI 도입이 정말 효과적인지부터 함께 진단합니다.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <TrendingUp className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>필요할 때마다 다음 단계로 진행</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    1차 미팅 후, 상호 필요성이 인정될 때만 다음 단계를 제안합니다. 불필요한 과정을 강요하지 않습니다.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => handleDownload("personal")}
                disabled={!personalProposal}
              >
                <Download className="mr-2 h-5 w-5" />
                개인 코칭 제안서 다운로드
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Coaching Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-foreground">기업 코칭</h2>
              <p className="text-xl text-muted-foreground">기업의 AI, 새로운 시대를 열다</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <Sparkles className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>AI 트렌드 변화</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">2023년</h4>
                    <p className="text-sm text-muted-foreground">ChatGPT 중심의 단순 질의응답 (Q&A) 수준</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">현재</h4>
                    <p className="text-sm text-muted-foreground">Claude, Google 등 생성 품질이 고도화된 모델의 등장</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">미래</h4>
                    <p className="text-sm text-muted-foreground">AGENT 기반의 '실행형 AI'가 기업 활용의 핵심으로 부상</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Briefcase className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>기회와 고민 사이</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">이런 강력한 AI 도구가 정말 있는가?</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">가장 중요한 내부 데이터 보안은 괜찮을까?</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">우리 직원들이 직접 사용할 수 있을까?</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">비용과 성공을 보장할 수 있나?</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => handleDownload("corporate")}
                disabled={!corporateProposal}
              >
                <Download className="mr-2 h-5 w-5" />
                기업 코칭 제안서 다운로드
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      {instructor && (
        <section className="py-20 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-foreground">강사 소개</h2>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {instructor.photoUrl && (
                      <img 
                        src={instructor.photoUrl} 
                        alt={instructor.name}
                        className="w-48 h-48 rounded-lg object-cover shadow-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-2">{instructor.name}</h3>
                      {instructor.title && (
                        <p className="text-xl text-muted-foreground mb-4">{instructor.title}</p>
                      )}
                      {instructor.bio && (
                        <p className="text-base mb-6 leading-relaxed">{instructor.bio}</p>
                      )}
                      {instructor.expertise && (
                        <div className="mb-6">
                          <h4 className="font-semibold mb-2">전문 분야</h4>
                          <p className="text-sm text-muted-foreground">{instructor.expertise}</p>
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        {instructor.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-primary" />
                            <a href={`mailto:${instructor.email}`} className="hover:underline">
                              {instructor.email}
                            </a>
                          </div>
                        )}
                        {instructor.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-primary" />
                            <span>{instructor.phone}</span>
                          </div>
                        )}
                      </div>
                      {instructor.profileLink && (
                        <div className="mt-6">
                          <Button 
                            variant="outline" 
                            size="lg"
                            onClick={() => window.open(instructor.profileLink!, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            상세 프로필 보기
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">지금 바로 시작하세요</h2>
            <p className="text-xl mb-8 opacity-90">
              개인 또는 기업의 AI 도입을 위한 맞춤형 코칭을 받아보세요
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setIsInquiryOpen(true)}
            >
              무료 상담 신청하기
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/50 border-t">
        <div className="container">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 AI 코칭 서비스. All rights reserved.</p>
            {instructor?.email && (
              <p className="mt-2">
                문의: <a href={`mailto:${instructor.email}`} className="hover:underline">{instructor.email}</a>
              </p>
            )}
          </div>
        </div>
      </footer>

      {/* Inquiry Dialog */}
      <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>문의하기</DialogTitle>
            <DialogDescription>
              문의 사항을 남겨주시면 빠른 시일 내에 연락드리겠습니다.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div>
              <Label htmlFor="inquiry-type">문의 유형</Label>
              <Select value={inquiryType} onValueChange={(v) => setInquiryType(v as "personal" | "corporate")}>
                <SelectTrigger id="inquiry-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">개인 코칭</SelectItem>
                  <SelectItem value="corporate">기업 코칭</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="name">이름 *</Label>
              <Input id="name" name="name" required />
            </div>
            
            <div>
              <Label htmlFor="email">이메일 *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            
            <div>
              <Label htmlFor="phone">전화번호</Label>
              <Input id="phone" name="phone" type="tel" />
            </div>
            
            <div>
              <Label htmlFor="message">문의 내용 *</Label>
              <Textarea 
                id="message" 
                name="message" 
                required 
                rows={5}
                className="resize-none"
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsInquiryOpen(false)}>
                취소
              </Button>
              <Button type="submit" disabled={createInquiryMutation.isPending}>
                {createInquiryMutation.isPending ? "전송 중..." : "문의하기"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
