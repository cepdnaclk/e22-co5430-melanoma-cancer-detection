# Melanoma Skin Cancer Detection using Computer Vision and Explainable AI (Grad-CAM)

> **CO5430 Computer Vision Project · Medical Imaging Track**  
> **Department of Computer Engineering · University of Peradeniya**  
> **Group 15 (E/22)**  
> **Supervisor:** Dr. Upul Jayasinghe

---

## Project Overview

Melanoma is the deadliest form of skin cancer, responsible for over 75% of skin cancer-related fatalities despite accounting for less than 5% of all skin cancer diagnoses. Early and accurate detection significantly improves patient 5-year survival rates (exceeding 98% when caught in localized stages). 

This project develops an end-to-end deep learning system for the automated binary classification of dermoscopic skin lesions into **Benign** and **Malignant (Melanoma)**. Beyond raw predictive accuracy, this work places primary emphasis on **clinical safety metrics (Sensitivity/Recall and Specificity)**, **decision threshold optimization**, and **Explainable AI (XAI)** using **Gradient-weighted Class Activation Mapping (Grad-CAM)** to localize and interpret the visual lesion patterns driving network decisions.

---

## Team & Department

| Registration No. | Student Name | Email |
| :---: | :--- | :--- |
| **E/22/052** | K. H. D. M. Bimsara | `e22052@eng.pdn.ac.lk` |
| **E/22/058** | M. M. T. Cooray | `e22058@eng.pdn.ac.lk` |
| **E/22/353** | G. K. G. Sandeepa | `e22353@eng.pdn.ac.lk` |
| **E/22/419** | R. G. S. T. Weerasekara | `e22419@eng.pdn.ac.lk` |

