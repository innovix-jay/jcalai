import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: SocketIOServer | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!io) {
    const httpServer: HTTPServer = (res.socket as any).server;
    io = new SocketIOServer(httpServer, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('[Socket.IO] Client connected:', socket.id);

      socket.on('watch-project', (projectId: string) => {
        console.log('[Socket.IO] Watching project:', projectId);
        socket.join(`project:${projectId}`);
      });

      socket.on('trigger-build', async (data: {
        projectId: string;
        files: Record<string, string>;
        triggerType: string;
      }) => {
        console.log('[Socket.IO] Build triggered for:', data.projectId);
        
        // Emit to room
        socket.to(`project:${data.projectId}`).emit('build-started', {
          projectId: data.projectId,
        });

        try {
          // Simulate fast build (in production, use actual build system)
          const startTime = Date.now();
          
          // TODO: Integrate with actual build system
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate build
          
          const buildTime = Date.now() - startTime;

          // Emit update
          io?.to(`project:${data.projectId}`).emit('hot-update', {
            projectId: data.projectId,
            updates: data.files,
            buildTime,
            timestamp: Date.now(),
          });

          // Also emit to sender
          socket.emit('hot-update', {
            projectId: data.projectId,
            updates: data.files,
            buildTime,
            timestamp: Date.now(),
          });

          console.log(`[Socket.IO] Build completed in ${buildTime}ms`);
        } catch (error: any) {
          console.error('[Socket.IO] Build error:', error);
          socket.emit('build-error', {
            projectId: data.projectId,
            error: error.message,
          });
        }
      });

      socket.on('disconnect', () => {
        console.log('[Socket.IO] Client disconnected:', socket.id);
      });
    });

    console.log('[Socket.IO] Server initialized');
  }

  res.end();
}
