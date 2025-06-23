import os
import cv2
import numpy as np
import torch
from flask import Flask, request, jsonify,send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torchvision.transforms import functional as F
from werkzeug.utils import secure_filename
import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend for Matplotlib
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression  # Add this import
import io
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

UPLOAD_FOLDER = r'uploads'
PROCESSED_FOLDER = 'processed'
XRAY_FOLDER = 'xray'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs(XRAY_FOLDER, exist_ok=True)


# Load YOLOv8 model
yolo_model = YOLO('best.pt')  # Change to your model path

print(yolo_model)
# Load Faster R-CNN model
faster_rcnn_model = fasterrcnn_resnet50_fpn(pretrained=True)
faster_rcnn_model.eval()

# Function to detect caries using YOLOv8
# Function to detect caries using YOLOv8
def detect_caries_yolo(image_path, conf_threshold=0.3):
    print(image_path)
    image_path = os.path.join(image_path)
    print(image_path)
    print(f"Image Path: {image_path}")

    print(f"File Exists: {os.path.exists(image_path)}")
    image = cv2.imread(image_path,cv2.IMREAD_COLOR)
    # Check if the image is read correctly
    if image is None:
        print("Error: Could not read the image. Check the file path.")
        return
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_rgb_resized = cv2.resize(image_rgb, (640, 640))
    results = yolo_model(image_rgb_resized, conf=conf_threshold)

    print(type(yolo_model))

    boxes = []
    confidences = []  # Store confidence scores for accuracy calculation
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
            confidence = box.conf[0].cpu().numpy()
            class_id = int(box.cls[0].cpu().numpy())
            if class_id == 4668092:  # Assuming caries is class 0
                boxes.append((int(x1), int(y1), int(x2), int(y2)))
                confidences.append(confidence)
                print(f"Caries detected with confidence {confidence:.2f}")

    return boxes, confidences

# Function to detect caries using Faster R-CNN
def detect_caries_faster_rcnn(image_path, conf_threshold=0.6):
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_tensor = F.to_tensor(image_rgb).unsqueeze(0)
    with torch.no_grad():
        predictions = faster_rcnn_model(image_tensor)

    boxes = []
    confidences = []  # Store confidence scores for accuracy calculation
    for box, score in zip(predictions[0]['boxes'], predictions[0]['scores']):
        if score > conf_threshold:
            x1, y1, x2, y2 = box.cpu().numpy()
            boxes.append((int(x1), int(y1), int(x2), int(y2)))
            confidences.append(score.item())
            print(f"Faster R-CNN detected with confidence {score:.2f}")

    return boxes, confidences


def get_caries_severity(confidence):
    if confidence > 0.9:
        return "Severe"
    elif 0.5 <= confidence <= 0.9:
        return "Moderate"
    else:
        return "Mild"
