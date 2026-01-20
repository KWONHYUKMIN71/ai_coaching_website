import * as LucideIcons from "lucide-react";
import { IconName } from "@shared/icons";

interface DynamicIconProps {
  name: IconName;
  className?: string;
}

/**
 * 아이콘 이름을 받아서 동적으로 Lucide React 아이콘을 렌더링합니다.
 */
export function DynamicIcon({ name, className }: DynamicIconProps) {
  const Icon = (LucideIcons as any)[name];
  
  if (!Icon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }
  
  return <Icon className={className} />;
}
