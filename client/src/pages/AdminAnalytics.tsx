import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Users, Eye, MousePointerClick, TrendingUp } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ko } from "date-fns/locale";

export default function AdminAnalytics() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");

  const getDateRange = () => {
    const end = endOfDay(new Date());
    let start: Date;
    
    switch (period) {
      case "day":
        start = startOfDay(new Date());
        break;
      case "week":
        start = startOfDay(subDays(new Date(), 7));
        break;
      case "month":
        start = startOfDay(subDays(new Date(), 30));
        break;
      default:
        start = startOfDay(subDays(new Date(), 7));
    }
    
    return { start, end };
  };

  const { start, end } = getDateRange();
  
  const statsQuery = trpc.activity.getStats.useQuery({
    startDate: start,
    endDate: end,
  });
  
  const logsQuery = trpc.activity.getLogs.useQuery({ limit: 50 });

  const getPeriodLabel = () => {
    switch (period) {
      case "day":
        return "오늘";
      case "week":
        return "최근 7일";
      case "month":
        return "최근 30일";
      default:
        return "최근 7일";
    }
  };

  if (statsQuery.isLoading || logsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = statsQuery.data || { totalVisits: 0, uniqueIps: 0, pageViews: {} };
  const logs = logsQuery.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">접속 현황</h1>
          <p className="text-muted-foreground mt-2">웹사이트 방문자 통계 및 활동 로그를 확인합니다.</p>
        </div>
        <div className="w-48">
          <Select value={period} onValueChange={(v) => setPeriod(v as "day" | "week" | "month")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">오늘</SelectItem>
              <SelectItem value="week">최근 7일</SelectItem>
              <SelectItem value="month">최근 30일</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 방문</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">순 방문자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueIps}</div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">페이지 조회</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(stats.pageViews).reduce((a, b) => a + b, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 체류</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.uniqueIps > 0 ? (stats.totalVisits / stats.uniqueIps).toFixed(1) : "0"}
            </div>
            <p className="text-xs text-muted-foreground">페이지/방문자</p>
          </CardContent>
        </Card>
      </div>

      {/* Page Views Card */}
      <Card>
        <CardHeader>
          <CardTitle>페이지별 방문 현황</CardTitle>
          <CardDescription>{getPeriodLabel()} 동안의 페이지별 조회수</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(stats.pageViews).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">데이터가 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {Object.entries(stats.pageViews)
                .sort(([, a], [, b]) => b - a)
                .map(([page, count]) => (
                  <div key={page} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{page === "/" ? "홈페이지" : page}</p>
                      <p className="text-sm text-muted-foreground">{page}</p>
                    </div>
                    <div className="text-2xl font-bold text-primary">{count}</div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Logs Card */}
      <Card>
        <CardHeader>
          <CardTitle>최근 활동 로그</CardTitle>
          <CardDescription>최근 50개의 방문 기록</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">활동 로그가 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시간</TableHead>
                    <TableHead>IP 주소</TableHead>
                    <TableHead>페이지</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(new Date(log.timestamp), "MM-dd HH:mm:ss", { locale: ko })}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>{log.pagePath}</TableCell>
                      <TableCell>
                        {log.action ? (
                          <span className="text-sm text-muted-foreground">{log.action}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
