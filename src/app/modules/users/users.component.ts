import { OnInit, Component, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsersService } from './services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  
  showSpinner: boolean = false;
  private ngUnsubscribe = new Subject();
  ELEMENT_DATA: DataElement[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'rut'];
  dataSource = new MatTableDataSource<DataElement>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.showSpinner = true;
    this.getData();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getData(): void {
    this.usersService
      .getDataUsers()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data) => {
          this.showSpinner = false;
          this.ELEMENT_DATA = data;
          this.refreshTable();
        },
        (error) => {
          console.log(error);
          this.showSpinner = false;
        }
      );
  }
  refreshTable(): void {
    this.ELEMENT_DATA.map((element, index) => {
      if (!this.validarRut(element.rut)) {
        this.ELEMENT_DATA[index].rutInvalido = true;
      }
    });
    this.dataSource = new MatTableDataSource<DataElement>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }

  public validarRut(rut: string): boolean {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
      return false;
    }
    let tmp = rut.split('-');
    let digv = tmp[1];
    let rutt = tmp[0];
    if (digv == 'K') digv = 'k';
    let M = 0;
    let S = 1;
    let t = parseInt(rutt);
    for (; t; t = Math.floor(t / 10)) {
      S = (S + (t % 10) * (9 - (M++ % 6))) % 11;
    }
    return (S ? S - 1 : 'k') == digv;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // this.dataSource = new MatTableDataSource<DataElement>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }
  getDetail(row: DataElement): void {
    this.router.navigate(['/users/', row.id]);
  }
}

export interface DataElement {
  rut: string;
  rutInvalido: boolean;
  name: string;
  id: number;
  lastname: string;
  activo: boolean;
}
