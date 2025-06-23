import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";

const CariesDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [xrayimg, setXrayimg] = useState(null);
  const [deptImage, setdeptImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [severityData, setSeverityData] = useState([]);
  const [messages, setmessages] = useState([]);
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  console.log(selectedFile);

  useEffect(() => {
    if (useCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    return stopCamera;
  }, [useCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Failed to start camera:", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    resetResultState();
  };

  const handleCapture = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 640, 480);

    canvasRef.current.toBlob((blob) => {
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(blob));
      resetResultState();
    }, "image/jpeg");
  };

  const resetResultState = () => {
    setDetectionResult(null);
    setProcessedImage(null);
    setXrayimg(null);
    setSeverityData([]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/detect",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);

      if (response.data.processed_image) {
        setDetectionResult(response.data);
        setProcessedImage(
          `http://127.0.0.1:5000/${response.data.processed_image}`
        );
        setXrayimg(`http://127.0.0.1:5000/${response.data.xray_image}`);
        setdeptImage(response.data.depth_plot);
        setSeverityData(response.data.severity || []);
        setmessages(response.data.messages || []);
      } else {
        alert(
          "No caries detected; skipping X-ray generation and depth estimation."
        );
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };
  const handleDownloadReport = async () => {
    if (!detectionResult || !processedImage || !xrayimg) return;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(18);
    doc.text("Caries Detection Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);

    // Summary
    doc.setFontSize(14);
    doc.text("Detection Summary:", 20, 40);
    doc.setFontSize(12);
    doc.text(
      `Faster R-CNN Detections: ${detectionResult.frcnn_boxes.length}`,
      20,
      50
    );

    // Severity Details
    let y = 60;
    if (severityData.length > 0) {
      doc.setFontSize(14);
      doc.text("Severity Analysis:", 20, y);
      doc.setFontSize(12);
      y += 10;
      severityData.forEach((item, index) => {
        doc.text(
          `${index + 1}. Severity: ${item.severity}, Confidence: ${(
            item.confidence * 100
          ).toFixed(2)}%`,
          20,
          y
        );
        y += 10;
      });
    }

    // Depth Analysis
    if (messages.length > 0) {
      y += 10;
      doc.setFontSize(14);
      doc.text("Depth Analysis:", 20, y);
      y += 10;
      doc.setFontSize(12);
      messages.forEach((msg, index) => {
        doc.text(`${index + 1}. ${msg}`, 20, y);
        y += 10;
      });
    }

    const processedBase64 = await convertToBase64(processedImage);
    const xrayBase64 = await convertToBase64(xrayimg);
    const depthBase64 = `data:image/png;base64,${deptImage}`;

    doc.addPage();
    doc.setFontSize(14);
    doc.text("Processed Image", 20, 20);
    doc.addImage(processedBase64, "JPEG", 20, 30, 160, 100);

    doc.addPage();
    doc.text("X-ray Image", 20, 20);
    doc.addImage(xrayBase64, "JPEG", 20, 30, 160, 100);

    if (deptImage) {
      const depthPlotBase64 = await convertToBase64(depthBase64);
      doc.addPage();
      doc.text("Depth Plot", 20, 20);
      doc.addImage(depthPlotBase64, "PNG", 20, 30, 160, 100);
    }

    doc.save("Caries_Detection_Report.pdf");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white text-center py-3">
          <h2 className="mb-0">Caries Detection System</h2>
        </div>
        <div className="card-body">
          <div className="mb-3 text-center">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => setUseCamera(false)}
              disabled={!useCamera}
            >
              Upload Image
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setUseCamera(true)}
              disabled={useCamera}
            >
              Use Camera
            </button>
          </div>

          {!useCamera ? (
            <div className="mb-4">
              <label className="form-label fw-bold">Upload an Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="text-center mb-4">
              <video
                ref={videoRef}
                width="640"
                height="480"
                className="rounded shadow mb-3"
              />
              <br />
              <button className="btn btn-primary" onClick={handleCapture}>
                Capture Photo
              </button>
              <canvas
                ref={canvasRef}
                width="640"
                height="480"
                style={{ display: "none" }}
              />
            </div>
          )}

          {previewImage && (
            <div className="text-center mb-4">
              <h5 className="text-primary fw-bold mb-3">
                Uploaded Image Preview
              </h5>
              <img
                src={previewImage}
                alt="Preview"
                className="img-thumbnail w-50 shadow"
              />
            </div>
          )}

          <div className="text-center mb-4">
            <button
              onClick={handleUpload}
              className="btn btn-success btn-lg px-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Detecting...
                </>
              ) : (
                "Detect Caries"
              )}
            </button>
          </div>

          {detectionResult && (
            <>
              <div className="alert alert-info text-center" role="alert">
                <h4 className="alert-heading">Detection Results</h4>
                <p className="mb-1">
                  <strong>Faster R-CNN Detections:</strong>{" "}
                  {detectionResult.frcnn_boxes.length}
                </p>
              </div>

              {severityData.length > 0 && (
                <div className="card mt-4 shadow-sm">
                  <div className="card-header bg-info text-white fw-bold text-center">
                    Severity Analysis
                  </div>
                  <ul className="list-group list-group-flush">
                    {severityData.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        Severity: {item.severity}
                        <span className="badge bg-warning text-dark">
                          {(item.confidence * 100).toFixed(2)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {processedImage && (
                <div className="card mt-4 shadow-sm">
                  <div className="card-header bg-success text-white fw-bold text-center">
                    Processed Image
                  </div>
                  <div className="card-body text-center">
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                </div>
              )}

              {xrayimg && (
                <div className="text-center mt-4">
                  <h5 className="text-muted">X-ray Image</h5>
                  <img
                    src={xrayimg}
                    alt="X-ray Result"
                    className="img-thumbnail w-50 shadow"
                  />
                </div>
              )}
              {deptImage && (
                <img
                  src={`data:image/png;base64,${deptImage}`}
                  alt="Caries Prediction Plot"
                  style={{ maxWidth: "100%" }}
                />
              )}

              {messages.length > 0 && (
                <div className="card mt-4 shadow-sm">
                  <div className="card-header bg-secondary text-white fw-bold text-center">
                    Depth Analysis
                  </div>
                  <ul className="list-group list-group-flush">
                    {messages.map((msg, index) => (
                      <li key={index} className="list-group-item">
                        {msg}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-center mt-4">
                <button
                  onClick={handleDownloadReport}
                  className="btn btn-secondary btn-lg px-4"
                >
                  Download Report
                </button>
              </div>
            </>
          )}
        </div>
        <div className="card-footer text-muted text-center">
          &copy; {new Date().getFullYear()} Caries Detection System
        </div>
      </div>
    </div>
  );
};

export default CariesDetection;
