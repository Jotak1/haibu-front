import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersComponent } from '../users.component';

@Component({
  providers: [UsersComponent],
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  id!: any;
  paramsSub: any;
  user: any;
  showSpinner: boolean = false;

  constructor(
    private userComp: UsersComponent,
    private usersService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.showSpinner = true;
    this.paramsSub = this.activatedRoute.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: any) => (this.id = parseInt(params.get('id'))));
    this.getDataDetail(this.id);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  getDataDetail(id: number): void {
    this.usersService
      .getDataUser(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data) => {
          this.user = data;
          this.checkDataRut();
          this.checkDataFecha();
          this.showSpinner = false;
        },
        (error) => {
          console.log(error);
          this.showSpinner = false;
        }
      );
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
  checkDataRut(): void {
    if (!this.validateRut(this.user.rut)) {
      this.user.rutInvalido = true;
      console.log(this.user.rutInvalido);
    }
  }
  checkDataFecha(): void {
    if (!this.validarFecha(this.user.fechaNacimiento)) {
      this.user.fechaInvalida = true;
      console.log(this.user.fechaInvalida);
    }
  }
  validateRut(rut: string): boolean {
    return this.userComp.validarRut(rut);
  }
  validarFecha(fecha: any): boolean {
    console.log(fecha);
    var fechaf = fecha.split('/');
    var d = fechaf[0];
    var m = fechaf[1];
    var y = fechaf[2];
    return (
      m > 0 &&
      m < 13 &&
      y > 0 &&
      y < 32768 &&
      d > 0 &&
      d <= new Date(y, m, 0).getDate()
    );
  }
}
