import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export default function AdminAiTrend() {
  const { data: aiTrend, isLoading, refetch } = trpc.aiTrend.get.useQuery();
  const updateMutation = trpc.aiTrend.update.useMutation({
    onSuccess: () => {
      toast.success("AI 트렌드 정보가 저장되었습니다.");
      refetch();
    },
    onError: (error) => {
      toast.error(`저장 실패: ${error.message}`);
    },
  });

  const [formData, setFormData] = useState({
    titleKo: "",
    titleZh: "",
    titleEn: "",
    subtitleKo: "",
    subtitleZh: "",
    subtitleEn: "",
    linkUrl: "",
  });

  // Load data when available
  if (aiTrend && formData.titleKo === "") {
    setFormData({
      titleKo: aiTrend.titleKo || "",
      titleZh: aiTrend.titleZh || "",
      titleEn: aiTrend.titleEn || "",
      subtitleKo: aiTrend.subtitleKo || "",
      subtitleZh: aiTrend.subtitleZh || "",
      subtitleEn: aiTrend.subtitleEn || "",
      linkUrl: aiTrend.linkUrl || "",
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiTrend) {
      toast.error("AI 트렌드 데이터를 불러올 수 없습니다.");
      return;
    }

    updateMutation.mutate({
      id: aiTrend.id,
      ...formData,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>AI 트렌드 섹션 관리</CardTitle>
          <CardDescription>
            메인 페이지에 표시될 AI 트렌드 섹션의 제목, 서브타이틀, 링크를 다국어로 관리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="ko" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ko">한국어</TabsTrigger>
                <TabsTrigger value="zh">中文</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>

              <TabsContent value="ko" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="titleKo">제목 (한국어)</Label>
                  <Input
                    id="titleKo"
                    value={formData.titleKo}
                    onChange={(e) => setFormData({ ...formData, titleKo: e.target.value })}
                    placeholder="AI 최신 트렌드 소개"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitleKo">서브타이틀 (한국어)</Label>
                  <Input
                    id="subtitleKo"
                    value={formData.subtitleKo}
                    onChange={(e) => setFormData({ ...formData, subtitleKo: e.target.value })}
                    placeholder="매주 업데이트되는 AI 트렌드와 인사이트를 확인하세요"
                  />
                </div>
              </TabsContent>

              <TabsContent value="zh" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="titleZh">标题 (中文)</Label>
                  <Input
                    id="titleZh"
                    value={formData.titleZh}
                    onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                    placeholder="AI最新趋势介绍"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitleZh">副标题 (中文)</Label>
                  <Input
                    id="subtitleZh"
                    value={formData.subtitleZh}
                    onChange={(e) => setFormData({ ...formData, subtitleZh: e.target.value })}
                    placeholder="查看每周更新的AI趋势和见解"
                  />
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="titleEn">Title (English)</Label>
                  <Input
                    id="titleEn"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="Latest AI Trends"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitleEn">Subtitle (English)</Label>
                  <Input
                    id="subtitleEn"
                    value={formData.subtitleEn}
                    onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                    placeholder="Check out weekly updated AI trends and insights"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="linkUrl">링크 URL</Label>
              <Input
                id="linkUrl"
                type="url"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                placeholder="https://ai-trend-platform.fplusai.biz/"
              />
              <p className="text-sm text-muted-foreground">
                AI 트렌드 플랫폼의 URL을 입력하세요.
              </p>
            </div>

            <Button type="submit" disabled={updateMutation.isPending} className="w-full">
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