# Function to draw bounding boxes and severity labels
def draw_boxes_on_image(image_path, yolo_boxes, yolo_confidences, faster_rcnn_boxes, faster_rcnn_confidences):
    image = cv2.imread(image_path)

    if yolo_boxes or faster_rcnn_boxes:
        print("Drawing boxes on the image...")

        # Draw YOLO detections
        for (x1, y1, x2, y2), confidence in zip(yolo_boxes, yolo_confidences):
            severity = get_caries_severity(confidence)  # Get severity based on confidence
            cv2.rectangle(image, (x1, y1), (x2, y2), (255, 0, 0), 2)  # Blue box for YOLO
            cv2.putText(image, f'YOLO: {confidence:.2f} ({severity})', (x1, y1 - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)  # Blue text

        # Draw Faster R-CNN detections
        severity_list=[]
        for (x1, y1, x2, y2), confidence in zip(faster_rcnn_boxes, faster_rcnn_confidences):
            severity = get_caries_severity(confidence)  # Get severity based on confidence
            severity_list.append({"confidence": confidence, "severity": severity})
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)  # Green box for Faster R-CNN
            cv2.putText(image, f'FRCNN: {confidence:.2f} ({severity})', (x1, y1 - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, fontScale=0.8, color=(0, 255, 0), thickness=2)  # Green text
    output_path = os.path.join(PROCESSED_FOLDER, 'detected_image.jpg')
    cv2.imwrite(output_path, image)
    return output_path,severity_list  # Return the processed image
# Function to generate an X-ray effect image
def generate_xray_image(image_path):
    image = cv2.imread(image_path)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    inverted_image = cv2.bitwise_not(gray_image)
    equalized_image = cv2.equalizeHist(inverted_image)
    xray_effect_image = cv2.GaussianBlur(equalized_image, (5, 5), 0)
    output_path = 'xray_effect_image.jpg'
    cv2.imwrite(output_path, xray_effect_image)
    print(f"X-ray effect image saved as {output_path}")
    return output_path


# Function to estimate caries depth on X-ray image
def estimate_caries_depth(xray_image_path):
    xray_image = cv2.imread(xray_image_path, cv2.IMREAD_GRAYSCALE)
    blurred_image = cv2.GaussianBlur(xray_image, (5, 5), 0)
    _, thresholded_image = cv2.threshold(blurred_image, 127, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(thresholded_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    caries_depths = []
    depth_messages = []

    for i, contour in enumerate(contours):
        x, y, w, h = cv2.boundingRect(contour)
        caries_depth = h
        caries_depths.append(caries_depth)

        message = f"Caries region {i + 1} depth: {caries_depth} pixels"
        depth_messages.append(message)

        cv2.rectangle(xray_image, (x, y), (x + w, y + h), (255, 0, 0), 2)
        cv2.putText(xray_image, f"Depth: {caries_depth}px", (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

    output_path = os.path.join(XRAY_FOLDER, 'xray_effect_image.jpg')
    cv2.imwrite(output_path, xray_image)

    return caries_depths, depth_messages, output_path

# Function to predict caries progression
def predict_caries_progression(depths):
    if not depths:
        print("No caries depths detected.")
        return

    # Generate dynamic time intervals based on available depths
    time_intervals = list(range(1, len(depths) + 1))

    X = np.array(time_intervals).reshape(-1, 1)
    y = np.array(depths)
    model = LinearRegression()
    model.fit(X, y)

    future_times = np.array([len(depths) + 1, len(depths) + 3]).reshape(-1, 1)
    predicted_depths = model.predict(future_times)

    plt.plot(time_intervals, depths, marker='o', label="Recorded Depth")
    plt.plot(future_times, predicted_depths, 'r--', label="Predicted Progression")
    plt.xlabel("Time (days)")
    plt.ylabel("Caries Depth (px)")
    # plt.legend()
    # plt.show()

    # Save plot to a BytesIO object and encode as base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close()

    return image_base64



@app.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    print("Running YOLOv8 detection...")
    yolo_boxes, yolo_confidences = detect_caries_yolo(filepath, conf_threshold=0.3)

    print("Running Faster R-CNN detection...")
    faster_rcnn_boxes, faster_rcnn_confidences = detect_caries_faster_rcnn(filepath, conf_threshold=0.6)

    # processed_image_path = draw_boxes(filepath, yolo_boxes, frcnn_boxes)

    # print(filepath)
    # print(yolo_boxes)
    # print(yolo_confidences)
    # print(faster_rcnn_boxes)
    # print(faster_rcnn_confidences)
    
    processed_image_path=None

    if yolo_boxes or faster_rcnn_boxes:  # Only generate X-ray image if caries are detected
        processed_image_path,severity_list = draw_boxes_on_image(filepath, yolo_boxes, yolo_confidences, faster_rcnn_boxes, faster_rcnn_confidences)


        # plt.figure(figsize=(10, 10))
        # plt.imshow(cv2.cvtColor(processed_image_path, cv2.COLOR_BGR2RGB))
        # plt.axis('off')
        # plt.show()
        output_path = 'processed/detected_image.jpg'
        cv2.imwrite(output_path, processed_image_path)
        print(f'Detected image saved at: {output_path}')

        print("Generating X-ray effect image...")
        xray_image_path = generate_xray_image(filepath)
        print("Estimating caries depth on X-ray image...")
        depths,messages,xray_image = estimate_caries_depth(xray_image_path)  # Get depth values

        # 👉 Call the function to predict caries progression
        depth_plot= predict_caries_progression(depths)

        # Calculate and print detection accuracies
        total_yolo_confidence = sum(yolo_confidences)
        total_frcnn_confidence = sum(faster_rcnn_confidences)
        num_yolo_detections = len(yolo_boxes)
        num_frcnn_detections = len(faster_rcnn_boxes)

        if num_yolo_detections > 0:
            yolo_accuracy = total_yolo_confidence / num_yolo_detections
            print(f"YOLOv8 average detection confidence: {yolo_accuracy:.2f}")
        else:
            print("...")

        if num_frcnn_detections > 0:
            frcnn_accuracy = total_frcnn_confidence / num_frcnn_detections
            print(f"Faster R-CNN average detection confidence: {frcnn_accuracy:.2f}")
        else:
            print("No detections by Faster R-CNN")
    else:
        print("No caries detected; skipping X-ray generation and depth estimation.")

    # print(processed_image_path)
    # print(xray_image)
    # print(severity_list)
    response = {}

# Only add processed_image if it's not None or empty
    if processed_image_path:
        response['processed_image'] = processed_image_path
        response['frcnn_boxes'] = faster_rcnn_boxes
        response['depths'] = depths
        response['messages'] = messages
        response['severity'] = severity_list
        response['xray_image'] = xray_image
        response['depth_plot'] = depth_plot
    else:
        response['processed_image'] = None

    return jsonify(response)


@app.route('/processed/<filename>')
def get_image(filename):
    return send_from_directory("processed", filename)  # Adjust folder path
@app.route('/xray/<filename>')
def get_Xray_image(filename):
    return send_from_directory("xray", filename)  # Adjust folder path


if __name__ == '__main__':
    app.run(debug=True)
