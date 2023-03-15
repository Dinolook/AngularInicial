import { Component, OnInit } from '@angular/core';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Interfaces/login';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //Variables
  formularioLogin:FormGroup;
  ocultarPassword:boolean = true;
  mostrarLoading:boolean= false;

  constructor(
    private fb:FormBuilder,
    private router: Router, // esto nos ayuda a trabajar con los redireccionamientos
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) { 
    this.formularioLogin = this.fb.group({ // esto implementa formularioLogin:FormGroup; y que luego se construye como fb. lo que pasa es que el formulario no tenia campos definidos aqui lo hacemos
      email:['',Validators.required],
      password:['',Validators.required]
    });

  }

  ngOnInit(): void {
  }

  iniciarSesion(){

    this.mostrarLoading = true;

    const request: Login ={
      correo : this.formularioLogin.value.email,
      clave : this.formularioLogin.value.password
    }

    this._usuarioServicio.iniciarSesion(request).subscribe({
      next: (data) => { //en data se guarda el json que se resive de respuesta en esa respuesta hay un campo de (status) exitoso o no exitoso
        if(data.status){
          this._utilidadServicio.guardarSesionUsuario(data.value);// si el Login es exitoso guarda la session en memoria y 
          this.router.navigate(["pages"]) //muevete a pages
        }else
          this._utilidadServicio.mostrarAlerta("No se encontraron coincidencias","Opps!")// Si no, muestra el mensaje de que no se encontro usuario o pass

      },
      complete : () =>{
        this.mostrarLoading = false;
      },
      error : ()=>{
        this._utilidadServicio.mostrarAlerta("Hubo un error", "Opps!")

      }
    })


  }



}
