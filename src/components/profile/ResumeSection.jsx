import React, { useState } from 'react';
import { Upload, FileText, Download, Trash2, Eye, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

const ResumeSection = ({ resume, onUpdate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = (file) => {
    setUploadError('');
    
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const resumeData = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target.result,
        uploadedAt: new Date().toISOString()
      };
      onUpdate(resumeData);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your resume?')) {
      onUpdate(null);
    }
  };

  const handleView = () => {
    if (resume?.data) {
      const newWindow = window.open();
      newWindow.document.write(`
        <iframe src="${resume.data}" style="width:100%;height:100vh;border:none;" title="Resume Preview"></iframe>
      `);
    }
  };

  const handleDownload = () => {
    if (resume?.data) {
      const link = document.createElement('a');
      link.href = resume.data;
      link.download = resume.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume</h2>

      {!resume ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload your resume</h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your resume here, or click to browse
          </p>
          <label className="inline-block">
            <Button variant="blue" className="cursor-pointer">
              Choose File
            </Button>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Supports PDF, DOC, DOCX up to 5MB
          </p>
          
          {uploadError && (
            <div className="mt-4 text-sm text-red-600 flex items-center justify-center">
              <span className="mr-1">⚠️</span>
              {uploadError}
            </div>
          )}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{resume.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(resume.size)} • Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                </p>
                <div className="flex items-center mt-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Successfully uploaded</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleView}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="inline-block">
              <Button variant="outline" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Re-upload Resume
              </Button>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </label>
          </div>
          
          {uploadError && (
            <div className="mt-4 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {uploadError}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeSection;