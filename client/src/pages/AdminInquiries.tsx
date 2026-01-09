import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  type: "personal" | "corporate";
  message: string;
  status: "new" | "processing" | "completed";
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminInquiries() {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [status, setStatus] = useState<"new" | "processing" | "completed">("new");
  const [adminNotes, setAdminNotes] = useState("");

  const inquiriesQuery = trpc.inquiry.getAll.useQuery();
  const updateStatusMutation = trpc.inquiry.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("문의 상태가 업데이트되었습니다.");
      inquiriesQuery.refetch();
      setSelectedInquiry(null);
    },
    onError: () => {
      toast.error("문의 상태 업데이트에 실패했습니다.");
    },
  });

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setStatus(inquiry.status);
    setAdminNotes(inquiry.adminNotes || "");
  };

  const handleUpdateStatus = () => {
    if (!selectedInquiry) return;
    
    updateStatusMutation.mutate({
      id: selectedInquiry.id,
      status,
      adminNotes,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">신규</Badge>;
      case "processing":
        return <Badge variant="secondary">처리중</Badge>;
      case "completed":
        return <Badge variant="outline">완료</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "personal" ? (
      <Badge variant="outline">개인</Badge>
    ) : (
      <Badge variant="outline">기업</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">문의 관리</h1>
        <p className="text-muted-foreground mt-2">고객 문의를 확인하고 관리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>문의 목록</CardTitle>
          <CardDescription>
            총 {inquiriesQuery.data?.length || 0}건의 문의가 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inquiriesQuery.isLoading ? (
            <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
          ) : inquiriesQuery.data?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">문의가 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>날짜</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiriesQuery.data?.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        {format(new Date(inquiry.createdAt), "yyyy-MM-dd HH:mm", { locale: ko })}
                      </TableCell>
                      <TableCell>{inquiry.name}</TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell>{getTypeBadge(inquiry.type)}</TableCell>
                      <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInquiry(inquiry)}
                        >
                          상세보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>문의 상세</DialogTitle>
            <DialogDescription>
              문의 정보를 확인하고 상태를 업데이트합니다.
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">이름</Label>
                  <p className="mt-1">{selectedInquiry.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">이메일</Label>
                  <p className="mt-1">{selectedInquiry.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">전화번호</Label>
                  <p className="mt-1">{selectedInquiry.phone || "-"}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">문의 유형</Label>
                  <p className="mt-1">{getTypeBadge(selectedInquiry.type)}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">접수일</Label>
                  <p className="mt-1">
                    {format(new Date(selectedInquiry.createdAt), "yyyy-MM-dd HH:mm", { locale: ko })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">현재 상태</Label>
                  <p className="mt-1">{getStatusBadge(selectedInquiry.status)}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">문의 내용</Label>
                <div className="mt-1 p-4 bg-muted rounded-md">
                  <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="status">상태 변경</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as "new" | "processing" | "completed")}>
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">신규</SelectItem>
                    <SelectItem value="processing">처리중</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="adminNotes">관리자 메모</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="mt-1 resize-none"
                  placeholder="내부 메모를 작성하세요..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedInquiry(null)}>
                  취소
                </Button>
                <Button onClick={handleUpdateStatus} disabled={updateStatusMutation.isPending}>
                  {updateStatusMutation.isPending ? "저장 중..." : "저장"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
