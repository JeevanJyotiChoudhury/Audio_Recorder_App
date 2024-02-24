import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Recorder.css";

const Recorder = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioList, setAudioList] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    fetchAudioList();
  }, []);

  const fetchAudioList = async () => {
    try {
      const response = await axios.get(
        "https://gold-relieved-cormorant.cyclic.app/api/audios/getaudio"
      );
      setAudioList(response.data);
    } catch (error) {
      console.error("Error fetching audio list:", error);
    }
  };

  const handleStartRecording = () => {
    setRecording(true);
    setAudioBlob(null);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      const audioChunks = [];

      recorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      recorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        setAudioBlob(audioBlob);
        setRecording(false);
      });

      recorder.start();
    });
  };

  const handleStopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
    }
  };

  const handlePlayRecorded = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioPlayer = new Audio(audioUrl);
      audioPlayer.play();
      setCurrentAudio(audioPlayer);
    }
  };

  const handlePause = () => {
    if (currentAudio) {
      currentAudio.pause();
    }
  };

  const handleResume = () => {
    if (currentAudio) {
      currentAudio.play();
    }
  };

  const handlePlayMapped = (audioUrl) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audioPlayer = new Audio(audioUrl);
    audioPlayer.play();
    setCurrentAudio(audioPlayer);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      const response = await axios.post(
        "https://gold-relieved-cormorant.cyclic.app/api/audios",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Audio uploaded successfully:", response.data);
      alert("File uploaded successfully!");
      fetchAudioList();
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  return (
    <div className="recorder-container">
      <div className="button-container">
        {!recording ? (
          <button onClick={handleStartRecording}>Start Recording</button>
        ) : (
          <button onClick={handleStopRecording}>Stop Recording</button>
        )}
        <button onClick={handlePlayRecorded} disabled={!audioBlob}>
          Play Recorded
        </button>
        <button onClick={handlePause} disabled={!currentAudio}>
          Pause
        </button>
        <button onClick={handleResume} disabled={!currentAudio}>
          Resume
        </button>
        <button onClick={handleUpload} disabled={!audioBlob}>
          Upload
        </button>
      </div>
      <div className="audio-list">
        <h3>Previous audio files</h3>
        {audioList.map((audio, index) => (
          <div className="audio-item" key={index}>
            <button onClick={() => handlePlayMapped(audio.audioUrl)}>
              Play
            </button>
            <audio controls>
              <source src={audio.audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recorder;
