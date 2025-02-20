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

  getHeroEntries() {
    return Object.entries(this.heroes);
  }

  getAbilityEntries(hero: Hero) {
    return Object.entries(hero);
  }

  getStatEntries(ability: Ability) {
    return Object.entries(ability);
  }

  formatAbilityName(name: string): string {
    return name.replace(/_/g, ' ');
  }

  formatStatName(name: string): string {
    return name.replace(/_/g, ' ');
  }
}
