# Melanoma Cancer Detection using Computer Vision & Deep Learning

> **CO5430 Computer Vision | Group 15 | University of Peradeniya**

A CNN-based binary classifier that detects **melanoma** (malignant skin cancer) from dermoscopic images, using transfer learning on EfficientNetV2-S.

---

## Dataset

| Property | Details |
|---|---|
| **Source** | [Kaggle — Melanoma Cancer Dataset](https://www.kaggle.com/datasets/bhaveshmittal/melanoma-cancer-dataset) |
| **Task** | Binary classification: `benign` vs `malignant` |
| **Split** | Pre-split `train/` and `test/` directories with class-labelled sub-folders |
| **Imbalance** | Benign samples outnumber malignant → handled via `BCEWithLogitsLoss(pos_weight)` |

---

## Project Structure

```
e22-co5430-melanoma-cancer-detection/
├── notebooks/
│   ├── CO5430_melanoma_pipeline.ipynb   ← Main Colab notebook (run top-to-bottom)
│   └── CO5430_melanoma_pipeline.py      ← Plain Python version of the same pipeline
├── docs/
│   └── documentation/
│       ├── Group15_M2_Presentation.pdf  ← M2 milestone slide deck
│       ├── CO5430_Project_Proposal.pdf  ← Project proposal (M1)
│       └── CO543_CO5430_CV_Project_Assignment_Specification_2026.pdf
├── results/                             ← Model outputs, plots (to be added)
└── README.md
```

---

## Baseline Pipeline (M2)

### Preprocessing & Augmentation
- Resize images to **112 × 112** (ImageNet normalization)
- Training augmentations: random rotation ±20°, random horizontal/vertical flip
- Validation: resize + center crop only (no augmentation)

### Model Architecture
- **EfficientNetV2-S** pre-trained on ImageNet (transfer learning)
- Final classifier head replaced with a single linear neuron → binary output

### Training Setup
| Hyperparameter | Value |
|---|---|
| Optimizer | Adam (lr = 0.001) |
| Loss | BCEWithLogitsLoss + pos_weight |
| Scheduler | ReduceLROnPlateau (factor=0.1, patience=3) |
| Batch size | 256 |
| Epochs | up to 10 (early stopping, patience=5) |
| Precision | Mixed (AMP / GradScaler) |

---

## Quick Start (Google Colab)

1. Open [`notebooks/CO5430_melanoma_pipeline.ipynb`](notebooks/CO5430_melanoma_pipeline.ipynb) in Google Colab.
2. Set the runtime to **GPU (T4 or better)**.
3. Paste your Kaggle API token in **Step 1** (or upload `~/.kaggle/kaggle.json`).
4. Run all cells in order.

---

## Results (M2 — Baseline)

> Full quantitative results will be added after extended training runs.

- Training converges within 10 epochs with early stopping
- Confusion matrix and loss/accuracy curves generated in the notebook
- Class-weighted loss addresses the benign/malignant imbalance

---

## Milestones

| Milestone | Status | Artifact |
|---|---|---|
| M1 — Project Proposal | ✅ Done | `docs/documentation/CO5430_Project_Proposal.pdf` |
| M2 — Baseline Pipeline | ✅ Done | `notebooks/CO5430_melanoma_pipeline.ipynb` · `docs/documentation/Group15_M2_Presentation.pdf` |
| M3 — Advanced Models & Evaluation | 🔄 In progress | — |

---

## Disclaimer

This project is for **educational and research purposes only**. It is not a certified medical diagnostic tool and must not replace professional dermatological evaluation.

## License

MIT License

## Acknowledgments

- Dataset by [Bhavesh Mittal on Kaggle](https://www.kaggle.com/datasets/bhaveshmittal/melanoma-cancer-dataset)
- EfficientNetV2 — [Tan & Le, 2021](https://arxiv.org/abs/2104.00298)
