import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms'; //Nos permite hacer las validaciones
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Nos permite comunicarnos con nuestra base de datos
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';

import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {
  //Variables
  formularioUsuario:FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion:string = "Agregar"; // este titulo cambiara de acurdo a lo que vamos a hacer
  botonAccion:string = "Guardar";
  listaRoles: Rol[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>, // primero definimos que esto va a ser un Modal
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario, // con esta variable nos comunicaremos con la tabla usuario
    private fb: FormBuilder, //Trabaja con formularios reactivos
    private _rolServicio: RolService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) { 
    //Declaramos los campos de nuestro formulario 
    this.formularioUsuario = this.fb.group({
      nombreCompleto : ['',Validators.required],
      correo : ['',Validators.required],
      idRol : ['',Validators.required],
      clave : ['',Validators.required],
      esActivo : ['1',Validators.required],
    });
      //Validamos si datosuasrio llego con datos, si es asi es una actualizacion y no es nuevo
      //Entonces cambiamos los titulos
      if(this.datosUsuario != null){
        this.tituloAccion = "Editar";
        this.botonAccion = "Actualizar";
      }
      // Aqui llamamos los roles cuando construimos
      this._rolServicio.lista().subscribe({
        next: (data) => {
          if(data.status) this.listaRoles = data.value
        },
        error:(e) =>{}
      })

  }

  ngOnInit(): void {

    if(this.datosUsuario != null){//si datosusuario no es nulo

      this.formularioUsuario.patchValue({
        nombreCompleto : this.datosUsuario.nombreCompleto,
        correo : this.datosUsuario.correo,
        idRol : this.datosUsuario.idRol,
        clave : this.datosUsuario.clave,
        esActivo : this.datosUsuario.esActivo.toString()
      })

    }

  }


  guardarEditar_Usuario(){

    const _usuario: Usuario = {
      idUsuario : this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario, //Si esta nulo (asi halla datos en el modal el ID sigue siendo nulo por que aun no se ha grabado para que se cree el ID, entonces si el IDUsuario es nulo datosUsuario devuelve 0 si no quiere decir que el usuario ya existe y carga los valores.
      nombreCompleto : this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion  : "",
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo),
    }

    if(this.datosUsuario == null){ //si es nulo es un nuevo usuario, entonces nos suscribimos y GUARDAMOS los datos de la constante_usuarios

      this._usuarioServicio.guardar(_usuario).subscribe({
        next: (data) =>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El usuario fue registrado","Exito");
            this.modalActual.close("true") // regresa un mensaje cuando cierras el modal, en este caso retornara TRUE
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el usuario","Error")
        },
        error:(e) => {}
      })

    }else{

      this._usuarioServicio.editar(_usuario).subscribe({//si NO es nulo, entonces nos suscribimos y EDITAMOS los datos de la constante_usuarios
        next: (data) =>{ // cuando me suscriba y se haga la request me regresara un mensaje en la variable data que es un response , que esta definido tambien en mi backend
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El usuario fue editado","Exito");
            this.modalActual.close("true")
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo editar el usuario","Error")
        },
        error:(e) => {}
      })
    }

  }


}
