import { Component } from '@angular/core';
import { Navabar } from '../navabar/navabar';

@Component({
  imports: [Navabar],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
}
