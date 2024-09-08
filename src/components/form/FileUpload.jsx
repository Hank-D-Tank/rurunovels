import React, { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FiImage, FiFile } from "react-icons/fi";
import { IoCloudUploadSharp } from "react-icons/io5";

const FileUpload = ({ placeholder, value, onChange, reset, onResetComplete }) => {
  const [file, setFile] = useState(value);
  const [inputKey, setInputKey] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (reset) {
      handleDelete();
      onResetComplete();
    }
  }, [reset]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    onChange(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgPreview = document.getElementById("img-preview");
        if (imgPreview && selectedFile.type.startsWith("image/")) {
          imgPreview.src = event.target.result;
        }
        document.getElementById("image-icon").style.display = selectedFile.type.startsWith("image/") ? "inline-block" : "none";
        document.getElementById("file-icon").style.display = selectedFile.type.startsWith("image/") ? "none" : "inline-block";
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDelete = () => {
    setFile(null);
    onChange(null);
    const imgPreview = document.getElementById("img-preview");
    if (imgPreview) {
      imgPreview.src = "";
    }
    document.getElementById("image-icon").style.display = "none";
    document.getElementById("file-icon").style.display = "none";
    setInputKey((prevKey) => prevKey + 1);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const selectedFile = e.dataTransfer.files[0];
    processFile(selectedFile);
  };

  return (
    <div
      className={`input-container input-custom-file-upload ${dragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label htmlFor="file-upload">
        <p>
          <span id="image-icon" style={{ display: "none" }}>
            <FiImage style={{ marginRight: "0.5rem" }} />
          </span>
          <span id="file-icon" style={{ display: "none" }}>
            <FiFile style={{ marginRight: "0.5rem" }} />
          </span>
          <span id="file-upload-text">
            {!file && <IoCloudUploadSharp style={{ color: "#fff" }} />}
            {file ? file.name : placeholder}
          </span>
        </p>
        <input key={inputKey} id="file-upload" type="file" onChange={handleFileChange} />
      </label>

      {file && (
        <>
          {file.type.startsWith("image/") && (
            <div className="preview">
              <img id="img-preview" src={URL.createObjectURL(file)} alt="Preview" style={{ maxWidth: "100%", marginTop: "1rem" }} />
            </div>
          )}
          <button className="file-upload-btn" onClick={handleDelete}>
            <AiFillDelete style={{ fontSize: "2rem" }} />
          </button>
        </>
      )}
    </div>
  );
};

export default FileUpload;
