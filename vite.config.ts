import { UserConfig } from 'vite';
import tsResolver from 'vite-tsconfig-paths'

export default {
  resolvers: [tsResolver]
} as UserConfig;
