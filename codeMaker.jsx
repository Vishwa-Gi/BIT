// import React from 'react'
import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const CodeMaker = () => {

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
  }

   const previewFrame = document.getElementById('previewFrame');

    //function to generate code preview
    const  generateCodePreview = async () => {

        const res = await fetch('http://localhost:5000/api/code/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: transcript }),
        });
        const data =  await res.json();
        console.log(data);

        let html = data.website
        .replace(/```html/g, "")
        .replace(/```/g, "")
        .trim();
        const previewFrame = document.getElementById('previewFrame');
        const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        previewDoc.open();
        previewDoc.write(html);
        previewDoc.close();
    }
  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
      <div id="preview" class="tab-content active">
                <h2>Website Preview</h2>
                <div class="preview">
                    <iframe  style={{
          width: "50vw",   // 50% of viewport width
          height: "50vh",  // 50% of viewport height
          border: "1px solid #ccc"
        }} id="previewFrame"></iframe>
                </div>
        </div>
        <button onClick={generateCodePreview}>Click for code preview</button>
    </div>
  )
}

export default CodeMaker
