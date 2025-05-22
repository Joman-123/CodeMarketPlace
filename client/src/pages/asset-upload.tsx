import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AssetUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadSuccess(false);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("فشل رفع الملف");
      setUploadSuccess(true);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4 text-center">رفع ملف رقمي</h2>
      <input
        type="file"
        ref={fileInputRef}
        className="block w-full mb-4"
        onChange={handleFileChange}
        accept="*"
        placeholder="اختر ملفًا للرفع"
        title="رفع ملف رقمي"
      />
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full"
      >
        {uploading ? "جاري الرفع..." : "رفع الملف"}
      </Button>
      {uploadSuccess && <p className="text-green-600 mt-2">تم رفع الملف بنجاح!</p>}
      {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
    </div>
  );
}
