/**
 * 사용 가능한 아이콘 목록
 * Lucide React 아이콘 라이브러리에서 선택된 12개 아이콘
 */
export const availableIcons = [
  { name: "User", label: "사용자", labelZh: "用户", labelEn: "User" },
  { name: "Target", label: "목표", labelZh: "目标", labelEn: "Target" },
  { name: "TrendingUp", label: "성장", labelZh: "增长", labelEn: "Growth" },
  { name: "CheckCircle", label: "확인", labelZh: "确认", labelEn: "Check" },
  { name: "Lightbulb", label: "아이디어", labelZh: "想法", labelEn: "Idea" },
  { name: "Users", label: "팀", labelZh: "团队", labelEn: "Team" },
  { name: "Briefcase", label: "비즈니스", labelZh: "商务", labelEn: "Business" },
  { name: "Award", label: "수상", labelZh: "奖项", labelEn: "Award" },
  { name: "BarChart", label: "차트", labelZh: "图表", labelEn: "Chart" },
  { name: "MessageSquare", label: "메시지", labelZh: "消息", labelEn: "Message" },
  { name: "Zap", label: "번개", labelZh: "闪电", labelEn: "Lightning" },
  { name: "Heart", label: "하트", labelZh: "心", labelEn: "Heart" },
] as const;

export type IconName = typeof availableIcons[number]["name"];

/**
 * 아이콘 이름으로 아이콘 정보를 가져옵니다.
 */
export function getIconInfo(iconName: string) {
  return availableIcons.find(icon => icon.name === iconName);
}
