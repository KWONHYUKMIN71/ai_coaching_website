import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DynamicIcon } from "@/components/DynamicIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, Mail, Phone, User, ExternalLink } from "lucide-react";

export default function Home() {
  const { language, t } = useLanguage();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState<"personal" | "corporate">("personal");
  
  // Data queries
  const instructorsQuery = trpc.instructor.getAll.useQuery();
  const proposalsQuery = trpc.proposal.getAll.useQuery();
  const contentSectionsQuery = trpc.content.getSections.useQuery();
  const createInquiryMutation = trpc.inquiry.create.useMutation();
  const logActivityMutation = trpc.activity.log.useMutation();

  const instructor = instructorsQuery.data?.[0];
  const personalProposal = proposalsQuery.data?.find(p => p.type === "personal");
  const corporateProposal = proposalsQuery.data?.find(p => p.type === "corporate");
  const personalSection = contentSectionsQuery.data?.find(s => s.sectionType === "personal");
  const corporateSection = contentSectionsQuery.data?.find(s => s.sectionType === "corporate");

  // Content items queries
  const personalItemsQuery = trpc.content.getItemsBySectionId.useQuery(
    { sectionId: personalSection?.id || 0 },
    { enabled: !!personalSection?.id }
  );
  const corporateItemsQuery = trpc.content.getItemsBySectionId.useQuery(
    { sectionId: corporateSection?.id || 0 },
    { enabled: !!corporateSection?.id }
  );

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
      
      toast.success(t("home.inquiry.success"));
      setIsInquiryOpen(false);
      e.currentTarget.reset();
      
      logActivityMutation.mutate({
        pageUrl: window.location.href,
        pagePath: window.location.pathname,
        action: "inquiry_submitted",
      });
    } catch (error) {
      toast.error(t("home.inquiry.error"));
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

  // Get translated content
  const getTitle = (section: typeof personalSection) => {
    if (!section) return "";
    return language === "ko" ? section.titleKo : language === "zh" ? section.titleZh : section.titleEn;
  };

  const getDescription = (section: typeof personalSection) => {
    if (!section) return "";
    return language === "ko" ? section.descriptionKo : language === "zh" ? section.descriptionZh : section.descriptionEn;
  };

  const getItemTitle = (item: any) => {
    if (!item) return "";
    return language === "ko" ? item.titleKo : language === "zh" ? item.titleZh : item.titleEn;
  };

  const getItemContent = (item: any) => {
    if (!item) return "";
    return language === "ko" ? item.contentKo : language === "zh" ? item.contentZh : item.contentEn;
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-background border-b sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-primary">AI Coaching</h1>
          <div className="flex items-center gap-6">
            <a href="#personal" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.personalCoaching")}
            </a>
            <a href="#corporate" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.corporateCoaching")}
            </a>
            <a href="#instructor" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.instructor")}
            </a>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => setIsInquiryOpen(true)}
            >
              {t("nav.inquiry")}
            </Button>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{t("home.hero.title")}</h1>
            <p className="text-2xl mb-4 font-semibold">{t("home.hero.subtitle")}</p>
            <p className="text-xl mb-8 opacity-90">
              {t("home.hero.description")}
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
                {t("home.hero.ctaPersonal")}
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
                {t("home.hero.ctaCorporate")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Coaching Section */}
      <section id="personal" className="py-20 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="secondary">{t("home.personalCoaching.badge")}</Badge>
              <h2 className="text-4xl font-bold mb-4">{getTitle(personalSection)}</h2>
              <p className="text-xl text-muted-foreground mb-6">
                {getDescription(personalSection)}
              </p>
              {personalProposal && (
                <Button 
                  variant="outline" 
                  onClick={() => handleDownload("personal")}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t("home.personalCoaching.downloadProposal")}
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {personalItemsQuery.data?.map((item) => (
                <Card key={item.id} className="border-2 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <DynamicIcon name={item.iconName as any} className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{getItemTitle(item)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{getItemContent(item)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Coaching Section */}
      <section id="corporate" className="py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="secondary">{t("home.corporateCoaching.badge")}</Badge>
              <h2 className="text-4xl font-bold mb-4">{getTitle(corporateSection)}</h2>
              <p className="text-xl text-muted-foreground mb-6">
                {getDescription(corporateSection)}
              </p>
              {corporateProposal && (
                <Button 
                  variant="outline" 
                  onClick={() => handleDownload("corporate")}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t("home.corporateCoaching.downloadProposal")}
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {corporateItemsQuery.data?.map((item) => (
                <Card key={item.id} className="border-2 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <DynamicIcon name={item.iconName as any} className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{getItemTitle(item)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{getItemContent(item)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      {instructor && (
        <section id="instructor" className="py-20 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4" variant="secondary">{t("home.instructor.badge")}</Badge>
                <h2 className="text-4xl font-bold mb-4">{instructor.name}</h2>
                {instructor.title && (
                  <p className="text-xl text-muted-foreground mb-4">{instructor.title}</p>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                {instructor.photoUrl && (
                  <div className="flex-shrink-0">
                    <img 
                      src={instructor.photoUrl} 
                      alt={instructor.name}
                      className="w-64 h-64 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  {instructor.bio && (
                    <p className="text-lg text-muted-foreground mb-6 whitespace-pre-wrap">
                      {instructor.bio}
                    </p>
                  )}
                  
                  {instructor.expertise && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">전문 분야</h3>
                      <p className="text-muted-foreground">{instructor.expertise}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    {instructor.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{instructor.email}</span>
                      </div>
                    )}
                    {instructor.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{instructor.phone}</span>
                      </div>
                    )}
                  </div>

                  {instructor.profileLink && (
                    <Button 
                      variant="outline" 
                      className="mt-6 gap-2"
                      onClick={() => window.open(instructor.profileLink!, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t("home.instructor.viewProfile")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Inquiry Dialog */}
      <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("home.inquiry.title")}</DialogTitle>
            <DialogDescription>
              {t("home.inquiry.subtitle")}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("home.inquiry.form.name")}</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  placeholder={t("home.inquiry.form.namePlaceholder")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t("home.inquiry.form.email")}</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder={t("home.inquiry.form.emailPlaceholder")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("home.inquiry.form.phone")}</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  placeholder={t("home.inquiry.form.phonePlaceholder")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">{t("home.inquiry.form.type")}</Label>
                <Select value={inquiryType} onValueChange={(value: any) => setInquiryType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">{t("home.inquiry.form.typePersonal")}</SelectItem>
                    <SelectItem value="corporate">{t("home.inquiry.form.typeCorporate")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t("home.inquiry.form.message")}</Label>
              <Textarea 
                id="message" 
                name="message" 
                required 
                rows={6}
                placeholder={t("home.inquiry.form.messagePlaceholder")}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createInquiryMutation.isPending}
            >
              {createInquiryMutation.isPending 
                ? t("home.inquiry.form.submitting") 
                : t("home.inquiry.form.submit")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 AI Coaching. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
