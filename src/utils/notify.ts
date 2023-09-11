export class WebNotify {
  private static _instance: WebNotify;
  private _permission: NotificationPermission;
  private _notify: Notification | undefined;

  constructor() {
    this._permission = Notification?.permission ?? 'default';
    this.requestPermission()
      .then()
      .catch((err) => {
        // console.error(err);
        console.dir(err);
      });
  }

  public static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  public async requestPermission() {
    if (Notification.permission === 'granted') {
      return Notification.permission;
    }
    const permission = await Notification.requestPermission((permission) => permission);
    if (permission !== 'granted') {
      throw new Error('Permission not granted for Notification');
    }
    this._permission = permission;
  }

  public async notify(title: string, options: NotificationOptions) {
    if (this._permission !== 'granted') {
      await this.requestPermission();
    }
    if (this._permission !== 'granted') {
      return;
    }
    this._notify = new Notification(title, options);

    this._notify.onclick = () => {
      window.focus();
    };

    this._notify.onclose = () => {
      console.log('Notification closed');
    };

    this._notify.onerror = () => {
      console.error('Notification error');
    };

    this._notify.onshow = () => {
      console.log('Notification shown');
    };
    return this._notify;
  }

  public close() {
    this._notify?.close();
  }
}
