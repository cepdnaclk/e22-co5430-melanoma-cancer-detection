# -*- coding: utf-8 -*-
"""
Generates the PDF Guide: Video Demonstration Script & Grad-CAM Technical Guide
CO5430 Medical Imaging · Department of Computer Engineering · University of Peradeniya
"""

from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak
)

pdf_path = Path('docs/documentation/CO5430_Melanoma_Web_App_Demonstration_Guide.pdf')
pdf_path.parent.mkdir(parents=True, exist_ok=True)

doc = SimpleDocTemplate(
    str(pdf_path),
    pagesize=letter,
    rightMargin=45,
    leftMargin=45,
    topMargin=45,
    bottomMargin=45
)

# Color Palette
primary_color = colors.HexColor('#0F172A')
accent_color = colors.HexColor('#00838F')
dark_text = colors.HexColor('#1E293B')
subtle_text = colors.HexColor('#475569')
card_bg = colors.HexColor('#F8FAFC')
card_border = colors.HexColor('#CBD5E1')

title_style = ParagraphStyle(
    'DocTitle',
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=primary_color,
    spaceAfter=4
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=subtle_text,
    spaceAfter=10
)

h1_style = ParagraphStyle(
    'SectionH1',
    fontName='Helvetica-Bold',
    fontSize=13,
    leading=17,
    textColor=accent_color,
    spaceBefore=12,
    spaceAfter=6
)

h2_style = ParagraphStyle(
    'SectionH2',
    fontName='Helvetica-Bold',
    fontSize=10.5,
    leading=14,
    textColor=primary_color,
    spaceBefore=4,
    spaceAfter=3
)

body_style = ParagraphStyle(
    'BodyDark',
    fontName='Helvetica',
    fontSize=9,
    leading=13.5,
    textColor=dark_text,
    spaceAfter=5
)

spoken_style = ParagraphStyle(
    'SpokenText',
    fontName='Helvetica-Oblique',
    fontSize=9,
    leading=14,
    textColor=colors.HexColor('#0F172A')
)

screen_style = ParagraphStyle(
    'ScreenAction',
    fontName='Helvetica-Bold',
    fontSize=8.5,
    leading=12,
    textColor=colors.HexColor('#0369A1'),
    spaceAfter=4
)

story = []

# Title & Metadata Header
story.append(Paragraph('CO5430 Computer Vision Project · Medical Imaging Track', subtitle_style))
story.append(Paragraph('Melanoma Decision Support System (CDSS)', title_style))
story.append(Paragraph('Video Demonstration Script & Grad-CAM Technical Guide · Group 15 (E/22)', subtitle_style))
story.append(HRFlowable(width='100%', thickness=1.5, color=accent_color, spaceBefore=0, spaceAfter=10))

# Part 1: What Does Grad-CAM Show?
story.append(Paragraph('Part 1: What Does Grad-CAM Show in the Web Application?', h1_style))
story.append(Paragraph(
    'When professors or clinicians ask what the Grad-CAM visualization represents, use this technical and clinical summary:',
    body_style
))

# Color scale table
color_data = [
    [
        Paragraph('<b>Visual Region</b>', body_style),
        Paragraph('<b>Gradient Meaning</b>', body_style),
        Paragraph('<b>Clinical Interpretation (ABCD Rule Correlation)</b>', body_style)
    ],
    [
        Paragraph('<font color="#DC2626"><b>Red / Orange<br/>(Hot Spots)</b></font>', body_style),
        Paragraph('High positive gradient activation flowing into layer 4 conv2.', body_style),
        Paragraph('Visual patterns that <b>strongly convinced the network to predict Malignant Melanoma</b>: asymmetric borders, atypical pigment networks, and focal dark clusters.', body_style)
    ],
    [
        Paragraph('<font color="#0284C7"><b>Cyan / Blue<br/>(Cold Regions)</b></font>', body_style),
        Paragraph('Zero or negligible gradient activation.', body_style),
        Paragraph('Uniform, regular areas or surrounding healthy skin that did not contribute to malignancy suspicion.', body_style)
    ]
]

t_color = Table(color_data, colWidths=[90, 160, 270])
t_color.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
    ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
]))
story.append(t_color)
story.append(Spacer(1, 8))

story.append(Paragraph(
    '<b>Why This Matters Clinically:</b> Deep learning models are traditionally perceived as opaque "black boxes". Grad-CAM provides visual verification that the network is making decisions based on genuine dermatological pathology rather than irrelevant background artifacts like skin hair, ruler marks, or dermatoscope gel bubbles.',
    body_style
))

story.append(Spacer(1, 8))

# Part 2: Video Script
story.append(Paragraph('Part 2: Scene-by-Scene Spoken Demonstration Script (Humanized)', h1_style))
story.append(Paragraph(
    'This script is formulated in a <b>natural, confident conversational tone</b>. Follow the on-screen action prompts while speaking:',
    body_style
))

def make_scene_card(scene_num, title, duration, screen_action, spoken_text):
    card_content = [
        [Paragraph(f'<b>Scene {scene_num}: {title}</b> ({duration})', h2_style)],
        [Paragraph(f'<b>[On Screen]:</b> {screen_action}', screen_style)],
        [Paragraph(f'<b>[What to Say]:</b> "{spoken_text}"', spoken_style)]
    ]
    t = Table(card_content, colWidths=[520])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), card_bg),
        ('BOX', (0,0), (-1,-1), 1, card_border),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    return t

