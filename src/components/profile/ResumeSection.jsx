import React from 'react';
import { Upload, FileText, Eye, Trash2, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

const ResumeSection = ({ 
  resume, 
  onResumeUpload, 
  onResumeDelete, 
  uploadError 
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      onResumeUpload(null, 'Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onResumeUpload(null, 'File size must be less than 5MB');
      return;
    }

    onResumeUpload(file, null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const syntheticEvent = {
        target: { files: [file] }
      };
      handleFileChange(syntheticEvent);
    }
  };

  const handleView = () => {
    if (resume?.url) {
      window.open(resume.url, '_blank');
    }
  };

  const handleDownload = () => {
    if (resume?.url && resume?.name) {
      const link = document.createElement('a');
      link.href = resume.url;
      link.download = resume.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume</h2>
          <p className="text-gray-600">Upload your latest resume</p>
        </div>
        <FileText className="w-8 h-8 text-blue-600" />
      </div>

      {!resume ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload your resume
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <label className="inline-block">
            <Button variant="blue" className="cursor-pointer">
              Choose File
            </Button>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            PDF, DOC, DOCX up to 5MB
          </p>
          {uploadError && (
            <div className="mt-4 text-sm text-red-600 flex items-center justify-center">
              <span className="mr-1">⚠️</span>
              {uploadError}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                  <span className="font-semibold text-gray-900">Resume uploaded</span>
                </div>
                <p className="text-sm text-gray-600">{resume.name}</p>
                <p className="text-xs text-gray-500">
                  {(resume.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleView}
                variant="outline"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button
                onClick={onResumeDelete}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-200">
            <label className="inline-block">
              <Button variant="outline" size="sm" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Re-upload
              </Button>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeSection;