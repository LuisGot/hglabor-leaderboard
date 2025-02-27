import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerProfileService, HeroDetails } from '../player-profile.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HeroCalculatorService } from './hero-calculator.service';

interface AbilityValue {
  experiencePoints: number;
}

interface Ability {
  [key: string]: AbilityValue;
}

interface Hero {
  [key: string]: Ability;
}

interface EnhancedAbilityStat {
  name: string;
  currentXP: number;
  currentLevel: number;
  maxLevel: number;
  nextLevelXP: number | null;
  percentToNextLevel: number;
  baseValue: number;
  currentValue: number;
  levelScale: number;
  xpToNextLevel: number | null;
  exactProgressToNextLevel: number;
}

interface EnhancedAbility {
  name: string;
  stats: EnhancedAbilityStat[];
  isExpanded?: boolean;
}

interface EnhancedHero {
  key: string;
  abilities: { [key: string]: EnhancedAbility };
  detailsLoaded: boolean;
  isExpanded?: boolean;
}

@Component({
  selector: 'app-hero-abilities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-abilities.component.html',
})
export class HeroAbilitiesComponent implements OnInit {
  @Input() heroes: { [key: string]: Hero } = {};
  enhancedHeroes: { [key: string]: EnhancedHero } = {};
  isLoading = true;

  constructor(
    private playerProfileService: PlayerProfileService,
    private heroCalculator: HeroCalculatorService
  ) {}

  ngOnInit() {
    this.loadHeroDetails();
  }

  loadHeroDetails() {
    if (!this.heroes || Object.keys(this.heroes).length === 0) {
      this.isLoading = false;
      return;
    }

    const heroRequests = Object.keys(this.heroes).map((heroKey) => {
      this.enhancedHeroes[heroKey] = {
        key: heroKey,
        abilities: {},
        detailsLoaded: false,
        isExpanded: false,
      };

      return this.playerProfileService.getHeroDetails(heroKey).pipe(
        catchError((error) => {
          console.error(`Error loading hero details for ${heroKey}:`, error);
          return of(null);
        })
      );
    });

    forkJoin(heroRequests).subscribe((heroDetailsArray) => {
      heroDetailsArray.forEach((heroDetails, index) => {
        const heroKey = Object.keys(this.heroes)[index];
        if (heroDetails) {
          this.processHeroDetails(heroKey, heroDetails);
        }
      });
      this.isLoading = false;
    });
  }

  processHeroDetails(heroKey: string, heroDetails: HeroDetails) {
    const userHero = this.heroes[heroKey];
    const heroProperties = heroDetails.properties;

    Object.keys(userHero).forEach((abilityKey) => {
      if (heroProperties[abilityKey]) {
        const userAbility = userHero[abilityKey];
        const abilityProperties = heroProperties[abilityKey];

        this.enhancedHeroes[heroKey].abilities[abilityKey] = {
          name: this.formatAbilityName(abilityKey),
          stats: [],
          isExpanded: false,
        };

        Object.keys(userAbility).forEach((statKey) => {
          const userStat = userAbility[statKey];
          const matchingProperty = abilityProperties.find(
            (prop) =>
              prop.name.toLowerCase() ===
              this.formatStatName(statKey).toLowerCase()
          );

          if (matchingProperty) {
            const currentXP = userStat.experiencePoints;
            const levelScale = matchingProperty.levelScale;
            const currentLevel = this.heroCalculator.calculateLevel(
              currentXP,
              levelScale
            );
            let nextLevelXP = null;
            let xpToNextLevel = null;
            let percentToNextLevel = 0;
            let exactProgressToNextLevel = 0;

            if (currentLevel < matchingProperty.maxLevel) {
              nextLevelXP = this.heroCalculator.calculateXpForLevel(
                currentLevel + 1,
                levelScale
              );
              xpToNextLevel = nextLevelXP - currentXP;
              percentToNextLevel = (currentXP / nextLevelXP) * 100;
              exactProgressToNextLevel =
                this.heroCalculator.calculateProgressToNextLevel(
                  currentXP,
                  currentLevel,
                  levelScale
                );
            }

            const currentValue = this.heroCalculator.calculateCurrentValue(
              matchingProperty.baseValue,
              matchingProperty.modifier.steps,
              currentLevel
            );

            this.enhancedHeroes[heroKey].abilities[abilityKey].stats.push({
              name: matchingProperty.name,
              currentXP,
              currentLevel,
              maxLevel: matchingProperty.maxLevel,
              nextLevelXP,
              percentToNextLevel: Math.min(percentToNextLevel, 100),
              baseValue: matchingProperty.baseValue,
              currentValue,
              levelScale,
              xpToNextLevel,
              exactProgressToNextLevel: Math.min(exactProgressToNextLevel, 100),
            });
          }
        });
      }
    });

    this.enhancedHeroes[heroKey].detailsLoaded = true;
  }

  // Instead of returning a new array every time, implement trackBy functions to prevent Angular from recreating DOM elements
  getHeroEntries(): [string, EnhancedHero][] {
    return Object.entries(this.enhancedHeroes);
  }

  trackHero(index: number, heroEntry: [string, EnhancedHero]): string {
    return heroEntry[0];
  }

  getAbilityEntries(hero: EnhancedHero): [string, EnhancedAbility][] {
    return Object.entries(hero.abilities);
  }

  trackAbility(index: number, abilityEntry: [string, EnhancedAbility]): string {
    return abilityEntry[0];
  }

  formatAbilityName(name: string): string {
    return name.replace(/_/g, ' ');
  }

  formatStatName(name: string): string {
    return name.replace(/_/g, ' ');
  }

  formatValue(value: number): string {
    return value < 1 ? value.toFixed(3) : value.toFixed(1);
  }

  getProgressColor(currentLevel: number, maxLevel: number): string {
    if (currentLevel === 0) return 'bg-gray-400';
    if (currentLevel === maxLevel) return 'bg-green-500';

    const progress = currentLevel / maxLevel;
    if (progress < 0.3) return 'bg-red-500';
    if (progress < 0.7) return 'bg-yellow-500';
    return 'bg-blue-500';
  }

  trackStat(index: number, stat: any): any {
    return stat.name;
  }

  // Toggle the expanded state of an ability
  toggleAbility(heroKey: string, abilityKey: string): void {
    if (
      this.enhancedHeroes[heroKey] &&
      this.enhancedHeroes[heroKey].abilities[abilityKey]
    ) {
      const ability = this.enhancedHeroes[heroKey].abilities[abilityKey];
      ability.isExpanded = !ability.isExpanded;
    }
  }

  // Toggle the expanded state of a hero
  toggleHero(heroKey: string): void {
    if (this.enhancedHeroes[heroKey]) {
      this.enhancedHeroes[heroKey].isExpanded =
        !this.enhancedHeroes[heroKey].isExpanded;
    }
  }

  // Calculate the overall progress of an ability (average level percentage)
  calculateAbilityProgress(stats: EnhancedAbilityStat[]): number {
    if (!stats || stats.length === 0) return 0;

    const levelPercentages = stats.map(
      (stat) => (stat.currentLevel / stat.maxLevel) * 100
    );

    const total = levelPercentages.reduce((sum, percent) => sum + percent, 0);
    return total / stats.length;
  }

  // Get color for ability progress based on overall completion
  getAbilityProgressColor(progress: number): string {
    if (progress === 0) return 'bg-gray-400';
    if (progress >= 100) return 'bg-green-500';

    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  }
}
