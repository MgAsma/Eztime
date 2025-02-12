import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Notification {
  id: number;
  text: { name: string };
  created_datetime: string;
  isSeen: boolean; //  Track seen/unseen status
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  user_id = sessionStorage.getItem('user_id');
  private pageSize = 6; 
  private apiUrl = `${environment.live_url}/${environment.notification}/?user-id=${this.user_id}`;

  // Store all notifications
  allNotifications: Notification[] = [];

  // Store displayed notifications
  private displayedNotificationsSubject = new BehaviorSubject<Notification[]>([]);
  displayedNotifications$ = this.displayedNotificationsSubject.asObservable();

  //  Load seen notifications from localStorage
  seenNotifications = new Set<number>(JSON.parse(localStorage.getItem('seenNotifications') || '[]'));

    // Start with first 6 notifications
    notificationCount = new BehaviorSubject(0);
    disabledView = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}
  //  Fetch all notifications initially
  fetchAllNotifications(): void {
    this.http.get<{ results: Notification[] }>(this.apiUrl).subscribe(
      (response) => {
        if (response.results) {
          this.allNotifications = response.results.map(notification => ({
            ...notification,
            isSeen: this.seenNotifications.has(notification.id) //  Restore seen state from storage
          }));

          // Load initial notifications
          this.displayedNotificationsSubject.next(this.allNotifications.slice(0, this.pageSize));
          this.notificationCount.next(this.allNotifications?.length - this.seenNotifications?.size)
        }
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  //  Load more notifications when "View More" is clicked
  loadMoreNotifications(): void {
    let newPageSize = this.pageSize + 10; // Load 10 more
    if (newPageSize > this.allNotifications.length) {
      newPageSize = this.allNotifications.length; // Don't exceed total notifications
    }

    if (newPageSize === this.pageSize) {
      console.warn('No more notifications to load');
      this.disabledView.next(true);
      return;
    }

    //  Preserve seen status when loading more
    const newNotifications = this.allNotifications.slice(0, newPageSize).map(notification => ({
      ...notification,
      isSeen: this.seenNotifications.has(notification.id) // Restore seen status from Set
    }));

    this.displayedNotificationsSubject.next(newNotifications);
    this.pageSize = newPageSize;
  }

  //  Mark newly loaded notifications as seen
  markNewlyLoadedAsSeen(): void {
    this.allNotifications.slice(0, this.pageSize).forEach(notification => {
      this.seenNotifications.add(notification.id);
      notification.isSeen = true;
    });

    //  Save seen notifications to localStorage
    localStorage.setItem('seenNotifications', JSON.stringify([...this.seenNotifications]));

    //  Update displayed notifications to reflect changes
    this.displayedNotificationsSubject.next([...this.allNotifications.slice(0, this.pageSize)]);
    this.notificationCount.next(this.allNotifications?.length - this.seenNotifications?.size)

  }
}
