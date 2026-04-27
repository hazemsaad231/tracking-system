// ─── Category File Types ─────────────────────────────────────────────────────

export interface CategoryFile {
  id: number;
  category_id: number;
  title: string;             // اسم الملف
  description: string | null;
  file: string;              // المسار النسبي: "category_files/xxx.pdf"
  file_url: string;          // الرابط الكامل للتحميل
  created_at: string;
}

export interface CategoryFilesApiResponse {
  data: CategoryFile[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    per_page?: number;
    to?: number | null;
    total?: number;
  };
}

export interface FileDetailResponse {
  success: boolean;
  message: string;
  data: CategoryFile;
}

export interface UploadFilePayload {
  file?: File;           // مطلوب في الرفع، اختياري في التعديل
  title: string;         // required by backend
  description?: string;  // اختياري
}
