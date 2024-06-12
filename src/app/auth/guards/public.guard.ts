import { Injectable } from '@angular/core';
import { CanMatch, CanActivate,  Route, UrlSegment, ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot, Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, tap } from 'rxjs';

@Injectable({providedIn: 'root'})

export class PublicGuard implements CanMatch, CanActivate {

  constructor(private authService: AuthService,
    private router: Router,
  ) { }

  private checkAuthStatus(): boolean | Observable<boolean>{
    return this.authService.checkoutAuthentication()
    .pipe(
      tap( isAuthenticated => console.log('my public guard es', isAuthenticated)),
      tap( isAuthenticated => {
        if(isAuthenticated) {this.router.navigate(['/'])}

      }),

      map( isAuthenticated => !isAuthenticated)

    );
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    // console.log('Can Match');
    // console.log({ route, segments })
    return this.checkAuthStatus();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    // console.log('Can Activate');
    // console.log({ route, state })

    return this.checkAuthStatus();
  }
}
