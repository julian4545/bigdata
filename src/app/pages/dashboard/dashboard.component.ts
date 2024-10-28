import { Component, OnInit, OnDestroy } from "@angular/core";
import { CollectedDataService } from "src/app/services/collected-data.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit, OnDestroy {
  collectedDataList: any[] = [];
  recommendations: string[] = [];
  lastCollectedData: any;
  itemsPerPage: number = 50;
  currentPage: number = 1;
  totalPages: number = 0;
  paginatedDataList: any[] = [];
  pageOptions: number[] = [50, 100, 200];
  elapsedTime: number = 0;
  interval: any;
  pollingInterval: any;
  devices: any[] = [];

  conditionStatus: any = {
    temperature: { isOptimal: true, message: '' },
    humidity: { isOptimal: true, message: '' },
    pressure: { isOptimal: true, message: '' },
    airQuality: { isOptimal: true, message: '' }
  };

  constructor(private collectedDataService: CollectedDataService) {}

  ngOnInit() {
    this.loadDevices(); // Cargar dispositivos primero
    this.loadElapsedTime(); // Cargar tiempo antes de obtener datos
    this.getCollectedData();
    this.startPolling();
    
  }
  loadDevices(): void {
    this.collectedDataService.getDevices().subscribe(
      (devices) => {
        this.devices = devices;
        console.log('Devices:', this.devices); 
      },
      (error) => {
        console.error('Error al cargar dispositivos:', error);
      }
    );
  }

  getDeviceName(deviceId: number): string {
    const device = this.devices.find(d => d.id === deviceId);
    return device ? device.name : 'Desconocido';
}

  
  

  ngOnDestroy() {
    clearInterval(this.interval);
    clearInterval(this.pollingInterval);
    localStorage.setItem('elapsedTime', this.elapsedTime.toString());
  }

  getCollectedData(): void {
    console.log('Fetching data...');
    this.collectedDataService.getCollectedData().subscribe(
      data => {
        if (data && data.length > 0) {
          this.collectedDataList = data;
          const lastEntry = data[data.length - 1];
          console.log('Último registro recibido: ', lastEntry);
          this.lastCollectedData = lastEntry;

          this.startElapsedTime(); // Reiniciar el temporizador
          this.compareConditions(lastEntry);
          this.calculateTotalPages();
          this.updatePaginatedDataList();
        } else {
          console.log('No se encontraron datos.');
          this.collectedDataList = [];
          this.lastCollectedData = null;
        }
      },
      error => {
        console.error('Error fetching data: ', error);
        this.lastCollectedData = null;
      }
    );
  }

  startPolling(): void {
    this.pollingInterval = setInterval(() => {
      this.getCollectedData();
    }, 120000); // 2 minutos
  }

  startElapsedTime(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.elapsedTime = 0; // Reiniciar el tiempo al iniciar
    this.interval = setInterval(() => {
      this.elapsedTime++;
      localStorage.setItem('elapsedTime', this.elapsedTime.toString());
    }, 1000);
  }

  loadElapsedTime(): void {
    const savedElapsedTime = localStorage.getItem('elapsedTime');
    this.elapsedTime = savedElapsedTime ? parseInt(savedElapsedTime, 10) : 0; // Cargar el tiempo o inicializar en 0
  }

  getFormattedElapsedTime(): string {
    const hours = Math.floor(this.elapsedTime / 3600);
    const minutes = Math.floor((this.elapsedTime % 3600) / 60);
    const seconds = this.elapsedTime % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  compareConditions(data: any): void {
    const optimalZanahoria = {
      temperature: { min: 15, max: 21 },
      humidity: { min: 50, max: 70 },
      pressure: { min: 1010, max: 1020 },
      airQuality: { max: 10 }
    };

    this.recommendations = [];

    // Validar Temperatura para Zanahoria
    if (data.temperature < optimalZanahoria.temperature.min || data.temperature > optimalZanahoria.temperature.max) {
      this.conditionStatus.temperature.isOptimal = false;
      this.conditionStatus.temperature.message = 'La temperatura para zanahorias no es óptima. Aumentar riego o sombrear.';
      this.recommendations.push(this.conditionStatus.temperature.message);
    } else {
      this.conditionStatus.temperature.isOptimal = true;
      this.conditionStatus.temperature.message = 'Temperatura óptima para zanahorias.';
    }

    // Validar Humedad para Zanahoria
    if (data.humidity < optimalZanahoria.humidity.min || data.humidity > optimalZanahoria.humidity.max) {
      this.conditionStatus.humidity.isOptimal = false;
      this.conditionStatus.humidity.message = 'La humedad para zanahorias está fuera de rango. Ajustar riego o drenaje.';
      this.recommendations.push(this.conditionStatus.humidity.message);
    } else {
      this.conditionStatus.humidity.isOptimal = true;
      this.conditionStatus.humidity.message = 'Humedad óptima para zanahorias.';
    }

    // Validar Presión para Zanahoria
    if (data.pressure < optimalZanahoria.pressure.min || data.pressure > optimalZanahoria.pressure.max) {
      this.conditionStatus.pressure.isOptimal = false;
      this.conditionStatus.pressure.message = 'La presión para zanahorias está fuera de rango.';
      this.recommendations.push(this.conditionStatus.pressure.message);
    } else {
      this.conditionStatus.pressure.isOptimal = true;
      this.conditionStatus.pressure.message = 'Presión óptima para zanahorias.';
    }

    // Validar Calidad del Aire para Zanahoria
    if (data.airQuality > optimalZanahoria.airQuality.max) {
      this.conditionStatus.airQuality.isOptimal = false;
      this.conditionStatus.airQuality.message = 'La calidad del aire para zanahorias es baja. Mejora la ventilación.';
      this.recommendations.push(this.conditionStatus.airQuality.message);
    } else {
      this.conditionStatus.airQuality.isOptimal = true;
      this.conditionStatus.airQuality.message = 'Calidad del aire óptima para zanahorias.';
    }

    console.log('Recomendaciones:', this.recommendations);
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.collectedDataList.length / this.itemsPerPage);
  }

  onItemsPerPageChange() {
    this.currentPage = 1; // Reiniciar a la primera página al cambiar elementos por página
    this.calculateTotalPages();
    this.updatePaginatedDataList();
  }

  updatePaginatedDataList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedDataList = this.collectedDataList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedDataList();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedDataList();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedDataList();
    }
  }
}
