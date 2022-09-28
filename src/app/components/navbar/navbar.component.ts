import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'src/app/interfaces/menu-item';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  menuItems: MenuItem[] = [
    {
      name: 'My Movies',
      route: '/movies',
      icon: 'remove_red_eye'
    },
    {
      name: 'Wishlist',
      route: '/wishlist',
      icon: 'favorite'
    },
    {
      name: 'Search',
      route: '/search',
      icon: 'search'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
