import { UserConfig } from 'vite';
import tsResolver from 'vite-tsconfig-paths';

export default {
  resolvers: [tsResolver],
  optimizeDeps: {
    include: ['functional-red-black-tree2/rbtree'],
    exclude: ['functional-red-black-tree2'],
  },
} as UserConfig;
