import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Loader2, Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function AdminProposals() {
  const [personalFile, setPersonalFile] = useState<File | null>(null);
  const [corporateFile, setCorporateFile] = useState<File | null>(null);
  const [personalTitle, setPersonalTitle] = useState("개인 코칭 제안서");
  const [corporateTitle, setCorporateTitle] = useState("기업 코칭 제안서");
  const [personalDesc, setPersonalDesc] = useState("당신이 중심입니다: 코칭의 3가지 원칙");
  const [corporateDesc, setCorporateDesc] = useState("기업의 AI, 새로운 시대를 열다");

  const proposalsQuery = trpc.proposal.getAll.useQuery();
  const uploadProposalMutation = trpc.proposal.upload.useMutation({
    onSuccess: () => {
      toast.success("제안서가 업로드되었습니다.");
      proposalsQuery.refetch();
      setPersonalFile(null);
      setCorporateFile(null);
    },
    onError: () => {
      toast.error("제안서 업로드에 실패했습니다.");
    },
  });

  const personalProposal = proposalsQuery.data?.find(p => p.type === "personal");
  const corporateProposal = proposalsQuery.data?.find(p => p.type === "corporate");

  const handleFileChange = (type: "personal" | "corporate", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("PDF 파일만 업로드 가능합니다.");
        return;
      }
      if (type === "personal") {
        setPersonalFile(file);
      } else {
        setCorporateFile(file);
      }
    }
  };

  const handleUpload = async (type: "personal" | "corporate") => {
    const file = type === "personal" ? personalFile : corporateFile;
    const title = type === "personal" ? personalTitle : corporateTitle;
    const description = type === "personal" ? personalDesc : corporateDesc;

    if (!file) {
      toast.error("파일을 선택해주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];
      await uploadProposalMutation.mutateAsync({
        type,
        title,
        description,
        fileBase64: base64,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  if (proposalsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">제안서 관리</h1>
        <p className="text-muted-foreground mt-2">개인 및 기업 코칭 제안서를 관리합니다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Proposal Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              개인 코칭 제안서
            </CardTitle>
            <CardDescription>개인 코칭 프로그램 제안서를 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {personalProposal && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div>
                  <p className="text-sm font-semibold">현재 파일</p>
                  <p className="text-sm text-muted-foreground">{personalProposal.fileName}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">업로드 일시</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(personalProposal.updatedAt), "yyyy-MM-dd HH:mm", { locale: ko })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(personalProposal.fileUrl)}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  현재 파일 다운로드
                </Button>
              </div>
            )}

            <div>
              <Label htmlFor="personal-title">제목</Label>
              <Input
                id="personal-title"
                value={personalTitle}
                onChange={(e) => setPersonalTitle(e.target.value)}
                placeholder="제안서 제목"
              />
            </div>

            <div>
              <Label htmlFor="personal-desc">설명</Label>
              <Textarea
                id="personal-desc"
                value={personalDesc}
                onChange={(e) => setPersonalDesc(e.target.value)}
                rows={3}
                className="resize-none"
                placeholder="제안서 설명"
              />
            </div>

            <div>
              <Label htmlFor="personal-file">새 파일 업로드 (PDF)</Label>
              <Input
                id="personal-file"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange("personal", e)}
                className="mt-1"
              />
              {personalFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  선택된 파일: {personalFile.name}
                </p>
              )}
            </div>

            <Button
              onClick={() => handleUpload("personal")}
              disabled={uploadProposalMutation.isPending || !personalFile}
              className="w-full"
            >
              {uploadProposalMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  제안서 업로드
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Corporate Proposal Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              기업 코칭 제안서
            </CardTitle>
            <CardDescription>기업 코칭 프로그램 제안서를 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {corporateProposal && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div>
                  <p className="text-sm font-semibold">현재 파일</p>
                  <p className="text-sm text-muted-foreground">{corporateProposal.fileName}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">업로드 일시</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(corporateProposal.updatedAt), "yyyy-MM-dd HH:mm", { locale: ko })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(corporateProposal.fileUrl)}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  현재 파일 다운로드
                </Button>
              </div>
            )}

            <div>
              <Label htmlFor="corporate-title">제목</Label>
              <Input
                id="corporate-title"
                value={corporateTitle}
                onChange={(e) => setCorporateTitle(e.target.value)}
                placeholder="제안서 제목"
              />
            </div>

            <div>
              <Label htmlFor="corporate-desc">설명</Label>
              <Textarea
                id="corporate-desc"
                value={corporateDesc}
                onChange={(e) => setCorporateDesc(e.target.value)}
                rows={3}
                className="resize-none"
                placeholder="제안서 설명"
              />
            </div>

            <div>
              <Label htmlFor="corporate-file">새 파일 업로드 (PDF)</Label>
              <Input
                id="corporate-file"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange("corporate", e)}
                className="mt-1"
              />
              {corporateFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  선택된 파일: {corporateFile.name}
                </p>
              )}
            </div>

            <Button
              onClick={() => handleUpload("corporate")}
              disabled={uploadProposalMutation.isPending || !corporateFile}
              className="w-full"
            >
              {uploadProposalMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  제안서 업로드
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
