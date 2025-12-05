import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss'],
})
export class NavbarUserComponent implements OnInit {
  public expandedMenu: string | null = null;
  public userInitial: string = '';
  public isMobileView: boolean = window.innerWidth <= 992;
  public showUserMenu: boolean = false;
  public mobileOpen: boolean = false;
  public userRole: string = '';
  public registroExpanded: boolean = false;

  constructor(private router: Router, private facadeService: FacadeService) {
    // Obtenemos el rol del usuario y la inicial del nombre
    const name = this.facadeService.getUserCompleteName();
    if (name && name.length > 0) {
      this.userInitial = name.trim()[0].toUpperCase();
    } else {
      this.userInitial = '?';
    }
    this.userRole = this.facadeService.getUserGroup();
    window.addEventListener('resize', () => {
      this.isMobileView = window.innerWidth <= 992;
      if (!this.isMobileView) {
        this.mobileOpen = false;
      }
    });
  }

  ngOnInit(): void {}

  @HostListener('window:resize')
  onResize() {
    this.isMobileView = window.innerWidth <= 992;
    if (!this.isMobileView) {
      this.mobileOpen = false;
    }
  }

  toggleSidebar() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeSidebar() {
    this.mobileOpen = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  editUser() {
    const userId = this.facadeService.getUserId();
    const userRole = this.facadeService.getUserGroup();
    this.router.navigate([`/registro-usuarios/${userRole}/${userId}`]);
    this.showUserMenu = false;
  }

  toggleMenu(menu: string) {
    this.expandedMenu = this.expandedMenu === menu ? null : menu;
  }

  closeMenu() {
    this.expandedMenu = null;
  }

  toggleRegistro() {
    this.registroExpanded = !this.registroExpanded;
  }

  logout() {
    // TODO: Después modificar el servicio de logout para que limpie la sesión en el backend
    this.facadeService.logout().subscribe(
      () => {
        this.facadeService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      },
      () => {
        this.facadeService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      }
    );
  }

  // Role helpers - delegados al FacadeService
  isAdmin(): boolean {
    return this.facadeService.isAdmin();
  }
  isTeacher(): boolean {
    return this.facadeService.isTeacher();
  }
  isStudent(): boolean {
    return this.facadeService.isStudent();
  }
  canSeeAdminItems(): boolean {
    return this.facadeService.canSeeAdminItems();
  }
  canSeeTeacherItems(): boolean {
    return this.facadeService.canSeeTeacherItems();
  }
  canSeeStudentItems(): boolean {
    return this.facadeService.canSeeStudentItems();
  }
  canSeeHomeItem(): boolean {
    return this.facadeService.canSeeHomeItem();
  }
  canSeeRegisterItem(): boolean {
    return this.facadeService.canSeeRegisterItem();
  }
}
