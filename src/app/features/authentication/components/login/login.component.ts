import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ILoginUserData } from '../../models/ilogin-user-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //form properties
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService
  ) { }

  //life cycle hooks
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ["", [Validators.pattern(/^050.*$/), Validators.required, Validators.maxLength(10)]],
      password: ['', [Validators.required/*, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)*/]]
    })
  }

  //observers
  loginObserver = {
    next: (tokenData: any) => {
      this.authService.setUserData(tokenData);
    },
    error: (err: Error) => {
      console.log(err);
    }
  }

  //methods
  submit() {
    let loginModel: ILoginUserData = this.loginForm.value as ILoginUserData;
    console.log(loginModel);
    this.authService.loginIn(loginModel).subscribe(this.loginObserver);
  }

  //getters
  getControl(name: string) {
    return this.loginForm.get(name);
  }
}
