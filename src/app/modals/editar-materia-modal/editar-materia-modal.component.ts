import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MateriasService } from 'src/app/services/materias.service';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-editar-materia-modal',
  templateUrl: './editar-materia-modal.component.html',
  styleUrls: ['./editar-materia-modal.component.scss']
})
export class EditarMateriaModalComponent implements OnInit {
  public materia: any = {};
  public rol: string = "";
  public maestros: any[] = [];
  public errors: any = {};
  public idMateria: number = 0;

  // Listas para los selects (mismas que en tu registro)
  public carreras: any[] = [
    { value: '1', viewValue: 'Ingeniería en Ciencias de la Computación' },
    { value: '2', viewValue: 'Licenciatura en Ciencias de la Computación' },
    { value: '3', viewValue: 'Ingeniería en Tecnologías de la Información' },
  ];

  public diasList: any[] = [
    { value: '1', nombre: 'Lunes' },
    { value: '2', nombre: 'Martes' },
    { value: '3', nombre: 'Miércoles' },
    { value: '4', nombre: 'Jueves' },
    { value: '5', nombre: 'Viernes' },
  ];

  public customPatterns = { 'A': { pattern: new RegExp('\[a-zA-ZáéíóúÁÉÍÓÚñÑ ]') }};
  public alfanumerico = { 'S': { pattern: new RegExp('\[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]') }};

  constructor(
    private materiasService: MateriasService,
    private maestrosService: MaestrosService,
    public dialogRef: MatDialogRef<EditarMateriaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.idMateria = this.data.id;
    this.rol = this.data.rol;
    this.materia = this.materiasService.esquemaMateria(); // Inicializar para evitar errores
    this.obtenerMaestros();
    this.obtenerMateriaByID();
  }

  public obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => { this.maestros = response; },
      (error) => { console.error(error); }
    );
  }

  public obtenerMateriaByID() {
    this.materiasService.obtenerMateriaById(this.idMateria).subscribe(
      (response) => {
        this.materia = response;
        // Parseo de días (Lógica idéntica a tu registro)
        if (typeof this.materia.dias === 'string') {
          try {
            this.materia.dias = JSON.parse(this.materia.dias);
          } catch (e) {
            this.materia.dias = [];
          }
        } else if (!this.materia.dias) {
          this.materia.dias = [];
        }

        // Formateo de horas para el TimePicker (HH:mm)
        if(this.materia.hora_inicial){
            this.materia.hora_inicial = this.materia.hora_inicial.substring(0, 5);
        }
        if(this.materia.hora_final){
            this.materia.hora_final = this.materia.hora_final.substring(0, 5);
        }
      },
      (error) => {
        alert("No se pudo obtener la materia");
        this.cerrar_modal();
      }
    );
  }

  // --- LÓGICA DE CHECKBOXES Y HORAS (Reutilizada) ---
  public checkboxChange(event: any) {
    if (event.checked) {
      this.materia.dias.push(event.source.value);
    } else {
      this.materia.dias.forEach((dia: any, i: any) => {
        if (dia == event.source.value) {
          this.materia.dias.splice(i, 1);
        }
      });
    }
  }

  public revisarSeleccion(nombre: string) {
    if (this.materia.dias) {
      return this.materia.dias.find((element: any) => element == nombre) != undefined;
    }
    return false;
  }

  public onTimeChange() {
    // Tu validación de horas simple
    if (this.materia.hora_inicial && this.materia.hora_final) {
        if (this.materia.hora_inicial >= this.materia.hora_final) {
            alert("La hora final debe ser mayor a la inicial");
        }
    }
  }

  public cerrar_modal() {
    this.dialogRef.close({ isUpdate: false });
  }

  public actualizarMateria() {
    // 1. Validar
    this.errors = this.materiasService.validarMateria(this.materia);
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    // 2. Formatear datos (Horas a HH:mm:ss)
    const materiaData = { ...this.materia };
    ['hora_inicial', 'hora_final'].forEach((campo) => {
        if (materiaData[campo] && !materiaData[campo].endsWith(':00')) {
          materiaData[campo] = `${materiaData[campo]}:00`;
        }
    });

    // 3. Enviar
    this.materiasService.actualizarMateria(materiaData).subscribe(
      (response) => {
        console.log(response);
        this.dialogRef.close({ isUpdate: true });
      },
      (error) => {
        alert("Error al actualizar la materia");
        console.error(error);
      }
    );
  }
}
