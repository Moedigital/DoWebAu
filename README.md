# DoWebAu
> DoWebAu is a web audio recording tool that allows you to record audio in real-time and play it back. It is a simple and easy-to-use tool that can be used in any web application.  
> Framework independent and asynchronous response ⚡
## Installation
``` npm
npm install dowebau
```
or use yarn:
``` yarn
yarn add dowebau
```
## Usage
### Vue
> Example version is Vue 3.5.12  
> DoWebAu provides first priority to Vue 3.x
``` vue
<template>
  <div>
    <button @click="play">play</button>
    <button @click="pause">pause</button>
    <button @click="stop">stop</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { DoWebAu } from 'dowebau'

const instrumentalUrl = ref('path/to/instrumental.mp3');
const doWebAu = new DoWebAu({
  instrumentalUrl: instrumentalUrl.value,
  onRecorded: (blob) => {
    console.log('Recorded audio:', blob);
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play();
  }
});

const startRecording = () => {
  doWebAu.startRecording();
};

const stopRecording = () => {
  doWebAu.stopRecording();
};
 
```
### React
> Example version is React 18.2.0
``` jsx
import React, { useState } from 'react';
import DoWebAu from 'DoWebAu';

const MyAudioComponent = () => {
  const [instrumentalUrl] = useState('path/to/instrumental.mp3');
  const doWebAu = new DoWebAu({
    instrumentalUrl,
    onRecorded: (blob) => {
      console.log('Recorded audio:', blob);
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  });

  const startRecording = () => {
    doWebAu.startRecording();
  };

  const stopRecording = () => {
    doWebAu.stopRecording();
  };

  return (
    <div>
      <button onClick={startRecording}>play</button>
      <button onClick={() => doWebAu.pause()}>pause</button>
      <button onClick={stopRecording}>stop</button>
    </div>
  );
};

export default MyAudioComponent;
```
## Contribution
Contributions are welcome!  
Please open an issue or submit a pull request if you have any suggestions or improvements.
## About
This project is based on the Web Audio API and the MediaRecorder API, and is designed to provide a simple and easy-to-use interface for recording audio in the browser.  
Project is maintained by Moedigital OpenSource. [Our GitHub](https://github.com/Moedigital)
## License
This project is release under the MIT License.