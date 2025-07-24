'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ClientProduct, WebinarWithPresenter } from '@/lib/type';
import { vapi } from '@/lib/vapi/vapiclient';
import { changeCallStatus } from '@/actions/attendence';
import { CallStatusEnum } from '@prisma/client';
import { toast } from 'sonner';
import { Bot, Clock, Loader2, Mic, MicOff, PhoneOff } from 'lucide-react';
import { RiRobot3Line } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import PurchaseDialogBox from '../../_components/Common/PurchaseDialogBox';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const CallStatus = {
  CONNECTING: 'CONNECTING',
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED',
};

type Props = {
  userName?: string;
  assistantId: string;
  assistantName?: string;
  callTimeLimit?: number;
  webinar: WebinarWithPresenter;
  userId: string;
  product?: ClientProduct | null;
};

const AutoConnectCall = ({
  userName = 'User',
  assistantId,
  assistantName = 'Ai Assistant',
  callTimeLimit = 180,
  webinar,
  userId,
  product,
}: Props) => {
  const [callStatus, setCallStatus] = useState(CallStatus.CONNECTING);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [userIsSpeaking, setUserIsSpeaking] = useState(false);
  const [isMicMuted, setMicMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(callTimeLimit);
  const [purchaseDialog, setPurchaseDialog] = useState(false);

  const toggleMicMute = () => {
    if (refs.current.audioStream) {
      refs.current.audioStream.getAudioTracks().forEach((track) => {
        track.enabled = isMicMuted;
      });
    }
    setMicMuted(!isMicMuted);
  };

  const handleClick = () => {
    setPurchaseDialog(true);
  };

  const refs = useRef({
    countdownTimer: undefined as NodeJS.Timeout | undefined,
    audioStream: null as MediaStream | null,
    userSpeakingTimeout: undefined as NodeJS.Timeout | undefined,
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const cleanup = useCallback(() => {
    if (refs.current.countdownTimer) {
      clearInterval(refs.current.countdownTimer);
      refs.current.countdownTimer = undefined;
    }

    if (refs.current.userSpeakingTimeout) {
      clearTimeout(refs.current.userSpeakingTimeout);
      refs.current.userSpeakingTimeout = undefined;
    }

    if (refs.current.audioStream) {
      refs.current.audioStream.getTracks().forEach((track) => track.stop());
      refs.current.audioStream = null;
    }
  }, []);

  const setupAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      refs.current.audioStream = stream;

      const audioContext = new (window.AudioContext || window.AudioContext)();
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyzer);

      const checkAudioLevel = () => {
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        analyzer.getByteFrequencyData(dataArray);

        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedVolume = average / 256;

        if (normalizedVolume > 0.15 && !assistantIsSpeaking && !isMicMuted) {
          setUserIsSpeaking(true);

          if (refs.current.userSpeakingTimeout) {
            clearTimeout(refs.current.userSpeakingTimeout);
          }

          refs.current.userSpeakingTimeout = setTimeout(() => {
            setUserIsSpeaking(false);
          }, 500);
        }
      };

      let running = true;
      const loop = () => {
        if (!running) return;
        checkAudioLevel();
        requestAnimationFrame(loop);
      };
      loop();

      return () => {
        running = false;
      };
    } catch (error: unknown) {
      console.error('Error in Audio: ', error);
    }
  }, [assistantIsSpeaking, isMicMuted]);

  const stopCall = useCallback(async () => {
    try {
      vapi.stop();
      setCallStatus(CallStatus.FINISHED);
      cleanup();
      const res = await changeCallStatus(userId, CallStatusEnum.COMPLETED);
      if (!res.success) {
        throw new Error('Failed to update call status');
      }
      toast.success('Call Ended Successfully');
    } catch (error: unknown) {
      console.error('Failed to stop call', error);
      toast.error('Failed to Stop call, Try Again');
    }
  }, [userId, cleanup]);

  const startCall = useCallback(async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);

      if (typeof vapi.stop === 'function') {
        await vapi.stop();
      }

      await vapi.start(assistantId);
      const res = await changeCallStatus(userId, CallStatusEnum.InProgress);
      if (!res.success) {
        throw new Error('Failed to update call status');
      }
      toast.success('Call started successfully');
    } catch (error: unknown) {
      console.error('Failed to start Call: ', error);
      toast.error('Failed to start call. Please try again');
      setCallStatus(CallStatus.FINISHED);
    }
  }, [assistantId, userId]);

  // Main useEffect controls the call
  useEffect(() => {
    startCall();

    return () => {
      stopCall();
    };
  }, [startCall, stopCall]);

  useEffect(() => {
    const onCallStart = async () => {
      console.log('Call Started');
      setCallStatus(CallStatus.ACTIVE);
      await setupAudio();

      setTimeRemaining(callTimeLimit);
      refs.current.countdownTimer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(refs.current.countdownTimer);
            stopCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const onCallEnd = () => {
      console.log('Call Ended');
      setCallStatus(CallStatus.FINISHED);
      cleanup();
    };

    const onSpeechStart = () => {
      setAssistantIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setAssistantIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error('Vapi error: ', error);
      setCallStatus(CallStatus.FINISHED);
      cleanup();
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, [userName, callTimeLimit, startCall, stopCall, setupAudio, cleanup]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg themeBg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold truncate max-w-[200px] sm:max-w-none">
                  {webinar.title}
                </h1>
                <p className="text-sm text-muted-foreground">AI Sales Call</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {callStatus === CallStatus.ACTIVE && (
                <>
                  <Badge
                    variant="outline"
                    className="hidden sm:flex items-center gap-1.5"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live
                  </Badge>

                  <Badge
                    variant="secondary"
                    className={cn(
                      'font-mono text-sm',
                      timeRemaining < 30 &&
                        'bg-destructive/10 text-destructive border-destructive/20',
                    )}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(timeRemaining)}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[calc(95vh-80px)] bg-background z-0">
        <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 relative">
          <div className="flex-1 bg-card rounded-xl overflow-hidden shadow-lg relative">
            <div className="absolute top-4 left-4 bg-black/40 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 z-10">
              <Mic
                className={cn(
                  'h-4 e-4',
                  assistantIsSpeaking ? 'themeColor' : '',
                )}
              />
              <span>{assistantName}</span>
            </div>

            <div className="h-full flex items-center justify-center">
              <div className="relative">
                {assistantIsSpeaking && (
                  <>
                    <div
                      className="absolute inset-0 rounded-full border-4
                    themeBgBorder animate-ping opacity-20"
                      style={{ margin: '-8px' }}
                    />
                    <div
                      className="absolute inset-0 rounded-full border-4
                    themeBgBorder animate-ping opacity-10"
                      style={{ margin: '-16px', animationDelay: '0.5s' }}
                    />
                  </>
                )}

                <div
                  className={cn(
                    'flex justify-center items-center rounded-full overflow-hidden border-4 p-6',
                    assistantIsSpeaking
                      ? 'themeBgBorder'
                      : 'themeBgBorderLight',
                  )}
                >
                  <RiRobot3Line className="w-[70px] h-[70px]" />
                </div>
                {assistantIsSpeaking && (
                  <div
                    className="absolute -bottom-0.5 -right-2 themeBgDark 
                text-white p-2 rounded-full"
                  >
                    <Mic className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 bg-card rounded-xl overflow-hidden shadow-lg relative">
            <div
              className="absolute top-4 left-4 bg-black/40 text-white px-3 py-1 
            rounded-full text-sm flex items-center gap-2 z-10"
            >
              {isMicMuted ? (
                <>
                  <MicOff className="h-4 w-4 text-destructive" />
                  <span>Muted</span>
                </>
              ) : (
                <>
                  <Mic
                    className={cn(
                      'h-4 w-4',
                      userIsSpeaking ? 'themeColor' : '',
                    )}
                  />
                  <span>{userName}</span>
                </>
              )}
            </div>

            <div
              className="absolute top-4 right-4 bg-black/40 text-white px-3 py-1
            rounded-full text-sm flex items-center gap-2 z-10"
            >
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>

            <div className="h-full flex items-center justify-center">
              <div className="relative">
                {userIsSpeaking && !isMicMuted && (
                  <>
                    <div
                      className="absolute inset-0 rounded-full border-4
                    themeBgBorder animate-ping opacity-20"
                      style={{ margin: '-8px' }}
                    ></div>
                  </>
                )}

                <div
                  className={cn(
                    'flex justify-center items-center rounded-full overflow-hidden border-4',
                    isMicMuted
                      ? 'border-destructive/50'
                      : userIsSpeaking
                      ? 'themeBgBorder'
                      : 'themeBgBorderLight',
                  )}
                >
                  <Avatar className="w-[110px] h-[110px]">
                    <AvatarImage src="/user-avatar.png" alt={userName} />
                    <AvatarFallback>
                      {userName.split('')?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {isMicMuted && (
                  <div
                    className="absolute -bottom-2 -right-2 bg-destructive 
                text-white p-2 rounded-full"
                  >
                    <MicOff className="h-4 w-4" />
                  </div>
                )}

                {userIsSpeaking && !isMicMuted && (
                  <div
                    className="absolute -bottom-0.5 -right-2 themeBgDark 
                text-white p-2 rounded-full"
                  >
                    <Mic className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {callStatus === CallStatus.CONNECTING && (
            <div
              className="absolute inset-0 bg-background/80 flex items-center
            justify-center gap-2 z-50"
            >
              <Loader2 className="h-10 w-10 animate-spin themeColor" />
              <h3 className="text-xl font-medium">Connecting...</h3>
            </div>
          )}

          {callStatus === CallStatus.FINISHED && (
            <div
              className="absolute inset-0 bg-background/90 flex items-center
            justify-center flex-col gap-2 z-50"
            >
              <h3 className="text-xl font-medium">Call Ended</h3>
              <p className="text-muted-foreground">Time Limit reached</p>
            </div>
          )}
        </div>

        <div className="bg-card border-t border-border p-4 rounded-lg mx-2">
          <div
            className="max-w-3xl mx-auto flex item-center sm:justify-between 
            flex-col sm:flex-row gap-3"
          >
            <div className="flex items-center gap-2">
              {callStatus === CallStatus.ACTIVE && (
                <>
                  <Clock className="h-6 w-6 text-muted-foreground" />
                  <span
                    className={cn(
                      'text-sm font-lg',
                      timeRemaining < 30
                        ? 'text-destructive animate-pulse'
                        : timeRemaining < 60
                        ? 'text-amber-500'
                        : 'text-muted-foreground',
                    )}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleMicMute}
                className={cn(
                  'p-3 rounded-2xl transition-all cursor-pointer',
                  isMicMuted
                    ? 'bg-destructive text-primary'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border',
                )}
                disabled={callStatus !== CallStatus.ACTIVE}
              >
                {isMicMuted ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={stopCall}
                className="p-3 rounded-2xl bg-red-900/70 text-primary hover:bg-destructive/90 transition-all cursor-pointer"
                aria-label="End call"
                disabled={callStatus !== CallStatus.ACTIVE}
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {product && (
                <div className="flex items-center gap-2 rounded-xl max-w-xs">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-10">
                      {product.image ? (
                        <Image
                          width={20}
                          height={20}
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-blue-500 rounded-sm"></div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs text-foreground truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-md font-bold text-primary">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <Button
                variant={'outline'}
                onClick={handleClick}
                className="cursor-pointer"
              >
                Buy Now
              </Button>
            </div>

            <div className="hidden md:block">
              {callStatus === CallStatus.ACTIVE && timeRemaining < 30 && (
                <span className="text-destructive font-medium">
                  Call ending soon
                </span>
              )}
            </div>
          </div>
        </div>
        {purchaseDialog && (
          <PurchaseDialogBox
            open={purchaseDialog}
            onOpenChange={setPurchaseDialog}
            product={product}
            userId={webinar.presenterId}
            webinarId={webinar.id}
          />
        )}
      </div>
    </div>
  );
};

export default AutoConnectCall;
