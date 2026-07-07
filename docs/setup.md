# Project Setup Guide

Instructions for cloning and setting up the Melanoma Cancer Detection project locally.

## Prerequisites
- Python 3.9+
- Git
- (Optional) CUDA-enabled GPU for faster training
- pip or conda

## 1. Clone the Repository
```bash
git clone https://github.com/cepdnaclk/e22-co5430-melanoma-cancer-detection.git
cd e22-co5430-melanoma-cancer-detection
```

## 2. Set Up a Virtual Environment
Using venv:
```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

Or using conda:
```bash
conda create -n melanoma-detection python=3.9
conda activate melanoma-detection
```

## 3. Install Dependencies
```bash
pip install -r requirements.txt
```

## 4. Download the Dataset
This project uses the [Melanoma Cancer Dataset](https://www.kaggle.com/datasets/bhaveshmittal/melanoma-cancer-dataset) dataset.

1. Download the dataset from the source link above.
2. Place it under `data/raw/` (create the folder if it doesn't exist).
3. Run the preprocessing script:
```bash
   python scripts/preprocess.py
```

## 5. Run Training
```bash
python train.py --config configs/default.yaml
```

## 6. Run Evaluation
```bash
python evaluate.py --model-path checkpoints/best_model.pth
```

## Project Structure
