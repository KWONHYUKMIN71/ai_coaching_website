import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, FileText, MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ko } from "date-fns/locale";

export default function AdminDashboard() {
  const instructorsQuery = trpc.instructor.getAll.useQuery();
  const proposalsQuery = trpc.proposal.getAll.useQuery();
  const inquiriesQuery = trpc.inquiry.getAll.useQuery();
  
  const start = startOfDay(subDays(new Date(), 7));
  const end = endOfDay(new Date());
  const statsQuery = trpc.activity.getStats.useQuery({
    startDate: start,
    endDate: end,
  });

  const newInquiriesCount = inquiriesQuery.data?.filter(i => i.status === "new").length || 0;
  const processingInquiriesCount = inquiriesQuery.data?.filter(i => i.status === "processing").length || 0;

  if (instructorsQuery.isLoading || proposalsQuery.isLoading || inquiriesQuery.isLoading || statsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = statsQuery.data || { totalVisits: 0, uniqueIps: 0, pageViews: {} };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <p className="text-muted-foreground mt-2">AI 코칭 서비스 웹사이트 관리</p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">신규 문의</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newInquiriesCount}</div>
            <p className="text-xs text-muted-foreground">처리 대기 중</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">처리 중</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingInquiriesCount}</div>
            <p className="text-xs text-muted-foreground">진행 중인 문의</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">주간 방문자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueIps}</div>
            <p className="text-xs text-muted-foreground">최근 7일</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">주간 조회수</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">최근 7일</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>빠른 작업</CardTitle>
            <CardDescription>자주 사용하는 관리 기능</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/inquiries">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                문의 관리
                {newInquiriesCount > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {newInquiriesCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/admin/instructor">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                강사 정보 관리
              </Button>
            </Link>
            <Link href="/admin/proposals">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                제안서 관리
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                접속 현황
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>최근 문의</CardTitle>
            <CardDescription>최근 접수된 문의 목록</CardDescription>
          </CardHeader>
          <CardContent>
            {inquiriesQuery.data && inquiriesQuery.data.length > 0 ? (
              <div className="space-y-3">
                {inquiriesQuery.data.slice(0, 5).map((inquiry) => (
                  <div key={inquiry.id} className="flex items-start justify-between border-b pb-2 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{inquiry.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {inquiry.type === "personal" ? "개인" : "기업"} · {format(new Date(inquiry.createdAt), "MM-dd HH:mm", { locale: ko })}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      inquiry.status === "new" ? "bg-primary text-primary-foreground" :
                      inquiry.status === "processing" ? "bg-secondary text-secondary-foreground" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {inquiry.status === "new" ? "신규" : inquiry.status === "processing" ? "처리중" : "완료"}
                    </span>
                  </div>
                ))}
                <Link href="/admin/inquiries">
                  <Button variant="link" className="w-full">
                    모든 문의 보기 →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                문의가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>시스템 정보</CardTitle>
          <CardDescription>현재 등록된 콘텐츠 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">강사</p>
                <p className="text-2xl font-bold">{instructorsQuery.data?.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">제안서</p>
                <p className="text-2xl font-bold">{proposalsQuery.data?.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">총 문의</p>
                <p className="text-2xl font-bold">{inquiriesQuery.data?.length || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
