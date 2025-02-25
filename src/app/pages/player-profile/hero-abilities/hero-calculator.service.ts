import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroCalculatorService {
  calculateLevel(xp: number, levelScale: number): number {
    if (xp <= 0) return 0;
    return Math.floor(Math.cbrt(xp / levelScale));
  }

  calculateXpForLevel(level: number, levelScale: number): number {
    return Math.ceil(levelScale * Math.pow(level, 3));
  }

  calculateCurrentValue(
    baseValue: number,
    steps: number[],
    currentLevel: number
  ): number {
    let value = baseValue;

    for (let i = 0; i < currentLevel && i < steps.length; i++) {
      value += steps[i];
    }

    return value;
  }

  calculateXpToNextLevel(
    currentXP: number,
    currentLevel: number,
    levelScale: number
  ): number {
    const nextLevelXP = this.calculateXpForLevel(currentLevel + 1, levelScale);
    return nextLevelXP - currentXP;
  }

  calculateProgressToNextLevel(
    currentXP: number,
    currentLevel: number,
    levelScale: number
  ): number {
    const currentLevelXP = this.calculateXpForLevel(currentLevel, levelScale);
    const nextLevelXP = this.calculateXpForLevel(currentLevel + 1, levelScale);
    const levelDiff = nextLevelXP - currentLevelXP;
    const progress = currentXP - currentLevelXP;

    return levelDiff > 0 ? (progress / levelDiff) * 100 : 0;
  }
}
