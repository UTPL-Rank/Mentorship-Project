import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import {
  Activity,
  AlertCircle,
  Archive,
  ChevronLeft,
  FilePlus,
  FileText,
  Home,
  List,
  MessageCircle,
  PieChart,
  Upload,
  Download,
  Users,
  Printer,
  Grid,
  Menu,
  Database
} from 'angular-feather/icons';

// Check all icons available: https://github.com/michaelbazos/angular-feather

// Select some icons (use an object, not an array)
const icons = {
  ChevronLeft,
  Home,
  PieChart,
  Activity,
  List,
  MessageCircle,
  AlertCircle,
  Upload,
  Download,
  FilePlus,
  FileText,
  Users,
  Archive,
  Printer,
  Grid,
  Menu,
  Database
};

@NgModule({
  imports: [
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }

// NOTES:
// 1. We add FeatherModule to the 'exports', since the <i-feather> component will be used in templates of parent module
// 2. Don't forget to pick some icons using FeatherModule.pick({ ... })
