import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // name="harshini";
  // pd="1608";

  // uname: string="";
  // pword: string="";

  loginForm: FormGroup | any;
  title = 'material-login';

  constructor(
    private router:Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email,Validators.pattern(
        '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,3}$',
      ),]),
      password: new FormControl('', [Validators.required,Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
      )])
    });
   }

  ngOnInit(): void {
  }

  // validate(){
  //   this.uname=this.uname;
  //   this.pword=this.pword;
  //   console.log(this.uname);
  //   if(this.name==this.uname && this.pd==this.pword){
  //     this.router.navigateByUrl('/dashboard');      
  //   } 
  //   else{
  //     if(this.uname=="" || this.pword==""){
  //       alert("please enter username or password")
  //     }
  //     else
  //     alert("Password and username do not match")
  //   }
    
  // }

  onSubmit(){
    if(!this.loginForm.valid){
      return;
    }
    localStorage.setItem('user',this.loginForm.value)
    this.router.navigate(['/dashboard'])
  }

}
