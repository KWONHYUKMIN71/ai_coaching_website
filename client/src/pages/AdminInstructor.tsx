import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

export default function AdminInstructor() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [expertise, setExpertise] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
      setPhotoPreview(null);
    },
    onError: () => {
      toast.error("강사 사진 업로드에 실패했습니다.");
    },
  });

  const instructor = instructorsQuery.data?.[0];

  useEffect(() => {
    if (instructor) {
      setName(instructor.name);
      setTitle(instructor.title || "");
      setBio(instructor.bio || "");
      setEmail(instructor.email || "");
      setPhone(instructor.phone || "");
      setExpertise(instructor.expertise || "");
      setPhotoPreview(instructor.photoUrl || null);
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
      name,
      title,
      bio,
      email,
      phone,
      expertise,
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">강사 정보 관리</h1>
        <p className="text-muted-foreground mt-2">강사 프로필 정보를 수정합니다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Photo Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>강사 사진</CardTitle>
            <CardDescription>강사 프로필 사진을 업로드합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="강사 사진 미리보기"
                  className="w-48 h-48 rounded-lg object-cover shadow-md"
                />
              )}
              <div className="w-full">
                <Label htmlFor="photo">사진 선택</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-1"
                />
              </div>
              {photoFile && (
                <Button
                  onClick={handlePhotoUpload}
                  disabled={uploadPhotoMutation.isPending}
                  className="w-full"
                >
                  {uploadPhotoMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      업로드 중...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      사진 업로드
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>강사의 기본 정보를 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="강사 이름"
              />
            </div>
            <div>
              <Label htmlFor="title">직함</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: AI 코칭 전문가"
              />
            </div>
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
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>상세 정보</CardTitle>
          <CardDescription>강사의 소개 및 전문 분야를 입력합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bio">소개</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              className="resize-none"
              placeholder="강사 소개를 작성하세요..."
            />
          </div>
          <div>
            <Label htmlFor="expertise">전문 분야</Label>
            <Textarea
              id="expertise"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              rows={3}
              className="resize-none"
              placeholder="전문 분야를 쉼표로 구분하여 입력하세요. 예: AI 코칭, 기업 컨설팅, 실행형 AI"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveInfo}
              disabled={updateInstructorMutation.isPending || !name}
            >
              {updateInstructorMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                "정보 저장"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
