import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-organogram',
  templateUrl: './organogram.component.html',
  styleUrls: ['./organogram.component.sass'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX({{offset}}%)' }),
        animate('0.5s ease-in-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ], { params: { offset: 100 } })
    ]),
    trigger('hoverAnimation', [
      state('default', style({ transform: 'scale(1)', boxShadow: 'none' })),
      state('hover', style({ transform: 'scale(1.08)', boxShadow: '0px 4px 15px rgba(0,0,0,0.2)' })),
      transition('default <=> hover', animate('0.3s ease-in-out'))
    ])
    // trigger('hoverAnimation', [
    //   state('default', style({ transform: 'scale(1) translateY(0)', boxShadow: 'none' })),
    //   state('hover', style({ transform: 'scale(1.08) translateY(-10px)', boxShadow: '0px 4px 15px rgba(0,0,0,0.2)' })),
    //   transition('default <=> hover', animate('0.3s ease-in-out'))
    // ])
  ]
})
export class OrganogramComponent implements OnInit {
  currentPage = 0;
  profilesPerPage = 4;
  slideDirection = 100;
  searchQuery: FormControl = new FormControl();
  hoveredCard: number | null = null;
  activeIndex: number | null = null;
  emojis: string[] = ["🌻", "🌹", "🌷"];




  profiles = [
    { name: 'Chiranjeevi', role: 'Sr. Project Manager', experience: '12 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: true },
    { name: 'Rajender Bhukya', role: 'Software Engineer', experience: '5 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Ravi Kumar', role: 'Software Engineer', experience: '15 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Priya Sharma', role: 'Product Manager', experience: '7 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Amit Verma', role: 'Data Scientist', experience: '6 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Rajendra Naik Bhukya', role: 'Software Engineer', experience: '5 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Ravi Kumar', role: 'Software Engineer', experience: '5 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Priya Sharma', role: 'Product Manager', experience: '7 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Arjun Patel', role: 'Sr. Project Manager', experience: '12 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Vikram Singh', role: 'Software Engineer', experience: '5 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Meena Agarwal', role: 'Product Manager', experience: '7 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Rohan Joshi', role: 'Data Scientist', experience: '6 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Neha Gupta', role: 'Software Engineer', experience: '5 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Rajender Bhukya', role: 'Software Engineer', experience: '5 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Ravi Kumar', role: 'Software Engineer', experience: '5 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Priya Sharma', role: 'Product Manager', experience: '7 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Gautam Malhotra', role: 'Product Manager', experience: '7 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Swati Mishra', role: 'Data Scientist', experience: '6 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Varun Iyer', role: 'Software Engineer', experience: '5 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Pooja Kapoor', role: 'Product Manager', experience: '7 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Ajay Nair', role: 'Data Scientist', experience: '6 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Divya Saxena', role: 'Software Engineer', experience: '5 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Harish Mehta', role: 'Product Manager', experience: '7 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Sneha Reddy', role: 'Data Scientist', experience: '6 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Yash Agarwal', role: 'Software Engineer', experience: '5 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Preeti Verma', role: 'Product Manager', experience: '7 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Chetan Joshi', role: 'Data Scientist', experience: '6 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Sarita Yadav', role: 'Software Engineer', experience: '5 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Manish Goyal', role: 'Product Manager', experience: '7 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Anita Menon', role: 'Data Scientist', experience: '6 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
    { name: 'Kundana', role: 'Project Manager', experience: '1 years', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9XXU7SVb7ZkED-wSC9xKUgvs7qD8ypvLxpjllkTcd_pv_ne1jpQrbvCme2MEXMMIMBM&usqp=CAU', bgDark: false },
  ];

  filteredProfiles = [...this.profiles];

  teams = [
    { name: 'Application Development' },
    { name: 'Data Science' },
    { name: 'Cyber Security' },
    { name: 'Cloud Computing' },
    { name: 'DevOps' },
    { name: 'Product Management' },
    { name: 'Quality Assurance' },
    { name: 'Data Science' },
    { name: 'Cyber Security' },
    { name: 'Cloud Computing' },
    { name: 'DevOps' },
    { name: 'Product Management' },
    { name: 'Quality Assurance' },
    { name: 'Data Science' },
    { name: 'Cyber Security' },
    { name: 'Cloud Computing' },
    { name: 'DevOps' },
    { name: 'Product Management' },
    { name: 'Quality Assurance' },
    { name: 'IT Support' },
    { name: 'Application Development' },
    { name: 'Data Science' },
    { name: 'Cyber Security' },
    { name: 'Cloud Computing' },
    { name: 'DevOps' },
    { name: 'Product Management' },
    { name: 'Quality Assurance' },
    { name: 'Data Science' },
    { name: 'Cyber Security' },
    { name: 'Cloud Computing' },
    { name: 'DevOps' },
    { name: 'Product Management' },
    { name: 'Quality Assurance' },
    { name: 'Data Science' },
    { name: 'Cyber Security' },
    { name: 'Cloud Computing' },
    { name: 'DevOps' },
    { name: 'Product Management' },
    { name: 'Quality Assurance' },
    { name: 'IT Support' }
  ];

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.searchQuery.valueChanges.subscribe((value: string) => {
      console.log(value);
      this.currentPage = 0;
      this.filterProfiles(value);
    });
  }

  filterProfiles(query: string) {
    const lowerCaseQuery = query.toLowerCase().trim();
    this.profiles = this.filteredProfiles.filter(profile =>
      Object.values(profile).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(lowerCaseQuery)
      )
    );
  }

  get paginatedProfiles() {
    const start = this.currentPage * this.profilesPerPage;
    return this.profiles.slice(start, start + this.profilesPerPage);
  }

  get maxPage() {
    return Math.ceil(this.profiles.length / this.profilesPerPage) - 1;
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.slideDirection = -100;
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.maxPage) {
      this.slideDirection = 100;
      this.currentPage++;
    }
  }

  setHover(index: number | null) {
    this.hoveredCard = index;
  }

  setActive(index: number) {
    this.activeIndex = index;
    this.profiles.forEach((profile, i) => profile.bgDark = i === (this.currentPage * this.profilesPerPage + index));
  }

  trackingPage(id: string) {
    this.router.navigate(['organogram', id]);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const emoji = this.renderer.createElement('div');
    const randomEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
    emoji.innerText = randomEmoji;

    this.renderer.addClass(emoji, 'emoji-trail');
    this.renderer.setStyle(emoji, 'left', `${event.clientX}px`);
    this.renderer.setStyle(emoji, 'top', `${event.clientY}px`);

    const container = this.el.nativeElement.querySelector('.emoji-container');
    this.renderer.appendChild(container, emoji);

    // Remove emoji after animation
    setTimeout(() => {
      this.renderer.removeChild(container, emoji);
    }, 10000);
  }
}
