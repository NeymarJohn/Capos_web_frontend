import { Component } from '@angular/core';
import { Settings, AppSettings } from '../../components/shared/services/color-option.service';

@Component({
  selector: 'app-color-options',
  templateUrl: './color-options.component.html',
  styleUrls: ['./color-options.component.sass']
})
export class ColorOptionsComponent {
  public showOptions:boolean = false;
  public activeItem: string;
  public layoutsidebar: boolean = false;
  public settings: Settings;
  public dark: boolean;

  public show:boolean = false;
  public buttonName:any = 'Dark';
  constructor(public appSettings:AppSettings) { 
    this.settings = this.appSettings.settings; 
  }

  public changeTheme(theme){
    this.settings.theme = theme;       
  } 

    // Is active 
    isActive(menuItem) {
      return this.activeItem === menuItem
    }



   // Set Theme color
   customizeThemeColor(event) {
    document.documentElement.style.setProperty('--theme-deafult', event.target.value);
  }
    // Sidebar Toggle
    layoutSidebarToggle() {
      this.layoutsidebar = !this.layoutsidebar
    }

    customizeLayoutDark() {
      document.body.classList.toggle('dark')

      this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.show)  
      this.buttonName = "Light";
    else
      this.buttonName = "Dark";
  }
    }
