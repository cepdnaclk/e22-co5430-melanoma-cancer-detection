---
layout: home
permalink: index.html
repository-name: e22-co5430-melanoma-cancer-detection
title: Melanoma Cancer Detection
---

# Melanoma Skin Cancer Detection using Image Processing and Deep Learning

> **CO5430 Image Proceesing Project · Medical Imaging Track**  
> **Department of Computer Engineering · University of Peradeniya**  
> **Group 15 (E/22)**  
> **Supervisor:** Dr. Upul Jayasinghe

---

## Team
- **E/22/052** - K. H. D. M. Bimsara (`e22052@eng.pdn.ac.lk`)
- **E/22/058** - M. M. T. Cooray (`e22058@eng.pdn.ac.lk`)
- **E/22/353** - G. K. G. Sandeepa (`e22353@eng.pdn.ac.lk`)
- **E/22/419** - R. G. S. T. Weerasekara (`e22419@eng.pdn.ac.lk`)

---

## Table of Contents
1. [Introduction & Clinical Motivation](#introduction--clinical-motivation)
2. [Milestone Progress & Implementation Plan](#milestone-progress--implementation-plan)
3. [Dataset & Preprocessing](#dataset--preprocessing)
4. [Methodology & Model Architectures](#methodology--model-architectures)
5. [Experimental Results & Ablation Study](#experimental-results--ablation-study)
6. [Explainable AI (Grad-CAM Visualizations)](#explainable-ai-grad-cam-visualizations)
7. [Links & Resources](#links--resources)

---

## Introduction & Clinical Motivation

Melanoma is the most aggressive form of cutaneous malignancy, characterized by rapid metastasis and high fatality rates if left untreated. However, early-stage diagnosis yields 5-year survival rates exceeding 98%.

Automated diagnostic systems powered by Deep Learning offer scalable assistance for clinical triaging. In this project, we develop an empirical computer vision pipeline that classifies dermoscopy images into **Benign** and **Malignant** categories, paired with **Grad-CAM (Gradient-weighted Class Activation Mapping)** to provide visual explanations of model predictions.

---

## Milestone Progress & Implementation Plan

| Milestone | Status | Key Deliverables & Progress |
| :--- | :---: | :--- |
| **M1: Project Proposal** | **Done** | Proposal submission defining project scope, clinical metrics, and dataset choice (`docs/documentation/CO5430_Project_Proposal.pdf`). |
| **M2: Baseline Pipeline** | **Done** | Baseline pipeline and presentation slide deck (`docs/documentation/CO5430_Group15_M2.pdf`). |
| **M3: Prototype & Results** | **Completed** | Full multi-model pipeline (Baseline CNN from scratch, ResNet-18 (Feature Extraction & Fine-Tuning), EfficientNet-B0, complete test set metrics table, confusion matrices, ROC/PR curves, and Grad-CAM saliency grids) and results presentation (`docs/documentation/CO5430_Group15_M3.pdf` |
| **M4: Experiment Freeze** | *Upcoming* | Hyperparameter tuning freeze, finalizing model checkpoints and quantitative logs. |
| **M5: Technical Draft Report** | *Upcoming* | Comprehensive IEEE manuscript drafting with full qualitative and quantitative discussion. |
| **M6: Final Submission & Demo**| *Upcoming* | Final IEEE report submission, clean code release, and oral presentation. |

---

## Dataset & Preprocessing

- **Dataset:** [Kaggle — Melanoma Cancer Dataset](https://www.kaggle.com/datasets/bhaveshmittal/melanoma-cancer-dataset)
- **Image Count:** 13,879 dermoscopic images (224 × 224 RGB resolution)
- **Partitions:** 10,691 training samples, 1,188 validation samples (10%), 2,000 held-out test samples (1,000 Benign, 1,000 Malignant).
- **Data Augmentation:** Random rotations ($\pm 15^\circ$), horizontal/vertical flips, and color jitter (brightness, contrast, saturation).
- **Normalization:** Custom dataset channel statistics ($\mu_{\text{RGB}} = [0.7635, 0.5461, 0.5704]$, $\sigma_{\text{RGB}} = [0.1409, 0.1519, 0.1695]$) and ImageNet stats for transfer learning.

---

## Methodology & Model Architectures

1. **Custom Baseline CNN (From Scratch):**
   - 3 consecutive Convolutional blocks (Conv2d $3\times3$ $\rightarrow$ BatchNorm $\rightarrow$ ReLU $\rightarrow$ MaxPool2d) with 32, 64, and 128 filters $\rightarrow$ Global Average Pooling $\rightarrow$ Dropout ($p=0.4$) $\rightarrow$ Dense ($128 \rightarrow 64$) $\rightarrow$ Binary logit. Total params: **~94 K**.
2. **ResNet-18 (Feature Extraction):**
   - Frozen ImageNet backbone + custom classification head.
3. **ResNet-18 (Fine-Tuning):**
   - Unfrozen deep residual blocks (`layer3`, `layer4`) and classification head fine-tuned with cosine-annealed learning rate ($\eta = 3 \times 10^{-4}$).
4. **EfficientNet-B0 (Compound Scaling):**
   - Fine-tuned MBConv backbone with compound depth/width scaling for maximum parameter efficiency.

---

## Experimental Results & Ablation Study

Evaluated on **2,000 held-out test images**:

| Model | Architecture Strategy | Accuracy | Precision | Sensitivity / Recall | Specificity | F1-Score | ROC-AUC | PR-AUC |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Baseline CNN** | Trained from Scratch | 86.00% | 0.9000 | 0.8100 | 0.9100 | 0.8526 | 0.9446 | 0.9350 |
| **ResNet-18 (Feat. Ext.)** | Frozen Backbone | 88.40% | 0.8887 | 0.8780 | 0.8900 | 0.8833 | 0.9494 | 0.9460 |
| **EfficientNet-B0** | Fine-Tuned Backbone | 93.95% | 0.9554 | 0.9220 | **0.9570** | 0.9384 | 0.9850 | 0.9845 |
| **ResNet-18 (Fine-Tuned)** | Fine-Tuned (Layer3+4) | **95.00%** | **0.9564** | **0.9430** | **0.9570** | **0.9496** | **0.9882** | **0.9877** |

---

## Explainable AI (Grad-CAM Visualizations)

To ensure clinical trustworthiness, we generate hook-based **Grad-CAM** saliency maps highlighting the convolutional activation regions that drive network decisions across:
- ✅ **Correct Benign & Correct Malignant:** Verifies focus on pigment network asymmetry and border irregularity.
- ⚠️ **False Positives & False Negatives:** Analyzes failure modes (hair artifacts, low contrast, atypical benign nevi).

---

## Links & Resources

- [Project Repository](https://github.com/cepdnaclk/e22-co5430-melanoma-cancer-detection)
- [Project Documentation Site](https://cepdnaclk.github.io/e22-co5430-melanoma-cancer-detection)
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)
