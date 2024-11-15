import { Component, OnInit } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;

  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/icons",
    title: "Dashboard",

    icon: "icon-puzzle-10",
    class: ""
  },  
  {

    path: "/dashboard",
    title: "DATA",
    icon: "icon-chart-pie-36",
    class: ""
  },
  
  {
    path: "/user",
    title: "User Profile",
    icon: "icon-single-02",
    class: ""
  },
  {
    path: "/tables",
    title: "Maquinas",

    icon: "icon-puzzle-10",
    class: ""
  },
  {
    path: "/notifications",
    title: "sensores",

    icon: "icon-puzzle-10",
    class: ""
  }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
