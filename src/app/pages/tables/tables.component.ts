import { Component, OnInit } from "@angular/core";
import { DataCollectionDeviceService } from "src/app/services/DataCollectionDevice.Service";
import { UserService } from "src/app/services/User.Service";

@Component({
  selector: "app-tables",
  templateUrl: "tables.component.html"
})
export class TablesComponent implements OnInit {
  devices: any[] = [];
  collectedData: any[] = []; // Para almacenar los datos filtrados

  selectedDeviceId: number;// Almacena el ID del dispositivo seleccionado
  showCreateModal: boolean = false;
  showEditModal: boolean = false;



  users: any[] = [];
  selectedDevice: any = {
    name: '',
    description: '',
    userId: null
  };

  constructor(private deviceService: DataCollectionDeviceService) {}

  ngOnInit() {
    this.getDataCollectionDevices();
    this.loadUsers();
  }

  loadUsers(): void {
    this.deviceService.getUsers().subscribe(users => {
      this.users = users;
      console.log('Usuarios cargados:', this.users); // Para verificar que se están cargando los usuarios
    });
  }

  getDataCollectionDevices(): void {
    this.deviceService.getDataCollectionDevices().subscribe(
      data => {
        this.devices = data;
      },
      error => {
        console.error('Error al obtener dispositivos:', error);
      }
    );
  }

  // Nuevo método para obtener los datos recolectados por Device ID


  

  loadCollectedData(): void {
    this.selectedDeviceId = +this.selectedDeviceId; // Convierte a número

    this.selectedDeviceId = +this.selectedDeviceId; // Asegúrate de que sea un número
    console.log('Device ID seleccionado:', this.selectedDeviceId);
    
    if (this.selectedDeviceId) {
      this.deviceService.getCollectedData().subscribe(
        (data: any[]) => {
          console.log('Datos originales:', data);
          this.collectedData = data.filter(item => item.dataCollectionDeviceId === this.selectedDeviceId);
          console.log('Datos filtrados:', this.collectedData);
        },
        error => {
          console.error('Error al obtener datos recolectados:', error);
        }
      );
    } else {
      alert('Por favor, selecciona un dispositivo.');
    }
  }
  
  
  
  
  

  openCreateModal(): void {
    this.selectedDevice = { name: '', description: '', userId: null };
    this.showCreateModal = true;
  }

  openEditModal(device: any): void {
    this.selectedDevice = {
      id: device.id,
      name: device.name,
      description: device.description,
      userId: device.userId
    };
    this.showEditModal = true;
  }

  getUserFullName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.fullName : 'Usuario no encontrado'; // Retorna el nombre o un mensaje si no se encuentra
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.selectedDevice = { name: '', description: '', userId: null }; // Reiniciar
  }

  saveDevice(): void {
    console.log('Datos a enviar:', this.selectedDevice);

    if (this.selectedDevice.id) {
      this.deviceService.updateDataCollectionDevice(this.selectedDevice.id, this.selectedDevice).subscribe(
        response => {
          console.log('Dispositivo actualizado:', response);
          this.getDataCollectionDevices();
          this.closeModals();
        },
        error => {
          console.error('Error al actualizar dispositivo:', error);
        }
      );
    } else {
      this.deviceService.createDataCollectionDevice(this.selectedDevice).subscribe(
        response => {
          console.log('Dispositivo creado:', response);
          this.getDataCollectionDevices();
          this.closeModals();
        },
        error => {
          console.error('Error al crear dispositivo:', error);
        }
      );
    }
  }

  confirmDelete(deviceId: number): void {
    const confirmation = confirm('¿Estás seguro de que deseas eliminar este registro?');
    if (confirmation) {
      this.deleteDevice(deviceId);
    }
  }

  deleteDevice(deviceId: number): void {
    this.deviceService.deleteDataCollectionDevice(deviceId).subscribe(
      response => {
        console.log('Dispositivo eliminado:', response);
        this.getDataCollectionDevices();
      },
      error => {
        console.error('Error al eliminar dispositivo:', error);
      }
    );
  }
}
