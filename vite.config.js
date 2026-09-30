import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { cpSync, existsSync } from 'fs';

function copyStaticAssetsPlugin() {
  return {
    name: 'copy-static-assets-plugin',
    closeBundle() {
      // 1. Copy 240 animation frames
      const framesSrc = resolve(__dirname, 'ezgif-79682e0a1532d24d-jpg');
      const framesDest = resolve(__dirname, 'dist', 'ezgif-79682e0a1532d24d-jpg');
      if (existsSync(framesSrc)) {
        cpSync(framesSrc, framesDest, { recursive: true });
        console.log('✓ Successfully copied 240 animation frames to dist/ezgif-79682e0a1532d24d-jpg');
      }

      // 2. Copy video file if present
      const videoFiles = [
        'Pink_bottle_product_reveal_comme_202608301118.mp4',
        'Pink_bottle_product_reveal_comme…_202608301118.mp4',
      ];
      for (const vf of videoFiles) {
        const vSrc = resolve(__dirname, vf);
        if (existsSync(vSrc)) {
          cpSync(vSrc, resolve(__dirname, 'dist', 'reveal-video.mp4'));
          console.log(`✓ Successfully copied ${vf} to dist/reveal-video.mp4`);
          break;
        }
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), copyStaticAssetsPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        booking: resolve(__dirname, 'booking.html'),
      },
    },
  },
});
