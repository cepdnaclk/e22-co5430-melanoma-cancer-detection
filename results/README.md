# Results

This folder contains outputs from training runs.

## M2 Baseline — EfficientNetV2-S (10 epochs)

| Epoch | Train Loss | Val Loss | Val Accuracy |
|-------|-----------|----------|--------------|
| 1     | 0.3238    | 0.2616   | 90.65%       |
| 2     | 0.2349    | 0.2239   | 91.45%       |
| 3     | 0.2041    | 0.2609   | 89.85%       |
| 4     | 0.1870    | 0.1995   | 93.15%       |
| 5     | 0.1692    | 0.2121   | 91.95%       |
| 6     | 0.1724    | 0.1899   | 92.40%       |
| 7     | 0.1476    | 0.1982   | 91.60%       |
| **8** | **0.1410**| **0.1452**| **95.25%** ← best |
| 9     | 0.1303    | 0.3426   | 86.55%       |
| 10    | 0.1251    | 0.1820   | 94.00%       |

## Confusion Matrix (Validation Set — Final Epoch)

|                  | Predicted Benign | Predicted Malignant |
|------------------|-----------------|---------------------|
| **True Benign**    | 906 (TN)        | 94 (FP)             |
| **True Malignant** | 26 (FN)         | 974 (TP)            |

## Final Metrics

| Metric      | Value   |
|-------------|---------|
| Accuracy    | 94.0%   |
| Precision   | 91.2%   |
| Sensitivity | 97.4%   |
| Specificity | 90.6%   |
| F1-Score    | 0.942   |

> Plots (loss curves, confusion matrix image) are generated inline in the notebook.
> See `notebooks/CO5430_melanoma_pipeline.ipynb` Step 11 and Step 12.
