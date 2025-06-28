import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Copy, Info } from 'lucide-react';
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
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">OBS Setup Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Open OBS Studio</li>
                  <li>Go to Settings → Stream</li>
                  <li>Select "Custom" as service</li>
                  <li>Copy the RTMP URL and Stream Key below</li>
                  <li>Click "Start Streaming"</li>
                </ol>
              </div>
            </div>
          </div>

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
              <Input
                value={streamKey}
                readOnly
                className="flex-1"
                type="password"
              />
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

        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Troubleshooting:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Make sure your internet connection is stable</li>
                <li>Check that the RTMP URL is correctly copied</li>
                <li>Verify the stream key is entered exactly as shown</li>
                <li>Try restarting OBS if connection fails</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObsDialogBox;
