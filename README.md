# Melanoma Cancer Detection using Computer Vision & Machine Learning

## Overview

This project implements a computer vision and machine learning pipeline to classify dermoscopic skin lesion images as **benign** or **malignant (melanoma)**. It uses the [Melanoma Cancer Dataset](https://www.kaggle.com/datasets/bhaveshmittal/melanoma-cancer-dataset) from Kaggle, which provides a labeled collection of skin lesion images split into training and testing sets. The goal is to build an automated screening tool that assists in early melanoma detection, where timely diagnosis significantly improves patient outcomes.

## Motivation

Melanoma is one of the most aggressive forms of skin cancer, and early detection is critical to survival rates. Manual screening by dermatologists, while effective, is time-consuming and subject to human variability. This project explores whether a CNN-based classifier can serve as a reliable second opinion or triage tool, flagging suspicious lesions for further clinical review.

## Dataset

- **Source:** [Kaggle - Melanoma Cancer Dataset](https://www.kaggle.com/datasets/bhaveshmittal/melanoma-cancer-dataset)
- **Classes:** Benign, Malignant
- **Structure:** Pre-split into `train/` and `test/` directories, each containing class-labeled subfolders of images

## Project Pipeline

1. **Data Exploration & Preprocessing**
   - Image resizing and normalization
   - Optional dermoscopy-specific preprocessing (hair artifact removal, contrast enhancement, noise reduction)
   - Data augmentation (rotation, flipping, zoom) to improve generalization and address class imbalance

2. **Feature Extraction / Model Architecture**
   - Custom Convolutional Neural Network (CNN), and/or
   - Transfer learning using pretrained architectures (e.g., ResNet, EfficientNet, VGG)

3. **Training**
   - Train/validation split with appropriate loss function (e.g., binary cross-entropy)
   - Class weighting or oversampling to handle any class imbalance

4. **Evaluation**
   - Accuracy, precision, recall (sensitivity), specificity, F1-score
   - Confusion matrix and ROC-AUC curve
   - Emphasis on minimizing **false negatives**, since missed malignant cases carry serious clinical consequences

5. **Inference**
   - Given a new image, output a binary classification (benign/malignant) with an associated confidence score

## Tech Stack

- **Language:** Python
- **CV/ML Libraries:** OpenCV, TensorFlow/Keras or PyTorch, scikit-learn
- **Data Handling:** NumPy, Pandas
- **Visualization:** Matplotlib, Seaborn

## Project Structure

```
melanoma-detection/
├── data/
│   ├── train/
│   └── test/
├── notebooks/
│   └── exploration.ipynb
├── src/
│   ├── preprocessing.py
│   ├── model.py
│   ├── train.py
│   └── evaluate.py
├── models/
├── requirements.txt
└── README.md
```

## Getting Started

### Prerequisites
```bash
pip install -r requirements.txt
```

### Download the Dataset
Download the dataset from Kaggle and place it in the `data/` directory following the structure above.

### Train the Model
```bash
python src/train.py
```

### Evaluate the Model
```bash
python src/evaluate.py
```

## Results


## Disclaimer

This project is intended for **educational and research purposes only**. It is not a certified medical diagnostic tool and should not be used as a substitute for professional dermatological evaluation.

## License

MIT License

## Acknowledgments

- Dataset provided by [Bhavesh Mittal on Kaggle](https://www.kaggle.com/datasets/bhaveshmittal/melanoma-cancer-dataset)
