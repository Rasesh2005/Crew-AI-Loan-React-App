import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone'; // Import the useDropzone hook
import './FileUpload.css'; // Ensure you create this CSS file for styling

const FileUpload = ({ onNext,onPrev }) => {
  const [dataFile, setDataFile] = useState(null);
  const [schemaFile, setSchemaFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { schemaRequired } = location.state || { schemaRequired: false };

  // Handling drag and drop for data and schema files
  const handleDrop = (acceptedFiles, setter) => {
    setter(acceptedFiles[0]);
    setIsDragging(false); // Reset dragging state after drop
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!dataFile) {
      alert('Please select a data file');
      return;
    }

    if (schemaRequired && !schemaFile) {
      alert('Please select a schema file');
      return;
    }

    const formData = new FormData();
    formData.append('data', dataFile);

    if (schemaRequired && schemaFile) {
      formData.append('schema_file', schemaFile);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/upload/', formData);
      if (response.status === 200) {
        console.log('Upload successful:', response.data);
        onNext();
        navigate('/results');
      } else {
        console.error('Upload failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  // Configuring dropzones for both data and schema files
  const dataDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, setDataFile),
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], // Accepts .xlsx
      'text/csv': ['.csv'], // Accepts .csv
    },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const schemaDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, setSchemaFile),
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], // Accepts .xlsx
      'text/csv': ['.csv'], // Accepts .csv
    }
  });

  return (
    <div className="file-upload-container">
      <button className="back-button" onClick={() => {onPrev();navigate('/');}}>
        Back to Workflow
      </button>
      <h3>Upload Required Files</h3>
      
      <div className={`dropzone ${isDragging ? 'dragging' : ''}`} {...dataDropzone.getRootProps()}>
        <input {...dataDropzone.getInputProps()} />
        {dataFile ? (
          <p>{dataFile.name} selected</p>
        ) : (
          <p>Drag & drop your <b>Data Spreadsheet file</b> here, or click to select</p>
        )}
      </div>

      {schemaRequired && (
        <div className="dropzone" {...schemaDropzone.getRootProps()}>
          <input {...schemaDropzone.getInputProps()} />
          {schemaFile ? (
            <p>{schemaFile.name} selected</p>
          ) : (
            <p>Drag & drop your <b>Database Schema file</b> here, or click to select</p>
          )}
        </div>
      )}

      <button className="submit-button" onClick={onSubmit}>Submit and Analyze</button>
    </div>
  );
};

export default FileUpload;
