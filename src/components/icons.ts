import {
  Dices, BarChart3, Play, Pause, RotateCcw, Download, FileJson, FileSpreadsheet,
  TrendingUp, TrendingDown, IndianRupee, Wallet, ShoppingBag, Briefcase,
  GraduationCap, Zap, Coffee, Target, Info, HelpCircle, ChevronDown, ChevronUp,
  Activity, AlertTriangle, CheckCircle2, XCircle, Clock, Percent, LineChart,
  BarChart2, Sparkles, Rocket, Shield, Skull, Heart, ArrowRight, Settings,
  BookOpen, Lightbulb, CircleDot, Layers, Gauge, Timer, DollarSign,
  PieChart, Users, Building2, Flame, Award, Star, Eye, Ban, ExternalLink,
} from 'lucide-react';
import type { ComponentType } from 'react';

// Re-export all icons as a centralized icon map
export const Icons = {
  // General
  Dices, BarChart3, Play, Pause, RotateCcw, Download, FileJson, FileSpreadsheet,
  TrendingUp, TrendingDown, IndianRupee, Wallet, ShoppingBag, Briefcase,
  GraduationCap, Zap, Coffee, Target, Info, HelpCircle, ChevronDown, ChevronUp,
  Activity, AlertTriangle, CheckCircle2, XCircle, Clock, Percent, LineChart,
  BarChart2, Sparkles, Rocket, Shield, Skull, Heart, ArrowRight, Settings,
  BookOpen, Lightbulb, CircleDot, Layers, Gauge, Timer, DollarSign,
  PieChart, Users, Building2, Flame, Award, Star, Eye, Ban, ExternalLink,
};

// Map preset icon names to components
export const presetIconMap: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  'coffee': Coffee,
  'graduation-cap': GraduationCap,
  'zap': Zap,
  'briefcase': Briefcase,
  'indian-rupee': IndianRupee,
  'shopping-bag': ShoppingBag,
};

export type IconName = keyof typeof Icons;
