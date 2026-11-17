import 'server-only';
import runtime from '@/public/models/vehicle-runtime.json';
import { predictActivity } from './predict';
import type { ActivityInput } from './schema';
export function predictOnServer(activity: ActivityInput) { return predictActivity(activity, runtime); }
