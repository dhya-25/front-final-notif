import { Component, OnInit } from '@angular/core';
import { PushNotificationsService } from 'ng-push-ivy';
import { WebsocketService } from './shared/services/websocket.service';
import { NotificationService } from './shared/services/notification.service';
import { AppNotification } from './shared/model/app-notification';

const icon = new Map([
  ['info', 'assets/bell-info.png'],
  ['warn', 'assets/bell-warning.png']
]);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
list:any[]
  title = 'Web push Notifications!';
  counter: number;

  constructor(private pushNotifications: PushNotificationsService,
              private notificationService: NotificationService,
              private websocketService: WebsocketService) {
    this.pushNotifications.requestPermission();
    this.counter=0 ;
  }

  ngOnInit() {
    this.connect();
  }
  connect(): void {
    this.websocketService.connect();

    // subscribe receives the value.
    this.notificationService.notificationMessage.subscribe((data) => {
      console.log('receive message', data);

      this.notify(data);
    });
  }




  notify(message: AppNotification): void {
    this.counter++;
    const options = {
      body: message.libelle_notif,
      icon: icon.get(message.type_notif.toLowerCase())
    };
    this.list.push(message)
    console.log(this.list)
    this.pushNotifications.create('New Alert', options).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }
}
