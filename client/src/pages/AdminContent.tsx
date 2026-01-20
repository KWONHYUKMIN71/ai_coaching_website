import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { DynamicIcon } from "@/components/DynamicIcon";
import { availableIcons } from "@shared/icons";

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<"personal" | "corporate">("personal");
  
  // Queries
  const contentSectionsQuery = trpc.content.getSections.useQuery();
  const personalSection = contentSectionsQuery.data?.find(s => s.sectionType === "personal");
  const corporateSection = contentSectionsQuery.data?.find(s => s.sectionType === "corporate");
  
  const personalItemsQuery = trpc.content.getItemsBySectionId.useQuery(
    { sectionId: personalSection?.id || 0 },
    { enabled: !!personalSection?.id }
  );
  const corporateItemsQuery = trpc.content.getItemsBySectionId.useQuery(
    { sectionId: corporateSection?.id || 0 },
    { enabled: !!corporateSection?.id }
  );

  // Mutations
  const updateSectionMutation = trpc.content.updateSection.useMutation();
  const updateItemMutation = trpc.content.updateItem.useMutation();
  const utils = trpc.useUtils();

  // Personal section state
  const [personalSectionData, setPersonalSectionData] = useState({
    titleKo: "",
    titleZh: "",
    titleEn: "",
    descriptionKo: "",
    descriptionZh: "",
    descriptionEn: "",
  });

  // Corporate section state
  const [corporateSectionData, setCorporateSectionData] = useState({
    titleKo: "",
    titleZh: "",
    titleEn: "",
    descriptionKo: "",
    descriptionZh: "",
    descriptionEn: "",
  });

  // Personal items state
  const [personalItems, setPersonalItems] = useState<any[]>([]);
  
  // Corporate items state
  const [corporateItems, setCorporateItems] = useState<any[]>([]);

  // Initialize personal section data
  useEffect(() => {
    if (personalSection) {
      setPersonalSectionData({
        titleKo: personalSection.titleKo || "",
        titleZh: personalSection.titleZh || "",
        titleEn: personalSection.titleEn || "",
        descriptionKo: personalSection.descriptionKo || "",
        descriptionZh: personalSection.descriptionZh || "",
        descriptionEn: personalSection.descriptionEn || "",
      });
    }
  }, [personalSection]);

  // Initialize corporate section data
  useEffect(() => {
    if (corporateSection) {
      setCorporateSectionData({
        titleKo: corporateSection.titleKo || "",
        titleZh: corporateSection.titleZh || "",
        titleEn: corporateSection.titleEn || "",
        descriptionKo: corporateSection.descriptionKo || "",
        descriptionZh: corporateSection.descriptionZh || "",
        descriptionEn: corporateSection.descriptionEn || "",
      });
    }
  }, [corporateSection]);

  // Initialize personal items
  useEffect(() => {
    if (personalItemsQuery.data) {
      setPersonalItems(personalItemsQuery.data.map(item => ({ ...item })));
    }
  }, [personalItemsQuery.data]);

  // Initialize corporate items
  useEffect(() => {
    if (corporateItemsQuery.data) {
      setCorporateItems(corporateItemsQuery.data.map(item => ({ ...item })));
    }
  }, [corporateItemsQuery.data]);

  const handleSavePersonalSection = async () => {
    try {
      await updateSectionMutation.mutateAsync({
        type: "personal",
        ...personalSectionData,
      });
      
      // Save all items
      for (const item of personalItems) {
        await updateItemMutation.mutateAsync({
          id: item.id,
          iconName: item.iconName,
          titleKo: item.titleKo,
          titleZh: item.titleZh,
          titleEn: item.titleEn,
          contentKo: item.contentKo,
          contentZh: item.contentZh,
          contentEn: item.contentEn,
          displayOrder: item.displayOrder,
        });
      }
      
      await utils.content.getSections.invalidate();
      await utils.content.getItemsBySectionId.invalidate();
      toast.success("개인 코칭 콘텐츠가 성공적으로 저장되었습니다.");
    } catch (error) {
      toast.error("저장 중 오류가 발생했습니다.");
    }
  };

  const handleSaveCorporateSection = async () => {
    try {
      await updateSectionMutation.mutateAsync({
        type: "corporate",
        ...corporateSectionData,
      });
      
      // Save all items
      for (const item of corporateItems) {
        await updateItemMutation.mutateAsync({
          id: item.id,
          iconName: item.iconName,
          titleKo: item.titleKo,
          titleZh: item.titleZh,
          titleEn: item.titleEn,
          contentKo: item.contentKo,
          contentZh: item.contentZh,
          contentEn: item.contentEn,
          displayOrder: item.displayOrder,
        });
      }
      
      await utils.content.getSections.invalidate();
      await utils.content.getItemsBySectionId.invalidate();
      toast.success("기업 코칭 콘텐츠가 성공적으로 저장되었습니다.");
    } catch (error) {
      toast.error("저장 중 오류가 발생했습니다.");
    }
  };

  const isSaving = updateSectionMutation.isPending || updateItemMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">콘텐츠 관리</h1>
        <p className="text-muted-foreground mt-2">
          개인 코칭 및 기업 코칭 섹션의 내용을 관리합니다. 모든 언어(한국어, 중국어, 영어)를 입력해주세요.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="personal">개인 코칭</TabsTrigger>
          <TabsTrigger value="corporate">기업 코칭</TabsTrigger>
        </TabsList>

        {/* Personal Coaching Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>섹션 정보</CardTitle>
              <CardDescription>개인 코칭 섹션의 제목과 설명을 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Korean */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">한국어 🇰🇷</h3>
                <div className="space-y-2">
                  <Label>제목</Label>
                  <Input
                    value={personalSectionData.titleKo}
                    onChange={(e) => setPersonalSectionData({ ...personalSectionData, titleKo: e.target.value })}
                    placeholder="개인 코칭 제목"
                  />
                </div>
                <div className="space-y-2">
                  <Label>설명</Label>
                  <Textarea
                    value={personalSectionData.descriptionKo}
                    onChange={(e) => setPersonalSectionData({ ...personalSectionData, descriptionKo: e.target.value })}
                    placeholder="개인 코칭 설명"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Chinese */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">中文 🇨🇳</h3>
                <div className="space-y-2">
                  <Label>标题</Label>
                  <Input
                    value={personalSectionData.titleZh}
                    onChange={(e) => setPersonalSectionData({ ...personalSectionData, titleZh: e.target.value })}
                    placeholder="个人辅导标题"
                  />
                </div>
                <div className="space-y-2">
                  <Label>描述</Label>
                  <Textarea
                    value={personalSectionData.descriptionZh}
                    onChange={(e) => setPersonalSectionData({ ...personalSectionData, descriptionZh: e.target.value })}
                    placeholder="个人辅导描述"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* English */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">English 🇺🇸</h3>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={personalSectionData.titleEn}
                    onChange={(e) => setPersonalSectionData({ ...personalSectionData, titleEn: e.target.value })}
                    placeholder="Personal Coaching Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={personalSectionData.descriptionEn}
                    onChange={(e) => setPersonalSectionData({ ...personalSectionData, descriptionEn: e.target.value })}
                    placeholder="Personal Coaching Description"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Items */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">하위 항목 (3개)</h2>
            {personalItems.map((item, index) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>항목 {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Icon Selection */}
                  <div className="space-y-2">
                    <Label>아이콘</Label>
                    <Select
                      value={item.iconName}
                      onValueChange={(value) => {
                        const newItems = [...personalItems];
                        newItems[index] = { ...newItems[index], iconName: value };
                        setPersonalItems(newItems);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <DynamicIcon name={item.iconName} className="h-4 w-4" />
                            <span>{item.iconName}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon: any) => (
                          <SelectItem key={icon.name} value={icon.name}>
                            <div className="flex items-center gap-2">
                              <DynamicIcon name={icon.name} className="h-4 w-4" />
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Korean */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">한국어 🇰🇷</h4>
                    <div className="space-y-2">
                      <Label>제목</Label>
                      <Input
                        value={item.titleKo}
                        onChange={(e) => {
                          const newItems = [...personalItems];
                          newItems[index] = { ...newItems[index], titleKo: e.target.value };
                          setPersonalItems(newItems);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>내용</Label>
                      <Textarea
                        value={item.contentKo}
                        onChange={(e) => {
                          const newItems = [...personalItems];
                          newItems[index] = { ...newItems[index], contentKo: e.target.value };
                          setPersonalItems(newItems);
                        }}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Chinese */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">中文 🇨🇳</h4>
                    <div className="space-y-2">
                      <Label>标题</Label>
                      <Input
                        value={item.titleZh}
                        onChange={(e) => {
                          const newItems = [...personalItems];
                          newItems[index] = { ...newItems[index], titleZh: e.target.value };
                          setPersonalItems(newItems);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>内容</Label>
                      <Textarea
                        value={item.contentZh}
                        onChange={(e) => {
                          const newItems = [...personalItems];
                          newItems[index] = { ...newItems[index], contentZh: e.target.value };
                          setPersonalItems(newItems);
                        }}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* English */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">English 🇺🇸</h4>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={item.titleEn}
                        onChange={(e) => {
                          const newItems = [...personalItems];
                          newItems[index] = { ...newItems[index], titleEn: e.target.value };
                          setPersonalItems(newItems);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea
                        value={item.contentEn}
                        onChange={(e) => {
                          const newItems = [...personalItems];
                          newItems[index] = { ...newItems[index], contentEn: e.target.value };
                          setPersonalItems(newItems);
                        }}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleSavePersonalSection}
            disabled={isSaving}
            size="lg"
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                개인 코칭 저장하기
              </>
            )}
          </Button>
        </TabsContent>

        {/* Corporate Coaching Tab */}
        <TabsContent value="corporate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>섹션 정보</CardTitle>
              <CardDescription>기업 코칭 섹션의 제목과 설명을 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Korean */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">한국어 🇰🇷</h3>
                <div className="space-y-2">
                  <Label>제목</Label>
                  <Input
                    value={corporateSectionData.titleKo}
                    onChange={(e) => setCorporateSectionData({ ...corporateSectionData, titleKo: e.target.value })}
                    placeholder="기업 코칭 제목"
                  />
                </div>
                <div className="space-y-2">
                  <Label>설명</Label>
                  <Textarea
                    value={corporateSectionData.descriptionKo}
                    onChange={(e) => setCorporateSectionData({ ...corporateSectionData, descriptionKo: e.target.value })}
                    placeholder="기업 코칭 설명"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Chinese */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">中文 🇨🇳</h3>
                <div className="space-y-2">
                  <Label>标题</Label>
                  <Input
                    value={corporateSectionData.titleZh}
                    onChange={(e) => setCorporateSectionData({ ...corporateSectionData, titleZh: e.target.value })}
                    placeholder="企业辅导标题"
                  />
                </div>
                <div className="space-y-2">
                  <Label>描述</Label>
                  <Textarea
                    value={corporateSectionData.descriptionZh}
                    onChange={(e) => setCorporateSectionData({ ...corporateSectionData, descriptionZh: e.target.value })}
                    placeholder="企业辅导描述"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* English */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">English 🇺🇸</h3>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={corporateSectionData.titleEn}
                    onChange={(e) => setCorporateSectionData({ ...corporateSectionData, titleEn: e.target.value })}
                    placeholder="Corporate Coaching Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={corporateSectionData.descriptionEn}
                    onChange={(e) => setCorporateSectionData({ ...corporateSectionData, descriptionEn: e.target.value })}
                    placeholder="Corporate Coaching Description"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Corporate Items */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">하위 항목 (3개)</h2>
            {corporateItems.map((item, index) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>항목 {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Icon Selection */}
                  <div className="space-y-2">
                    <Label>아이콘</Label>
                    <Select
                      value={item.iconName}
                      onValueChange={(value) => {
                        const newItems = [...corporateItems];
                        newItems[index] = { ...newItems[index], iconName: value };
                        setCorporateItems(newItems);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <DynamicIcon name={item.iconName} className="h-4 w-4" />
                            <span>{item.iconName}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon: any) => (
                          <SelectItem key={icon.name} value={icon.name}>
                            <div className="flex items-center gap-2">
                              <DynamicIcon name={icon.name} className="h-4 w-4" />
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Korean */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">한국어 🇰🇷</h4>
                    <div className="space-y-2">
                      <Label>제목</Label>
                      <Input
                        value={item.titleKo}
                        onChange={(e) => {
                          const newItems = [...corporateItems];
                          newItems[index] = { ...newItems[index], titleKo: e.target.value };
                          setCorporateItems(newItems);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>내용</Label>
                      <Textarea
                        value={item.contentKo}
                        onChange={(e) => {
                          const newItems = [...corporateItems];
                          newItems[index] = { ...newItems[index], contentKo: e.target.value };
                          setCorporateItems(newItems);
                        }}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Chinese */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">中文 🇨🇳</h4>
                    <div className="space-y-2">
                      <Label>标题</Label>
                      <Input
                        value={item.titleZh}
                        onChange={(e) => {
                          const newItems = [...corporateItems];
                          newItems[index] = { ...newItems[index], titleZh: e.target.value };
                          setCorporateItems(newItems);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>内容</Label>
                      <Textarea
                        value={item.contentZh}
                        onChange={(e) => {
                          const newItems = [...corporateItems];
                          newItems[index] = { ...newItems[index], contentZh: e.target.value };
                          setCorporateItems(newItems);
                        }}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* English */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">English 🇺🇸</h4>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={item.titleEn}
                        onChange={(e) => {
                          const newItems = [...corporateItems];
                          newItems[index] = { ...newItems[index], titleEn: e.target.value };
                          setCorporateItems(newItems);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea
                        value={item.contentEn}
                        onChange={(e) => {
                          const newItems = [...corporateItems];
                          newItems[index] = { ...newItems[index], contentEn: e.target.value };
                          setCorporateItems(newItems);
                        }}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleSaveCorporateSection}
            disabled={isSaving}
            size="lg"
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                기업 코칭 저장하기
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
