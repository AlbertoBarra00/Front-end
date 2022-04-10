import { Component, OnInit, ViewChild } from '@angular/core';
import { Persona } from 'src/app/model/persona';
import { PersonaService } from 'src/app/service/persona.service';
import { Pais } from 'src/app/model/pais';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { PersonaModalComponent } from './persona-modal/persona-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {
  displayedColumns = ['idPersona','nombres','apellidos','edad','sexo','pais','editar-eliminar'];
  dataSource!: MatTableDataSource<Persona>
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  cant: number = 0;



  constructor(
    private dialog: MatDialog,
    private personaService: PersonaService) { }

  ngOnInit(): void {
    this.personaService.personaActualizar.subscribe(data=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort=this.sort;
    })
    /*this.personaService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort=this.sort;]
    });*/
    this.personaService.listPageable(0,10).subscribe(data => {
      this.cant= data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort=this.sort;
    });
  }

  //[length]="cant [page]="Paginator($event)"
  openModal(persona?: Persona){
    let person= persona != null ? persona: new Persona();
    this.dialog.open(PersonaModalComponent,{
      width:'260px',
      data: person
    })
  }

  onDelete(id:number){
     let dialogRef = this.dialog.open(ConfirmDialogComponent, {

     });
     dialogRef.afterClosed().subscribe(estado =>{
       if(estado){
         this.personaService.eliminar(id).subscribe(()=>{
           this.personaService.listar().subscribe(data => {
             this.dataSource = new MatTableDataSource(data);
           })
         })
       }
     })
  }

  filtrar(valor: String){
      this.dataSource.filter = valor.trim().toLowerCase();
  }

  Paginator(e: any){
    this.personaService.listPageable(e.pageIndex,e.pageSize).subscribe(data => {
      this.cant= data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort=this.sort;
    });
  }

}
