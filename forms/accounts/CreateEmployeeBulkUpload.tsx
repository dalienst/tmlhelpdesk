"use client";

import { useState } from "react";
import { useCreateBulkEmployeesCSV, useDownloadTemplate } from "@/hooks/accounts/actions";
import toast from "react-hot-toast";
import { Loader2, UploadCloud, FileDown, FileSpreadsheet, X } from "lucide-react";

interface CreateEmployeeBulkUploadProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateEmployeeBulkUpload({ onSuccess, onCancel }: CreateEmployeeBulkUploadProps) {
  const { mutateAsync: uploadCSV, isPending: isUploading } = useCreateBulkEmployeesCSV();
  const { mutateAsync: downloadTemplate, isPending: isDownloading } = useDownloadTemplate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
      } else {
        toast.error("Please select a valid CSV file");
        e.target.value = "";
      }
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "employee_upload_template.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Template downloaded successfully");
    } catch (error: any) {
      toast.error("Failed to download template. Please try again.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      await uploadCSV({ file: selectedFile });
      toast.success("CSV uploaded and users created successfully!");
      setSelectedFile(null);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to upload CSV. Please check the file format and try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10">
        <div>
          <h2 className="text-2xl text-textBold text-gray-900 tracking-tight">Upload Users CSV</h2>
          <p className="text-sm text-gray-500 mt-1">Upload a spreadsheet to bulk create up to 100 users.</p>
        </div>
        
        <button
          onClick={handleDownloadTemplate}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/60 rounded-xl text-sm text-textBold transition-all shadow-sm disabled:opacity-50 group"
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />}
          Download Template
        </button>
      </div>

      <div className="bg-primary-blue/[0.03] border-2 border-dashed border-primary-blue/20 hover:border-primary-blue/40 hover:bg-primary-blue/[0.05] transition-all rounded-3xl p-10 flex flex-col items-center justify-center text-center group">
        {!selectedFile ? (
          <>
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-primary-blue mb-5 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-gray-900 text-textBold text-lg mb-1">Drag & Drop your CSV file here</p>
            <p className="text-sm text-gray-500 mb-8">or click to browse your files (max 100 rows)</p>
            <label className="bg-white border border-gray-200 hover:border-primary-blue text-gray-700 hover:text-primary-blue px-8 py-3 rounded-xl text-sm text-textBold shadow-sm hover:shadow-md cursor-pointer transition-all">
              Browse Files
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm mb-4">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <p className="text-gray-900 text-textBold text-lg mb-1">{selectedFile.name}</p>
            <p className="text-sm text-gray-500 mb-6">{(selectedFile.size / 1024).toFixed(2)} KB</p>
            
            <button
              onClick={() => setSelectedFile(null)}
              className="flex items-center gap-2 text-sm text-primary-red bg-primary-red/5 hover:bg-primary-red/10 px-4 py-2 rounded-lg font-medium transition-colors border border-primary-red/10"
            >
              <X className="w-4 h-4" /> Remove File
            </button>
          </>
        )}
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className="px-4 py-2.5 rounded-lg text-sm text-textBold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 border border-transparent"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="bg-primary-blue hover:bg-primary-blue/95 text-white px-6 py-2.5 rounded-lg text-sm text-textBold transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[150px]"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload & Create"}
        </button>
      </div>
    </div>
  );
}