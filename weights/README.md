# Model Checkpoint Weights Directory

Place your trained PyTorch `.pt` model checkpoint files in this directory.

### Supported Files:
1. `resnet18_fine_tuned.pt` — **Primary recommended model** (Calibrated test accuracy: 94.55%, Sensitivity: 96.00% at $\tau=0.35$).
2. `efficientnet_b0.pt` — Compound scaling model (Test accuracy: 93.85%, Specificity: 96.00%).
3. `baseline_cnn.pt` — Baseline scratch model benchmark.

### How it works:
- When you place `resnet18_fine_tuned.pt` here and launch `app.py`, the system **automatically detects and loads** the fine-tuned weights into PyTorch with full GPU/CPU acceleration.
- If no `.pt` file is present yet, the application operates in **Clinical Standby / Demonstration Mode** using computer vision dermoscopic lesion feature analysis and saliency mapping, ensuring seamless testing and presentations.
