import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rtmpURL: string;
  streamKey: string;
};

const ObsDialogBox = ({ open, onOpenChange, rtmpURL, streamKey }: Props) => {
  const copyToClipBoard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (err) {
      console.error('Failed to Copy text', err);
      toast.error(`Failed to Copy ${label}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OBS Streaming Credentials</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">RTMP URL</label>
            <div className="flex">
              <Input value={rtmpURL} readOnly className="flex-1" />
              <Button
                className="ml-2"
                variant={`outline`}
                size="icon"
                onClick={() => copyToClipBoard(rtmpURL, 'RTMP URL')}
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Stream Key</label>
            <div className="flex">
              <Input value={streamKey} readOnly className="flex-1" />
              <Button
                className="ml-2"
                variant={`outline`}
                size="icon"
                onClick={() => copyToClipBoard(streamKey, 'Stream Key')}
              >
                <Copy size={16} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              This is your personal stream key. Keep it safe and do not share it
              with anyone.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObsDialogBox;
