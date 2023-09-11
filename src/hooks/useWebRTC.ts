import { type Ref, ref, onMounted, onUnmounted } from 'vue';

export interface WebRTCOptions {
  localVideoRef: Ref<HTMLVideoElement | null>;
  onicecandidate: (event: RTCPeerConnectionIceEvent) => void;
  ontrack: (event: RTCTrackEvent) => void;
}

export type OfferType = 'video' | 'audio';

export function useWebRTC({ localVideoRef, onicecandidate, ontrack }: WebRTCOptions) {
  const localStreamRef = ref<MediaStream | null>(null);
  const rtcPeerConnection = ref<RTCPeerConnection | null>(null);
  const deviceListRef = ref<MediaDeviceInfo[]>([]);
  // callState 用于标识呼叫状态 idle: 空闲 calling: 呼叫中 ringing: 响铃中 connected: 通话中 hangup: 挂断
  const callState = ref<'idle' | 'calling' | 'ringing' | 'connected' | 'hangup'>('idle');

  // 获取设备列表 (初次加载时调用)
  const getConnectedDevices = async () => {
    if (deviceListRef.value.length === 0) {
      deviceListRef.value = await navigator.mediaDevices.enumerateDevices();
    } else {
      // 比较设备列表的变化情况
      const newDeviceList = await navigator.mediaDevices.enumerateDevices();
      console.log('newDeviceList: ', newDeviceList);
    }
  };

  // 监听设备变化
  const handleDeviceChange = (event: Event) => {
    console.log('devicechange: ', event);
  };

  /**
   * 获取媒体流
   * @param offerType 呼叫类型
   * @returns
   */
  const getMediaStream = async (offerType: OfferType) => {
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: offerType === 'video',
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.value = stream;
      localVideoRef.value!.srcObject = stream;
      console.log('getMediaStream: success');
    } catch (error: any) {
      console.error('getUserMedia error: ', error);
      throw error;
    }
  };

  /**
   * 创建RTC连接
   * @returns
   */
  const createRtcConnection = () => {
    try {
      const rtcConnection = new RTCPeerConnection({
        iceServers: [
          // Information about ICE servers - Use your own!
          {
            urls: 'stun:stun.stunprotocol.org:3478',
          },
        ],
      });
      rtcConnection.onicecandidate = onicecandidate;
      rtcConnection.ontrack = ontrack;
      rtcPeerConnection.value = rtcConnection;
      console.log('createRtcConnection: success');
      return rtcConnection;
    } catch (error: any) {
      console.error('createRtcConnection error: ', error);
    }
  };

  /**
   * 将本地流添加到RTC连接中
   */
  const addLocalStreamToRtcConnection = () => {
    localStreamRef.value?.getTracks().forEach((track) => {
      rtcPeerConnection.value?.addTrack(track, localStreamRef.value!);
    });
    console.log('addLocalStreamToRtcConnection: success');
  };

  /**
   * 呼叫
   * @param offerType 呼叫类型
   * @returns sdp
   */
  const offer = async (offerType: OfferType) => {
    if (callState.value === 'calling') {
      throw new Error('正在呼叫中');
    }
    if (callState.value === 'connected') {
      throw new Error('正在通话中');
    }
    callState.value = 'calling';
    await getMediaStream(offerType);
    addLocalStreamToRtcConnection();
    // 创建offer
    const sdp = await rtcPeerConnection.value?.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: offerType === 'video',
    });
    // 设置本地描述
    await rtcPeerConnection.value?.setLocalDescription(sdp);
    return sdp;
  };

  const answer = async (offerType: OfferType) => {
    if (callState.value === 'connected') {
      throw new Error('正在通话中');
    }
    await getMediaStream(offerType);
    addLocalStreamToRtcConnection();
    // 创建answer
    const sdp = await rtcPeerConnection.value?.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: offerType === 'video',
    });
    // 设置本地描述
    await rtcPeerConnection.value?.setLocalDescription(sdp);
    return sdp;
  };

  onMounted(async () => {
    await getConnectedDevices();
    createRtcConnection();
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange, false);
  });

  onUnmounted(() => {
    navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange, false);
  });

  return {
    offer,
    answer,
    rtcPeerConnection,
    callState,
  };
}
