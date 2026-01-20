import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

export default function AdminInstructor() {
  // Multilingual fields
  const [nameKo, setNameKo] = useState("");
  const [nameZh, setNameZh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [titleKo, setTitleKo] = useState("");
  const [titleZh, setTitleZh] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [bioKo, setBioKo] = useState("");
  const [bioZh, setBioZh] = useState("");
  const [bioEn, setBioEn] = useState("");
  const [expertiseKo, setExpertiseKo] = useState("");
  const [expertiseZh, setExpertiseZh] = useState("");
  const [expertiseEn, setExpertiseEn] = useState("");
  
  // Other fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const instructorsQuery = trpc.instructor.getAll.useQuery();
  const updateInstructorMutation = trpc.instructor.update.useMutation({
    onSuccess: () => {
      toast.success("강사 정보가 업데이트되었습니다.");
      instructorsQuery.refetch();
    },
    onError: () => {
      toast.error("강사 정보 업데이트에 실패했습니다.");
    },
  });
  const uploadPhotoMutation = trpc.instructor.uploadPhoto.useMutation({
    onSuccess: () => {
      toast.success("강사 사진이 업데이트되었습니다.");
      instructorsQuery.refetch();
      setPhotoFile(null);
    },
    onError: () => {
      toast.error("강사 사진 업로드에 실패했습니다.");
    },
  });

  const instructor = instructorsQuery.data?.[0];

  useEffect(() => {
    if (instructor) {
      setNameKo(instructor.nameKo || "");
      setNameZh(instructor.nameZh || "");
      setNameEn(instructor.nameEn || "");
      setTitleKo(instructor.titleKo || "");
      setTitleZh(instructor.titleZh || "");
      setTitleEn(instructor.titleEn || "");
      setBioKo(instructor.bioKo || "");
      setBioZh(instructor.bioZh || "");
      setBioEn(instructor.bioEn || "");
      setExpertiseKo(instructor.expertiseKo || "");
      setExpertiseZh(instructor.expertiseZh || "");
      setExpertiseEn(instructor.expertiseEn || "");
      setEmail(instructor.email || "");
      setPhone(instructor.phone || "");
      setProfileLink(instructor.profileLink || "");
      setPhotoPreview(instructor.photoUrl || "");
    }
  }, [instructor]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile || !instructor) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];
      await uploadPhotoMutation.mutateAsync({
        id: instructor.id,
        photoBase64: base64,
        mimeType: photoFile.type,
      });
    };
    reader.readAsDataURL(photoFile);
  };

  const handleSaveInfo = async () => {
    if (!instructor) return;

    await updateInstructorMutation.mutateAsync({
      id: instructor.id,
      nameKo,
      nameZh,
      nameEn,
      titleKo,
      titleZh,
      titleEn,
      bioKo,
      bioZh,
      bioEn,
      expertiseKo,
      expertiseZh,
      expertiseEn,
      email,
      phone,
      profileLink,
    });
  };

  if (instructorsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">강사 정보 관리</h1>

      <div className="grid gap-6">
        {/* Photo Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>강사 사진</CardTitle>
            <CardDescription>강사 프로필 사진을 업로드하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {photoPreview && (
                <div className="flex justify-center">
                  <img
                    src={photoPreview}
                    alt="강사 사진"
                    className="w-48 h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="photo">사진 선택</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
                <Button
                  onClick={handlePhotoUpload}
                  disabled={!photoFile || uploadPhotoMutation.isPending}
                >
                  {uploadPhotoMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      업로드 중...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      사진 업로드
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multilingual Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>강사 기본 정보 (다국어)</CardTitle>
            <CardDescription>
              강사 정보를 한국어, 중국어, 영어로 입력하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ko" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ko">한국어</TabsTrigger>
                <TabsTrigger value="zh">中文</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>

              {/* Korean Tab */}
              <TabsContent value="ko" className="space-y-4">
                <div>
                  <Label htmlFor="nameKo">이름 (한국어)</Label>
                  <Input
                    id="nameKo"
                    value={nameKo}
                    onChange={(e) => setNameKo(e.target.value)}
                    placeholder="예: 홍길동"
                  />
                </div>
                <div>
                  <Label htmlFor="titleKo">직함 (한국어)</Label>
                  <Input
                    id="titleKo"
                    value={titleKo}
                    onChange={(e) => setTitleKo(e.target.value)}
                    placeholder="예: AI 코칭 전문가"
                  />
                </div>
                <div>
                  <Label htmlFor="bioKo">소개 (한국어)</Label>
                  <Textarea
                    id="bioKo"
                    value={bioKo}
                    onChange={(e) => setBioKo(e.target.value)}
                    placeholder="강사 소개를 입력하세요"
                    rows={5}
                  />
                </div>
                <div>
                  <Label htmlFor="expertiseKo">전문분야 (한국어)</Label>
                  <Textarea
                    id="expertiseKo"
                    value={expertiseKo}
                    onChange={(e) => setExpertiseKo(e.target.value)}
                    placeholder="전문분야를 입력하세요"
                    rows={3}
                  />
                </div>
              </TabsContent>

              {/* Chinese Tab */}
              <TabsContent value="zh" className="space-y-4">
                <div>
                  <Label htmlFor="nameZh">姓名 (中文)</Label>
                  <Input
                    id="nameZh"
                    value={nameZh}
                    onChange={(e) => setNameZh(e.target.value)}
                    placeholder="例如: 洪吉东"
                  />
                </div>
                <div>
                  <Label htmlFor="titleZh">职位 (中文)</Label>
                  <Input
                    id="titleZh"
                    value={titleZh}
                    onChange={(e) => setTitleZh(e.target.value)}
                    placeholder="例如: AI教练专家"
                  />
                </div>
                <div>
                  <Label htmlFor="bioZh">简介 (中文)</Label>
                  <Textarea
                    id="bioZh"
                    value={bioZh}
                    onChange={(e) => setBioZh(e.target.value)}
                    placeholder="请输入讲师简介"
                    rows={5}
                  />
                </div>
                <div>
                  <Label htmlFor="expertiseZh">专业领域 (中文)</Label>
                  <Textarea
                    id="expertiseZh"
                    value={expertiseZh}
                    onChange={(e) => setExpertiseZh(e.target.value)}
                    placeholder="请输入专业领域"
                    rows={3}
                  />
                </div>
              </TabsContent>

              {/* English Tab */}
              <TabsContent value="en" className="space-y-4">
                <div>
                  <Label htmlFor="nameEn">Name (English)</Label>
                  <Input
                    id="nameEn"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="titleEn">Title (English)</Label>
                  <Input
                    id="titleEn"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g., AI Coaching Expert"
                  />
                </div>
                <div>
                  <Label htmlFor="bioEn">Bio (English)</Label>
                  <Textarea
                    id="bioEn"
                    value={bioEn}
                    onChange={(e) => setBioEn(e.target.value)}
                    placeholder="Enter instructor bio"
                    rows={5}
                  />
                </div>
                <div>
                  <Label htmlFor="expertiseEn">Expertise (English)</Label>
                  <Textarea
                    id="expertiseEn"
                    value={expertiseEn}
                    onChange={(e) => setExpertiseEn(e.target.value)}
                    placeholder="Enter areas of expertise"
                    rows={3}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Contact Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>연락처 및 기타 정보</CardTitle>
            <CardDescription>이메일, 전화번호, 프로필 링크를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
              />
            </div>
            <div>
              <Label htmlFor="profileLink">프로필 링크</Label>
              <Input
                id="profileLink"
                value={profileLink}
                onChange={(e) => setProfileLink(e.target.value)}
                placeholder="https://example.com/profile"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSaveInfo}
          disabled={updateInstructorMutation.isPending}
          size="lg"
          className="w-full"
        >
          {updateInstructorMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              저장 중...
            </>
          ) : (
            "강사 정보 저장"
          )}
        </Button>
      </div>
    </div>
  );
}
