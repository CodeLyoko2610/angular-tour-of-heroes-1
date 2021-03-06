import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Hero } from 'src/app/hero';
import { HeroService } from 'src/app/services/hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  hero: Hero;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(this.id).subscribe((hero) => {
      this.hero = hero;
    });
  }

  save(): void {
    this.heroService.updateHero(this.hero).subscribe(() => {
      this.goBack(); // Back to previous page to fetch updated hero
    });
  }

  goBack(): void {
    this.location.back();
  }
}
