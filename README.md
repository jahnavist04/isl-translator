# 🤟 SignSync - ISL Translator

A bidirectional **Indian Sign Language (ISL)** translator that runs entirely in your browser. Sign at your webcam and get text/speech, or type text and watch it turn into signs. No server, no uploads, real-time inference.

## ✨ Features

- **Sign → Text**: webcam feed → MediaPipe Hands extracts 21 hand landmarks → on-device neural network classifies 36 classes (digits 0–9, letters A–Z)
- **Text → Sign**: type text and see it played back as fingerspelling / preset phrase sequences, with play, pause, replay, step, speed and loop controls
- **Sentence builder** with text-to-speech (Web Speech API)
- **Sign dictionary** covering all 36 classes
- **Practice quiz mode** to learn ISL the fun way
- **Prediction smoothing** with a rolling 10-frame window and vote-locking for stable output (~12–16 FPS)
- **Privacy-first**: everything happens client-side

## 🧠 How It Works

```
Webcam → MediaPipe Hands (21 landmarks, 63 features)
       → Dense NN (63 → 128 → 64 → 36, ReLU + Dropout 0.3, Softmax)
       → TensorFlow.js in-browser inference
       → Smoothed prediction → Text / Speech
```

- **Dataset**: Kaggle `ananyaarya22/isl-data`, processed with Google's `hand_landmarker.task`
- **Training**: TensorFlow, Adam, sparse categorical crossentropy, 80/20 stratified split, 50 epochs, batch size 32
- **Deployment**: model converted to TensorFlow.js

## 🛠️ Tech Stack

- React 18 + Vite
- Tailwind CSS + PostCSS
- MediaPipe Hands and TensorFlow.js (loaded via CDN)
- Web Speech API

## 🚀 Getting Started

```bash
# clone
git clone https://github.com/<your-username>/isl-translator.git
cd isl-translator

# install
npm install

# run dev server
npm run dev

# production build
npm run build
```

Open the local URL Vite prints (usually `http://localhost:5173`) and allow camera access.

## 📁 Project Structure

```
isl-translator/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 📊 Results

Compared against a traditional CV baseline:

| Metric | Traditional CV | SignSync |
|---|---|---|
| Hand detection accuracy | 82.4% | 96.3% |
| Gesture recognition accuracy | 78.7% | 94.6% |
| Response time | 210 ms | 85 ms |

## 🗺️ Roadmap

- Wider comparative and quantitative validation
- Dynamic (motion-based) signs and full-phrase recognition

## 👩‍💻 Authors

Jahnavi S T, Princy R, Lakshmi R, Archana G — Dept. of CSE (Data Science), SVCE, Bengaluru

## 🙏 Acknowledgements

- [MediaPipe](https://developers.google.com/mediapipe) by Google
- [TensorFlow.js](https://www.tensorflow.org/js)
- Kaggle ISL dataset by `ananyaarya22`