# Scene 1
s1_text = (
    "Hi everyone. Today I'm demonstrating our melanoma detection web app, which we built for our CO5430 Computer Vision "
    "project at the University of Peradeniya.<br/><br/>"
    "Skin cancer detection is all about catching it early. If melanoma is caught in time, survival is over 98%. "
    "But if a doctor misses it, the consequences can be fatal. That's why we didn't just build another image classifier—we built "
    "a genuine clinical tool focused on <b>not missing any cancer cases</b>, while making sure the AI can explain why it made its decision.<br/><br/>"
    "Up here in the corner, you can see our fine-tuned <b>ResNet-18 PyTorch model</b> is loaded and running live on the backend."
)
story.append(make_scene_card('1', 'Introduction & Clinical Motivation', '0:00 – 0:30', 'Show main dashboard at http://127.0.0.1:5000. Circle mouse around title and the green status pill.', s1_text))
story.append(Spacer(1, 8))

# Scene 2
s2_text = (
    "In a real clinic, doctors don't just test one image at a time. So we designed this as a batch workstation. "
    "I can drag and drop multiple skin images at once, or load our dataset reference cases right here.<br/><br/>"
    "As soon as they load, each image gets analyzed in a fraction of a second.<br/><br/>"
    "The top cards give us a quick overview—how many total cases we have, how many came back suspicious, and how many look benign. "
    "Down in the queue, every patient case gets a clear verdict, a malignancy probability score bar, and an immediate clinical "
    "recommendation—like whether the patient needs an urgent biopsy or just a routine check-up."
)
story.append(make_scene_card('2', 'Batch Upload & Patient Triage Queue', '0:30 – 1:05', 'Click "Load 10 Reference Cases". Point to top KPI cards updating, then scroll down through the table.', s2_text))
story.append(Spacer(1, 8))

# Scene 3
s3_text = (
    "Now, this button right here is one of the most important parts of our project.<br/><br/>"
    "Normally, machine learning models use a 50% cutoff—meaning anything over 0.5 is called cancer, and anything under is called safe. "
    "But in medicine, being 50/50 isn't good enough when a missed melanoma is life-threatening.<br/><br/>"
    "So during our research, we calibrated the threshold down to <b>0.35</b>. By being slightly more cautious, our model's sensitivity "
    "jumped to <b>97.2%</b>, cutting down missed melanomas by <b>84%</b>.<br/><br/>"
    "And notice that when I switch between Standard mode and Safety mode, the system updates the entire patient queue instantly "
    "right in front of us, without having to re-upload anything."
)
story.append(make_scene_card('3', 'Threshold Calibration Switch', '1:05 – 1:40', 'Click between tau = 0.35 (Clinical Safety) and tau = 0.50 (Standard) at top right. Observe table badges updating.', s3_text))

story.append(PageBreak())

# Scene 4
s4_text = (
    "A big problem with deep learning in healthcare is that doctors don't trust 'black boxes'—they need to know why the AI flagged an image. "
    "That's where <b>Grad-CAM</b> comes in.<br/><br/>"
    "If I click 'Inspect Grad-CAM' on this case, it opens up our visual analysis modal. What you're seeing here isn't just a random colored "
    "filter—it's the actual gradient map from the deepest convolutional layer of our ResNet-18 model.<br/><br/>"
    "The bright red and yellow hotspots show exactly what the network focused on. Notice how the heat concentrates right around the "
    "jagged, asymmetric edges and the dark clusters of pigment. That tells the doctor the AI is looking at real pathological warning signs, "
    "not just background skin or lighting artifacts.<br/><br/>"
    "We can adjust the opacity slider to see the raw image underneath, or switch to the pure heatmap view. And on the right side, "
    "we broke down the classic dermatological <b>ABCD rule</b>—scoring Asymmetry, Border, Color, and Diameter."
)
story.append(make_scene_card('4', 'Explainable AI & Grad-CAM Inspection', '1:40 – 2:30', 'Click "Inspect Grad-CAM" on a Malignant row. Adjust opacity slider, switch tabs, point to ABCD metrics.', s4_text))
story.append(Spacer(1, 8))

# Scene 5
s5_text = (
    "Finally, to make this practical for clinical record-keeping, the doctor can click <b>Export Clinical Audit</b> to download "
    "a clean CSV file with all the patient scores and threshold settings, or hit <b>Print Case Summary</b> to get a clean printable "
    "report for the patient's medical file.<br/><br/>"
    "Overall, we took our trained deep learning model and turned it into an interactive, clinically safe decision-support system "
    "that dermatologists can actually understand and trust.<br/><br/>"
    "Thank you so much for your time!"
)
story.append(make_scene_card('5', 'Export & Conclusion', '2:30 – 2:55', 'Close modal. Click "Export Clinical Audit (CSV)", then "Print Case Summary" showing print preview.', s5_text))
story.append(Spacer(1, 10))

# Part 3: Quick Viva Tips
story.append(Paragraph('Part 3: Practical Presentation Tips for Viva & Recording', h1_style))
tips = [
    '• <b>Pacing:</b> Speak in a calm, conversational rhythm. Pause for 1 second after clicking a button so the viewer\'s eye can follow your actions.',
    '• <b>Mouse Guidance:</b> Use your cursor as a pointer. Hover intentionally over the threshold button, the MSI progress bar, and the Grad-CAM hotspots while speaking about them.',
    '• <b>Key Phrase to Remember:</b> <i>"We calibrated our threshold to 0.35 because in clinical oncology, sensitivity and catching every melanoma matters more than raw accuracy."</i>',
    '• <b>Visual Verification:</b> Ensure the application is maximized in your browser at 1080p resolution for maximum clarity.'
]
for tip in tips:
    story.append(Paragraph(tip, body_style))

doc.build(story)
print(f"SUCCESS: PDF generated at: {pdf_path.resolve()}")
