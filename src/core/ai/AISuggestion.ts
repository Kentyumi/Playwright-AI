export interface AISuggestion {
  selector: string;
  confidence: number; // 0 → 1
  reason: string;
}
