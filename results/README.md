# Experimental Results & Model Evaluation

## CO5430 / CO543 — Computer Vision Project · Medical Imaging Track
**Task:** Automated Binary Classification of Dermoscopic Skin Lesions (Benign vs. Malignant Melanoma)  
**Dataset:** [Melanoma Cancer Dataset (Kaggle)](https://www.kaggle.com/datasets/bhaveshmittal/melanoma-cancer-dataset)  
**Evaluation Set:** 2,000 held-out test images (1,000 Benign, 1,000 Malignant)

---

## 1. Quantitative Performance Comparison

The table below summarizes the comparative performance of all evaluated architectures on the unseen test set, representing the empirical ablation study required by the course specification:

| Model | Strategy | Trainable Parameters | Accuracy | Precision | Sensitivity (Recall) | Specificity | F1-Score | ROC-AUC | PR-AUC |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Baseline CNN** | Trained from scratch | ~94 K | 86.00% | 0.9000 | 0.8100 | 0.9100 | 0.8526 | 0.9446 | 0.9350 |
| **ResNet-18 (Feat. Ext.)** | Frozen backbone + Linear Head | ~513 | 88.40% | 0.8887 | 0.8780 | 0.8900 | 0.8833 | 0.9494 | 0.9460 |
| **EfficientNet-B0** | Fine-tuned (blocks 7, 8 + Head) | ~4.0 M | 93.95% | 0.9554 | 0.9220 | **0.9570** | 0.9384 | 0.9850 | 0.9845 |
| **ResNet-18 (Fine-Tuned)** | Fine-tuned (layer3, layer4 + Head) | ~4.7 M | **95.00%** | **0.9564** | **0.9430** | **0.9570** | **0.9496** | **0.9882** | **0.9877** |

---

## 2. Key Findings & Insights

1. **Impact of Transfer Learning:**
   - Pretrained ImageNet features dramatically improve boundary detection and texture characterization compared to training from scratch, increasing accuracy from **86.00%** (Baseline CNN) to **95.00%** (ResNet-18 Fine-Tuned).
2. **Clinical Safety & Sensitivity:**
   - In medical imaging, **Sensitivity (Recall)** is the most critical metric because False Negatives (missed melanomas) are life-threatening. **ResNet-18 Fine-Tuned** achieved the highest sensitivity of **94.30%**, minimizing missed malignancies to 57 cases out of 1,000.
3. **Parameter Efficiency:**
   - **EfficientNet-B0** achieved **93.95%** accuracy with only ~4.0M trainable parameters, proving to be the most computationally efficient architecture for mobile/edge dermoscopy deployment.

---

## 3. Visual Artifacts in `results/figures/`

| Figure | Description |
| :--- | :--- |
| `comparison_table_heatmap.png` | Comprehensive comparative heatmap displaying all 7 evaluation metrics across all 4 models. |
| `side_by_side_confusion_matrices.png` | 4-way confusion matrices illustrating True Positives, False Positives, True Negatives, and False Negatives. |
| `roc_and_pr_curves_comparison.png` | Overlaid Receiver Operating Characteristic (ROC) and Precision-Recall (PR) curves. |
| `gradcam_resnet18_fine_tuned.png` | 4-Group Grad-CAM saliency heatmaps (Correct Benign, Correct Malignant, False Positive, False Negative). |
| `gradcam_baseline_vs_resnet18_comparison.png` | Side-by-side saliency comparison showing localization differences between Baseline CNN and ResNet-18. |
| `misclassified_false_positives.png` | Visual grid of benign lesions misclassified as malignant due to atypical pigmentation patterns. |
| `misclassified_false_negatives.png` | Visual grid of malignant lesions misclassified as benign for diagnostic risk analysis. |
| `dataset_class_distribution.png` | Partition breakdown and class balance (Benign vs. Malignant). |
| `training_curves_*.png` | Epoch-wise BCE loss and accuracy curves for each trained model. |

---

## 4. Machine-Readable Metrics

All raw scalars and confusion matrix counts are preserved in [`metrics.json`](metrics.json) for automated validation and benchmarking.