* **Project Documentation Site:** [https://cepdnaclk.github.io/e22-co5430-melanoma-cancer-detection/](https://cepdnaclk.github.io/e22-co5430-melanoma-cancer-detection/)
* **Project Repository:** [https://github.com/cepdnaclk/e22-co5430-melanoma-cancer-detection](https://github.com/cepdnaclk/e22-co5430-melanoma-cancer-detection)

---

## Implementation Plan & Milestone Progress

```mermaid
flowchart TD
    M1[M1: Project Proposal & Scope] -->|Completed| M2[M2: Data Audit & Baseline Setup]
    M2 -->|Completed| M3[M3: Transfer Learning, Evaluation & Grad-CAM]
    M3 -->|Completed| M4[M4: Experiment Freeze & Threshold Calibration]
    M4 -->|Current Stage| M5[M5: Draft Technical Report]
    M5 --> M6[M6: Final IEEE Report, Code Release & Demonstration]
```

### Milestone Progress Status

| Milestone | Target Date | Status | Key Deliverables & Artifacts |
| :--- | :---: | :---: | :--- |
| **M0: Group Formation & Topic** | 07 Jul | **Done** | Topic registration, dataset confirmation, repository setup. |
| **M1: Proposal & Project Plan** | 14 Jul | **Done** | Proposal document (`docs/documentation/CO5430_Project_Proposal.pdf`) defining scope, related work, and metrics. |
| **M2: Dataset & Baseline Checkpoint** | 28 Jul | **Done** | Data audit, normalization stats, baseline CNN training (`docs/documentation/CO5430_Group15_M2.pdf`). |
| **M3: Prototype & Preliminary Results** | 18 Aug | **Done** | Multi-model ablation (Baseline, ResNet-18, EfficientNet-B0), confusion matrices, and Grad-CAM grids (`docs/documentation/CO5430_Group15_M3.pdf`). |
| **M4: Experiment Freeze** | 25 Aug | **Completed** | Decision threshold sweep ($\tau \in [0.20, 0.50]$), weighted soft-voting Ensemble ($0.60\text{R} + 0.40\text{E}$), final test metric freeze, error analysis. |
| **M5: Draft Technical Report** | 01 Sep | **In Progress** | Complete IEEE-formatted draft report (6–8 pages) with all figures, methodology, and medical discussion. |
| **M6: Final Submission & Demonstration** | 07 Sep | **Upcoming** | Final IEEE manuscript, clean modular source package, and live oral viva demonstration. |

---

## Dataset Overview & Preprocessing

The project utilizes the [Melanoma Cancer Dataset](https://www.kaggle.com/datasets/bhaveshmittal/melanoma-cancer-dataset) from Kaggle:

| Dataset Property | Details |
| :--- | :--- |
| **Total Images** | **13,879** dermoscopic images (224 × 224 RGB, 3 channels) |
| **Class Distribution** | Balanced: **7,289 Benign** (52.5%) vs. **6,590 Malignant** (47.5%) |
| **Partitioning** | **Train:** 10,691 images (90% training) · **Validation:** 1,188 images (10% carve-out) · **Test:** 2,000 images (held-out) |
| **Dataset Normalization** | $\mu_{\text{RGB}} = [0.7635, 0.5461, 0.5704], \quad \sigma_{\text{RGB}} = [0.1409, 0.1519, 0.1695]$ |
| **Augmentation Pipeline** | Random horizontal flip ($p=0.5$), vertical flip ($p=0.2$), random rotation ($\pm 15^\circ$), and color jitter (brightness, contrast, saturation). |

---

## Model Architectures & Methodologies

1. **Baseline CNN (Trained from Scratch):**
   - 3 consecutive `ConvBlock` layers (Conv2d $3\times3$ $\rightarrow$ BatchNorm $\rightarrow$ ReLU $\rightarrow$ MaxPool2d $2\times2$) with channel depths 32, 64, 128.
   - Global Average Pooling (GAP) $\rightarrow$ Dropout ($p=0.4$) $\rightarrow$ Dense (128 $\rightarrow$ 64) $\rightarrow$ Single binary logit. *Total Parameters: ~94 K.*
2. **ResNet-18 (Feature Extraction):**
   - Pretrained ImageNet-1k backbone completely frozen; custom Dropout ($p=0.3$) + Linear ($512 \rightarrow 1$) classifier trained at $\eta = 10^{-3}$.
3. **ResNet-18 (Fine-Tuning):**
   - Deep residual blocks (`layer3` and `layer4`) plus classifier head unfrozen and fine-tuned at $\eta = 3 \times 10^{-4}$ with cosine annealing scheduler.
4. **EfficientNet-B0 (Compound Scaling):**
   - Pretrained MBConv backbone with compound depth/width scaling; final feature blocks (`features[7..8]`) and classifier ($1280 \rightarrow 1$) fine-tuned.
5. **Ensemble Blending (Weighted Soft Voting — Stretch Goal):**
   - Combines the posterior probabilities: $P_{\text{ensemble}} = 0.60 \times P_{\text{ResNet18}} + 0.40 \times P_{\text{EfficientNetB0}}$.

---

## Final Frozen Experimental Results (M4 Ablation)

Evaluated on the **2,000 held-out test images** (1,000 Benign vs. 1,000 Malignant):

| Experiment Configuration | Strategy / Threshold | Accuracy | Sensitivity (Recall) | Specificity | Precision | F1-Score | ROC-AUC | Missed Melanomas (FN) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Baseline CNN** | Trained from Scratch ($\tau=0.50$) | 86.50% | 82.00% | 91.00% | 0.9011 | 0.8586 | 0.9461 | 180 |
| **ResNet-18 (Feat. Ext.)** | Frozen Backbone ($\tau=0.50$) | 88.05% | 85.80% | 90.30% | 0.8984 | 0.8777 | 0.9478 | 142 |
| **EfficientNet-B0** | Fine-Tuned Backbone ($\tau=0.50$) | 93.85% | 91.70% | **96.00%** | **0.9582** | 0.9371 | 0.9846 | 83 |
| **ResNet-18 (Fine-Tuned)** | Fine-Tuned Layers 3+4 ($\tau=0.50$) | 94.05% | 93.50% | 94.60% | 0.9454 | 0.9402 | 0.9858 | 65 |
| **ResNet-18 (Calibrated)** | Fine-Tuned ($\tau=0.35$) | 94.55% | **96.00%** | 93.10% | 0.9329 | 0.9463 | 0.9858 | **40** *(38% reduction)* |
| **Ensemble (Standard)** | $0.60\text{R} + 0.40\text{E}$ ($\tau=0.50$) | **95.20%** | 94.30% | **96.10%** | **0.9603** | **0.9516** | **0.9903** | 57 |
| **Ensemble (Best Safety)** | $0.60\text{R} + 0.40\text{E}$ ($\tau=0.35$) | 95.05% | **97.20%** | 92.90% | 0.9319 | **0.9515** | **0.9903** | **28** *(84.4% reduction)* |

---

## Visual Artifacts & Explainability (Grad-CAM)

All high-resolution publication figures are stored in [`results/figures/`](results/figures/):

* **Comparative Metrics Heatmap:** [`results/figures/comparison_table_heatmap.png`](results/figures/comparison_table_heatmap.png)
* **Side-by-Side Confusion Matrices:** [`results/figures/side_by_side_confusion_matrices.png`](results/figures/side_by_side_confusion_matrices.png)
* **ROC & Precision-Recall Curves:** [`results/figures/roc_and_pr_curves_comparison.png`](results/figures/roc_and_pr_curves_comparison.png)
* **Threshold Calibration Trade-off Curve:** [`results/figures/threshold_calibration_curve.png`](results/figures/threshold_calibration_curve.png)
* **ResNet-18 Grad-CAM Saliency Grid (4 Groups):** [`results/figures/gradcam_resnet18_fine_tuned.png`](results/figures/gradcam_resnet18_fine_tuned.png)
* **Scratch vs. Pretrained Interpretability:** [`results/figures/gradcam_baseline_vs_resnet18_comparison.png`](results/figures/gradcam_baseline_vs_resnet18_comparison.png)
* **Diagnostic Misclassification Inspection:** [`results/figures/misclassified_false_positives.png`](results/figures/misclassified_false_positives.png) & [`results/figures/misclassified_false_negatives.png`](results/figures/misclassified_false_negatives.png)

---

## Repository Structure

```
e22-co5430-melanoma-cancer-detection/
├── notebooks/
│   ├── co5430-melanoma-cancer-detection-final.ipynb   ← Master Unified End-to-End Notebook (Kaggle/Colab)
│   └── co5430-melanoma-cancer-detection-final.py      ← Master Python Program
├── results/
│   ├── metrics.json                             ← Standard model evaluation metrics
│   ├── m4_frozen_metrics.json                   ← Complete M4 frozen metrics (all 7 setups & ensemble)
│   ├── README.md                                ← Detailed results documentation
│   └── figures/                                 ← High-resolution plots, ROC curves & Grad-CAM heatmaps
├── src/                                         ← Modular Python codebase
│   ├── dataset.py                               ← Dataset loaders, path auto-detection & transforms
│   ├── models.py                                ← BaselineCNN, ResNet18Model, EfficientB0 definitions
│   ├── train.py                                 ← Standardized training loop with early stopping
│   ├── evaluate.py                              ← Clinical metrics calculation & figure generation
│   ├── gradcam.py                               ← Hook-based Grad-CAM saliency mapping engine
│   └── predict.py                               ← Single-image CLI inference tool
├── docs/                                        ← Jekyll documentation website (GitHub Pages)
│   ├── _config.yml
│   ├── data/index.json                          ← Team metadata & supervisor details
│   ├── documentation/                           ← Project proposal, slides, assignment specs
│   └── README.md                                ← Website homepage source
├── requirements.txt                             ← Python environment dependencies
└── README.md                                    ← Project homepage
```

---
<!-- 
## Quick Start Guide

### Running on Kaggle (Recommended)
1. Open Kaggle and import [`notebooks/co5430-melanoma-cancer-detection.ipynb`](notebooks/co5430-melanoma-cancer-detection.ipynb).
2. In the right-hand panel:
   - Attach dataset: Click **`+ Add Input`** and search for `bhaveshmittal/melanoma-cancer-dataset`.
   - Enable GPU: Set **`Accelerator`** to **`GPU T4 x2`**.
   - Enable Internet: Set **`Internet`** to **`ON`** (to download ImageNet pretrained weights).
3. Click **`Run All`**. All training curves, confusion matrices, ROC curves, and Grad-CAM grids will display inline and save to `/kaggle/working/`.

--- -->

## Medical Disclaimer

> **IMPORTANT:** This software system is developed strictly for **academic and research purposes** as part of the CO5430 Computer Vision curriculum. It is not an FDA/CE-cleared medical device and should **never** be used as a replacement for professional dermatological diagnosis, clinical biopsy, or medical consultations.

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.
