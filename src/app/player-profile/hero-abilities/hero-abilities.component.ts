import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AbilityValue {
  experiencePoints: number;
}

interface Ability {
  [key: string]: AbilityValue;
}

interface Hero {
  [key: string]: Ability;
}

@Component({
  selector: 'app-hero-abilities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-abilities.component.html',
})
export class HeroAbilitiesComponent {
  @Input() heroes: { [key: string]: Hero } = {};

  // Return hero entries as key-value pairs
  getHeroEntries() {
    return Object.entries(this.heroes);
  }

  // Return ability entries for a hero
  getAbilityEntries(hero: Hero) {
    return Object.entries(hero);
  }

  // Return stat entries for an ability
  getStatEntries(ability: Ability) {
    return Object.entries(ability);
  }

  // Format ability name by replacing underscores
  formatAbilityName(name: string): string {
    return name.replace(/_/g, ' ');
  }

  // Format stat name by replacing underscores
  formatStatName(name: string): string {
    return name.replace(/_/g, ' ');
  }
}
