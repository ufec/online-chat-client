<template>
  <h1>WebRTC</h1>
  <video id="video"></video>
  <div>
    <button @click="handleOpenMediaDevices">Open Media Devices</button>
  </div>
</template>

<script lang="ts" setup>
const openMediaDevices = async (constraints?: MediaStreamConstraints) => {
  return await navigator.mediaDevices.getUserMedia(constraints);
};

const handleOpenMediaDevices = async () => {
  const stream = await openMediaDevices({ video: true, audio: true });
  stream.getTracks().forEach((track) => {
    console.log(track);
  }); // getTracks() 获取媒体流中的所有媒体轨道
  const videoEle: HTMLVideoElement = document.getElementById('video') as HTMLVideoElement;
  videoEle.srcObject = stream;
  videoEle.autoplay = true;
  await videoEle.play();
};

// const makeCall = async () => {
//   const configuration: RTCConfiguration = {};
//   const peerConnection = new RTCPeerConnection(configuration);
//   const offer = await peerConnection.createOffer();
//   await peerConnection.setLocalDescription(offer);
// };
</script>

<style scoped lang="less"></style>
