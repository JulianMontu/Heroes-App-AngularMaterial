import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl<string>(''),

  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - comics' },
    { id: 'Marvel Comics', desc: 'Marvel - comics' }

  ]

  constructor(
    private heroesService: HeroService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  get currentHero(): Hero {
    const hero = this.heroForm.value as unknown as Hero;
    return hero;
  }

  ngOnInit(): void {

    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroById(id))
      )
      .subscribe(hero => {
        if (!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset(hero);

        return;
      });

  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSanckbar(`${hero.superhero} updated!`);
        });

      return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe(
        hero => {
          this.router.navigate(['/heroes/edit', hero.id]);
          this.showSanckbar(`${hero.superhero} created!`);
        });

  }

  showSanckbar(message: string){
    this.snackbar.open( message, 'ok',{
      duration: 2500,
    } )
  }

}
