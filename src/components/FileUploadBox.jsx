import React, { useState } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import '../styles/components/FileUploadBox.css';

const FileUploadBox = ({ onUpload }) => {
    const [file, setFile] = useState(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(selectedFile);
    };

    const removeFile = () => setFile(null);

    return (
        <div className="file-upload-container">
            {!file ? (
                <label
                    className="upload-box"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <UploadCloud size={48} className="upload-icon" />
                    <p className="upload-text">Drag & drop your file here</p>
                    <span className="upload-separator">or</span>
                    <span className="btn btn-secondary btn-small">Browse Files</span>
                    <input type="file" hidden onChange={handleChange} />
                </label>
            ) : (
                <div className="file-preview">
                    <div className="file-info">
                        <div className="file-icon-wrapper">
                            <File size={24} />
                        </div>
                        <div className="file-details">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                    </div>
                    <button onClick={removeFile} className="remove-file-btn">
                        <X size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUploadBox;
