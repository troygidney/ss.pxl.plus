/*
 * Copyright (c) 2020. Troy Gidney
 * All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * File Last Modified: 5/20/20, 8:14 PM
 * File: auth.service.ts
 * Project: ss.pxl.plus
 */

import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  constructor(private cookieService: CookieService, private http: HttpClient, private router: Router) {
    const name = 'token';
    if (this.checkToken(name)) {
      this.requestVerify(this.getToken(name));
    } else {
      this.router.navigate(['/']).finally(() => { return; });
    }
  }

  getToken(name) {
    return this.cookieService.get(name);
  }

  checkToken(name) {
    return this.cookieService.check(name);
  }

  requestVerify(token) {
    this.router.navigate(['/base']).finally(() => {/**/});
    this.http.get(environment.APIURL + 'api/verify', {headers: {token}})
      .subscribe((value: any) => {
          const valid = value.data.valid;
          if (valid !== true) {
            throw new Error('Invalid token!');
          }
        },
        err => {
          // TODO Remove cookie
          console.log(err);
          this.router.navigate(['/']).finally(() => {/**/});
        });
  }

}
