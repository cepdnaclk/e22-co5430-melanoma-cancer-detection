# Experimental Results & Model Evaluation

## CO5430 / CO543 — Computer Vision Project · Medical Imaging Track
**Task:** Automated Binary Classification of Dermoscopic Skin Lesions (Benign vs. Malignant Melanoma)  
**Dataset:** [Melanoma Cancer Dataset (Kaggle)](https://www.kaggle.com/datasets/bhaveshmittal/melanoma-cancer-dataset)  
**Evaluation Set:** 2,000 held-out test images (1,000 Benign, 1,000 Malignant)

---

## 1. Final Frozen Master Performance Comparison (M4 Benchmark)

The table below summarizes the comparative performance of all evaluated architectures and optimization strategies on the 2,000 unseen test samples:

| Experiment Configuration | Strategy / Threshold | Accuracy | Sensitivity (Recall) | Specificity | Precision | F1-Score | ROC-AUC | Missed Melanomas (FN) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Baseline CNN** | Trained from Scratch ($\tau=0.50$) | 86.50% | 82.00% | 91.00% | 0.9011 | 0.8586 | 0.9461 | 180 |
| **ResNet-18 (Feat. Ext.)** | Frozen Backbone ($\tau=0.50$) | 88.05% | 85.80% | 90.30% | 0.8984 | 0.8777 | 0.9478 | 142 |
| **EfficientNet-B0** | Fine-Tuned Backbone ($\tau=0.50$) | 93.85% | 91.70% | **96.00%** | **0.9582** | 0.9371 | 0.9846 | 83 |
| **ResNet-18 (Fine-Tuned)** | Fine-Tuned Layers 3+4 ($\tau=0.50$) | 94.05% | 93.50% | 94.60% | 0.9454 | 0.9402 | 0.9858 | 65 |
| **ResNet-18 (Calibrated)** | Fine-Tuned ($\tau=0.35$) | 94.55% | **96.00%** | 93.10% | 0.9329 | 0.9463 | 0.9858 | **40** *(↓ 38% reduction)* |
| 🥇 **Ensemble (Standard)** | $0.60\text{R} + 0.40\text{E}$ ($\tau=0.50$) | **95.20%** | 94.30% | **96.10%** | **0.9603** | **0.9516** | **0.9903** | 57 |
| 🛡️ **Ensemble (Best Safety)** | $0.60\text{R} + 0.40\text{E}$ ($\tau=0.35$) | 95.05% | **97.20%** | 92.90% | 0.9319 | **0.9515** | **0.9903** | **28** *(↓ 84.4% reduction)* |

---

## 2. Key Findings & Clinical Insights

1. **Massive Reduction in Missed Cancers (Clinical Safety):**
   - In medical imaging, **Sensitivity (Recall)** is the most vital metric because missed melanomas (False Negatives) are life-threatening.
   - While the scratch Baseline CNN missed **180 melanomas**, the calibrated Ensemble model at $\tau=0.35$ reduces missed cases down to **only 28**, achieving a clinical Sensitivity of **97.20%**.
2. **Ensemble Blending Synergy:**
   - Weighted soft voting ($0.60 \times P_{\text{ResNet18}} + 0.40 \times P_{\text{EffNetB0}}$) achieved the highest overall test accuracy (**95.20%**) and ROC-AUC (**0.9903**), eliminating single-model boundary errors.
3. **Transfer Learning Impact:**
   - Pretrained ImageNet features significantly enhance boundary detection and texture extraction compared to scratch training, lifting accuracy from 86.50% to >94.00%.

---

## 3. Visual Artifacts in `results/figures/`

| Figure File | Description |
| :--- | :--- |
| `comparison_table_heatmap.png` | Comprehensive comparative heatmap displaying evaluation metrics across all models. |
| `side_by_side_confusion_matrices.png` | 4-way confusion matrices illustrating TP, FP, TN, and FN counts. |
| `roc_and_pr_curves_comparison.png` | Overlaid Receiver Operating Characteristic (ROC) and Precision-Recall (PR) curves. |
| `threshold_calibration_curve.png` | Sensitivity vs. Specificity trade-off curve across thresholds $\tau \in [0.20, 0.50]$. |
| `misclassified_false_positives.png` | Visual grid of benign lesions misclassified as malignant (purple header). |
| `misclassified_false_negatives.png` | Visual grid of malignant lesions missed as benign (orange header / critical clinical risk). |
| `gradcam_resnet18_fine_tuned.png` | 4-Group Grad-CAM saliency heatmaps (Correct Benign, Correct Malignant, FP, FN). |
| `gradcam_baseline_vs_resnet18_comparison.png` | Side-by-side saliency comparison showing localization differences: Baseline vs. ResNet-18. |
| `dataset_class_distribution.png` | Partition breakdown and class balance (Benign vs. Malignant). |
| `sample_images_inspection.png` | 2x5 grid of raw dermoscopic image samples. |
| `training_curves_*.png` | Epoch-wise BCE loss and accuracy curves for each trained model. |

---

## 4. Machine-Readable Metrics

All raw scalar values and confusion matrix entries are preserved in:
* [`metrics.json`](metrics.json) (Standard model metrics)
* [`m4_frozen_metrics.json`](m4_frozen_metrics.json) (Complete M4 frozen configurations including Ensemble and Calibrated thresholds)
