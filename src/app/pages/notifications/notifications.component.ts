import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/User.Service";

@Component({
  selector: "app-notifications",
  templateUrl: "notifications.component.html"
})
export class NotificationsComponent implements OnInit {
  users: any[] = [];
  users1: any[] = [];
  selectedUser: any = null;
  showModal: boolean = false;
  showCreateModal: boolean = false; // Para mostrar el modal de crear usuario
  newUser: any = {}; // Para almacenar los datos del nuevo usuario

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getUsers();
    this.getsensor();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
  getsensor(): void {
    this.userService.getsensor().subscribe(
      data => {
        this.users1 = data;
      },
      error => {
        console.error('Error al obtener sensor:', error);
      }
    );
  }

  openEditModal(user: any): void {
    this.selectedUser = { ...user };  // Clona los datos del usuario
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
  }

  openCreateModal(): void {
    this.newUser = {}; // Reinicia el objeto newUser
    this.showCreateModal = true; // Muestra el modal de creación
  }

  closeCreateModal(): void {
    this.showCreateModal = false; // Cierra el modal de creación
    this.newUser = {}; // Reinicia el objeto newUser
  }

  confirmDelete(userId: number): void {
    const confirmation = confirm('¿Estás seguro de que deseas eliminar este registro?');
    if (confirmation) {
      this.deleteUser(userId);
    }
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(
      response => {
        console.log('Usuario eliminado:', response);
        this.getUsers();  // Recargar la lista de usuarios después de eliminar
      },
      error => {
        console.error('Error al eliminar usuario:', error);
      }
    );
  }

  // Actualización de usuario
  saveUser(): void {
    if (this.selectedUser) {
        this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
            response => {
                console.log('Usuario actualizado:', response);
                const index = this.users.findIndex(user => user.id === this.selectedUser.id);
                if (index !== -1) {
                    this.users[index] = { ...this.selectedUser };  // Actualizar datos localmente
                }
                this.closeModal();  // Cierra el modal
            },
            error => {
                console.error('Error al actualizar usuario:', error);
            }
        );
    }
  }

  // Crear nuevo usuario
  createUser(): void {
    this.userService.createUser(this.newUser).subscribe(
      response => {
        console.log('Usuario creado:', response);
        this.users.push(response); // Agregar el nuevo usuario a la lista
        this.closeCreateModal(); // Cierra el modal
      },
      error => {
        console.error('Error al crear usuario:', error);
      }
    );
  }
}
