/**
 * 다국어 번역 파일
 * 정적 텍스트의 한국어/중국어/영어 번역을 정의합니다.
 */

export type Language = "ko" | "zh" | "en";

export const translations = {
  ko: {
    // 네비게이션
    nav: {
      home: "홈",
      personalCoaching: "개인 코칭",
      corporateCoaching: "기업 코칭",
      instructor: "강사 소개",
      inquiry: "문의하기",
    },
    // 메인 페이지
    home: {
      hero: {
        title: "AI 시대, 당신의 성장을 위한",
        subtitle: "맞춤형 코칭 서비스",
        description: "개인과 기업의 AI 역량 강화를 위한 전문 코칭 프로그램",
        ctaPersonal: "개인 코칭 시작하기",
        ctaCorporate: "기업 코칭 문의하기",
      },
      personalCoaching: {
        badge: "개인 코칭",
        downloadProposal: "제안서 다운로드",
      },
      corporateCoaching: {
        badge: "기업 코칭",
        downloadProposal: "제안서 다운로드",
      },
      instructor: {
        badge: "강사 소개",
        viewProfile: "상세 프로필 보기",
      },
      inquiry: {
        title: "문의하기",
        subtitle: "AI 코칭에 대해 궁금한 점이 있으신가요? 언제든지 문의해 주세요.",
        form: {
          name: "이름",
          namePlaceholder: "홍길동",
          email: "이메일",
          emailPlaceholder: "hong@example.com",
          phone: "전화번호",
          phonePlaceholder: "010-1234-5678",
          type: "문의 유형",
          typePersonal: "개인 코칭",
          typeCorporate: "기업 코칭",
          message: "문의 내용",
          messagePlaceholder: "문의하실 내용을 자유롭게 작성해 주세요.",
          submit: "문의하기",
          submitting: "전송 중...",
        },
        success: "문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.",
        error: "문의 접수 중 오류가 발생했습니다. 다시 시도해 주세요.",
      },
    },
    // 관리자 페이지
    admin: {
      nav: {
        dashboard: "대시보드",
        inquiries: "문의 관리",
        instructor: "강사 정보",
        proposals: "제안서 관리",
        content: "콘텐츠 관리",
        analytics: "접속 현황",
      },
      inquiries: {
        title: "문의 관리",
        status: {
          new: "신규",
          processing: "처리중",
          completed: "완료",
        },
        type: {
          personal: "개인",
          corporate: "기업",
        },
      },
      content: {
        title: "콘텐츠 관리",
        personal: "개인 코칭",
        corporate: "기업 코칭",
        section: "섹션 정보",
        items: "하위 항목",
        icon: "아이콘",
        save: "저장하기",
        saving: "저장 중...",
        success: "콘텐츠가 성공적으로 저장되었습니다.",
        error: "저장 중 오류가 발생했습니다.",
      },
      language: {
        korean: "한국어",
        chinese: "中文",
        english: "English",
      },
    },
    // 공통
    common: {
      loading: "로딩 중...",
      error: "오류가 발생했습니다.",
      save: "저장",
      cancel: "취소",
      edit: "수정",
      delete: "삭제",
      confirm: "확인",
      back: "뒤로",
    },
  },
  zh: {
    // 导航
    nav: {
      home: "首页",
      personalCoaching: "个人辅导",
      corporateCoaching: "企业辅导",
      instructor: "讲师介绍",
      inquiry: "咨询",
    },
    // 主页
    home: {
      hero: {
        title: "AI时代，为您的成长",
        subtitle: "量身定制的辅导服务",
        description: "为个人和企业AI能力提升提供专业辅导计划",
        ctaPersonal: "开始个人辅导",
        ctaCorporate: "咨询企业辅导",
      },
      personalCoaching: {
        badge: "个人辅导",
        downloadProposal: "下载提案",
      },
      corporateCoaching: {
        badge: "企业辅导",
        downloadProposal: "下载提案",
      },
      instructor: {
        badge: "讲师介绍",
        viewProfile: "查看详细资料",
      },
      inquiry: {
        title: "咨询",
        subtitle: "对AI辅导有疑问吗？随时联系我们。",
        form: {
          name: "姓名",
          namePlaceholder: "张三",
          email: "电子邮件",
          emailPlaceholder: "zhang@example.com",
          phone: "电话号码",
          phonePlaceholder: "138-1234-5678",
          type: "咨询类型",
          typePersonal: "个人辅导",
          typeCorporate: "企业辅导",
          message: "咨询内容",
          messagePlaceholder: "请自由填写您的咨询内容。",
          submit: "提交咨询",
          submitting: "发送中...",
        },
        success: "您的咨询已成功提交。我们会尽快与您联系。",
        error: "提交咨询时发生错误。请重试。",
      },
    },
    // 管理员页面
    admin: {
      nav: {
        dashboard: "仪表板",
        inquiries: "咨询管理",
        instructor: "讲师信息",
        proposals: "提案管理",
        content: "内容管理",
        analytics: "访问统计",
      },
      inquiries: {
        title: "咨询管理",
        status: {
          new: "新",
          processing: "处理中",
          completed: "已完成",
        },
        type: {
          personal: "个人",
          corporate: "企业",
        },
      },
      content: {
        title: "内容管理",
        personal: "个人辅导",
        corporate: "企业辅导",
        section: "部分信息",
        items: "子项目",
        icon: "图标",
        save: "保存",
        saving: "保存中...",
        success: "内容已成功保存。",
        error: "保存时发生错误。",
      },
      language: {
        korean: "한국어",
        chinese: "中文",
        english: "English",
      },
    },
    // 通用
    common: {
      loading: "加载中...",
      error: "发生错误。",
      save: "保存",
      cancel: "取消",
      edit: "编辑",
      delete: "删除",
      confirm: "确认",
      back: "返回",
    },
  },
  en: {
    // Navigation
    nav: {
      home: "Home",
      personalCoaching: "Personal Coaching",
      corporateCoaching: "Corporate Coaching",
      instructor: "Instructor",
      inquiry: "Contact",
    },
    // Home page
    home: {
      hero: {
        title: "For Your Growth in the AI Era",
        subtitle: "Customized Coaching Service",
        description: "Professional coaching programs to enhance AI capabilities for individuals and businesses",
        ctaPersonal: "Start Personal Coaching",
        ctaCorporate: "Inquire About Corporate Coaching",
      },
      personalCoaching: {
        badge: "Personal Coaching",
        downloadProposal: "Download Proposal",
      },
      corporateCoaching: {
        badge: "Corporate Coaching",
        downloadProposal: "Download Proposal",
      },
      instructor: {
        badge: "Instructor",
        viewProfile: "View Detailed Profile",
      },
      inquiry: {
        title: "Contact Us",
        subtitle: "Have questions about AI coaching? Feel free to reach out anytime.",
        form: {
          name: "Name",
          namePlaceholder: "John Doe",
          email: "Email",
          emailPlaceholder: "john@example.com",
          phone: "Phone",
          phonePlaceholder: "+1-234-567-8900",
          type: "Inquiry Type",
          typePersonal: "Personal Coaching",
          typeCorporate: "Corporate Coaching",
          message: "Message",
          messagePlaceholder: "Please feel free to write your inquiry.",
          submit: "Submit Inquiry",
          submitting: "Sending...",
        },
        success: "Your inquiry has been successfully submitted. We will contact you soon.",
        error: "An error occurred while submitting your inquiry. Please try again.",
      },
    },
    // Admin pages
    admin: {
      nav: {
        dashboard: "Dashboard",
        inquiries: "Inquiry Management",
        instructor: "Instructor Info",
        proposals: "Proposal Management",
        content: "Content Management",
        analytics: "Analytics",
      },
      inquiries: {
        title: "Inquiry Management",
        status: {
          new: "New",
          processing: "Processing",
          completed: "Completed",
        },
        type: {
          personal: "Personal",
          corporate: "Corporate",
        },
      },
      content: {
        title: "Content Management",
        personal: "Personal Coaching",
        corporate: "Corporate Coaching",
        section: "Section Information",
        items: "Sub Items",
        icon: "Icon",
        save: "Save",
        saving: "Saving...",
        success: "Content has been successfully saved.",
        error: "An error occurred while saving.",
      },
      language: {
        korean: "한국어",
        chinese: "中文",
        english: "English",
      },
    },
    // Common
    common: {
      loading: "Loading...",
      error: "An error occurred.",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      confirm: "Confirm",
      back: "Back",
    },
  },
};

export type TranslationKey = string;

/**
 * 중첩된 객체에서 키 경로로 값을 가져옵니다.
 * 예: get(translations.ko, "nav.home") => "홈"
 */
function get(obj: any, path: string): string {
  const keys = path.split(".");
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
  }
  return result || path;
}

/**
 * 번역 함수를 생성합니다.
 */
export function createTranslator(language: Language) {
  return (key: string): string => {
    return get(translations[language], key);
  };
}
