'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface HotReloadUpdate {
  projectId: string;
  updates: Record<string, string>;
  buildTime: number;
  timestamp: number;
}

interface UseHotReloadReturn {
  triggerBuild: (files: Record<string, string>) => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  isConnected: boolean;
  lastUpdate: Date | null;
  buildTime: number | null;
}

export function useHotReload(
  projectId: string,
  onUpdate: (update: HotReloadUpdate) => void
): UseHotReloadReturn {
  const socketRef = useRef<Socket | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [buildTime, setBuildTime] = useState<number | null>(null);

  useEffect(() => {
    // Connect to hot reload server
    const socket = io({
      path: '/api/socketio',
      addTrailingSlash: false,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Hot Reload] Connected to server');
      setIsConnected(true);
      socket.emit('watch-project', projectId);
    });

    socket.on('disconnect', () => {
      console.log('[Hot Reload] Disconnected from server');
      setIsConnected(false);
    });

    socket.on('hot-update', (data: HotReloadUpdate) => {
      console.log('[Hot Reload] Update received:', data);
      
      setBuildTime(data.buildTime);
      setLastUpdate(new Date(data.timestamp));
      
      // Apply updates to iframe
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'hot-reload',
          updates: data.updates
        }, '*');
      }

      onUpdate(data);
    });

    socket.on('build-started', ({ projectId: pid }) => {
      console.log('[Hot Reload] Build started for:', pid);
      setBuildTime(null);
    });

    socket.on('build-error', ({ projectId: pid, error }) => {
      console.error('[Hot Reload] Build error:', error);
      onUpdate({ 
        projectId: pid, 
        updates: {}, 
        buildTime: 0, 
        timestamp: Date.now(),
        error 
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [projectId, onUpdate]);

  const triggerBuild = useCallback((files: Record<string, string>) => {
    if (!socketRef.current) return;
    
    console.log('[Hot Reload] Triggering build with files:', Object.keys(files));
    socketRef.current.emit('trigger-build', {
      projectId,
      files,
      triggerType: 'manual-edit'
    });
  }, [projectId]);

  return { 
    triggerBuild, 
    iframeRef, 
    isConnected,
    lastUpdate,
    buildTime
  };
}
