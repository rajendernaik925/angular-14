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
  isOpen = false;




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
  ];

  candidates = [
    {
      image: 'https://media.licdn.com/dms/image/v2/D4E03AQE61b20q9jYSA/profile-displayphoto-shrink_800_800/B4EZYFPQS1HYAg-/0/1743844608872?e=1752105600&v=beta&t=oU3T7NbG4IDxsKYb0SMl9KyuCKqQa4pQSeuuHOS3fWc',
      name: 'Rajendra Naik',
      designation: 'Software Developer',
      experience: '5 Years',
      location: 'Hyderabad, India',
      email: 'rajender@example.com',
      phone: '+91-9876543210'
    },
    {
      image: 'https://i.pinimg.com/736x/c6/34/60/c6346030acb7a780af81803c84a06680.jpg',
      name: 'Rani Sharma',
      designation: 'Frontend Developer',
      experience: '3 Years',
      location: 'Bangalore, India',
      email: 'rani@example.com',
      phone: '+91-9123456780'
    },
    {
      image: 'https://sso.heterohcl.com/iconnectpics/10515/DSC_1705.png',
      name: 'Durga Prasad',
      designation: 'Backend Developer',
      experience: '4 Years',
      location: 'Chennai, India',
      email: 'chinna@example.com',
      phone: '+91-9988776655'
    },
    {
      image: 'https://sso.heterohcl.com/iconnectpics/13431/rajender.jpeg',
      name: 'Chinna',
      designation: 'UI/UX Designer',
      experience: '6 Years',
      location: 'Pune, India',
      email: 'durga@example.com',
      phone: '+91-9811223344'
    },
    {
      image: 'https://sso.heterohcl.com/iconnectpics/13066/WhatsApp%20Image%202024-02-10%20at%204.28.56%20PM.jpeg',
      name: 'Venu babu gurram',
      designation: 'DevOps Engineer',
      experience: '5 Years',
      location: 'Mumbai, India',
      email: 'venu@example.com',
      phone: '+91-8877665544'
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBaesfW7UaeTkOeCmDyrsM66YTtisobhLL5Q&s',
      name: 'Swapna Reddy',
      designation: 'QA Engineer',
      experience: '4 Years',
      location: 'Delhi, India',
      email: 'swapna@example.com',
      phone: '+91-9090909090'
    }
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

  clickCount = 0;

  candidate = this.candidates[0]; // Default to first

  toggleOffcanvas(event: Event) {
    event.stopPropagation();
    this.isOpen = false;

    setTimeout(() => {
      // Cycle through the 6 candidates
      this.candidate = this.candidates[this.clickCount % this.candidates.length];
      this.clickCount++;
      this.isOpen = true;
    }, 300);
  }

  closeOffcanvas() {
    this.isOpen = false;
  }


  handleDoubleClick(id: any, event: Event): void {
    event.stopPropagation();
    this.isOpen = false;
    setTimeout(() => {
      this.isOpen = true;
    }, 1000);
  }


  prevPage() {
    this.isOpen = false;
    if (this.currentPage > 0) {
      this.slideDirection = -100;
      this.currentPage--;
    }
  }

  nextPage() {
    this.isOpen = false;
    if (this.currentPage < this.maxPage) {
      this.slideDirection = 100;
      this.currentPage++;
    }
  }

  setHover(index: number | null) {
    this.hoveredCard = index;
  }

  setActive(index: number, event: Event) {
    this.isOpen = false;
    event.stopPropagation();
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
