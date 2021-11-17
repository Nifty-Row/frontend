import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscribeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
